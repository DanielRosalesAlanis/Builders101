#![no_std]

//! Contrato TrustTix: boletos de eventos imposibles de duplicar.
//!
//! Reglas que hace cumplir la red:
//! 1. Un evento nunca vende más boletos que su capacidad.
//! 2. Cada boleto tiene un solo dueño, y solo ese dueño puede transferirlo.
//! 3. El pago al organizador y la emisión del boleto ocurren en la misma transacción.
//! 4. Solo el personal autorizado por el organizador registra entradas, y cada
//!    boleto entra una sola vez.

use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, token, Address, Env, String, Vec,
};

/// Ledgers aproximados en un día (un ledger cada ~5 segundos).
const DIA: u32 = 17_280;
/// Si a un registro le quedan menos de 7 días de vida, se extiende a 30.
const UMBRAL_TTL: u32 = 7 * DIA;
const EXTENDER_TTL: u32 = 30 * DIA;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    EventoNoExiste = 1,
    BoletoNoExiste = 2,
    Agotado = 3,
    NoEsDueno = 4,
    YaUsado = 5,
    NoAutorizado = 6,
    CapacidadInvalida = 7,
    PrecioInvalido = 8,
    MismoDueno = 9,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Evento {
    pub organizador: Address,
    pub nombre: String,
    pub recinto: String,
    pub fecha: String,
    pub capacidad: u32,
    pub vendidos: u32,
    /// Precio en la unidad mínima del token de pago (stroops si es XLM).
    pub precio: i128,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Boleto {
    pub evento: u32,
    pub dueno: Address,
    pub usado: bool,
    /// Marca de tiempo del ledger en que entró (0 si no se ha usado).
    pub usado_en: u64,
}

#[contracttype]
#[derive(Clone)]
enum Clave {
    Token,
    TotalEventos,
    TotalBoletos,
    Evento(u32),
    Boleto(u32),
    Personal(u32, Address),
    BoletosDe(Address),
}

// ---------- Eventos que quedan en el registro público ----------

#[contractevent]
pub struct EventoCreado {
    #[topic]
    pub evento: u32,
    pub organizador: Address,
    pub capacidad: u32,
}

#[contractevent]
pub struct Compra {
    #[topic]
    pub evento: u32,
    pub boleto: u32,
    pub comprador: Address,
    pub precio: i128,
}

#[contractevent]
pub struct Transferencia {
    #[topic]
    pub boleto: u32,
    pub de: Address,
    pub a: Address,
}

#[contractevent]
pub struct Entrada {
    #[topic]
    pub boleto: u32,
    pub evento: u32,
    pub personal: Address,
}

#[contract]
pub struct TrustTix;

#[contractimpl]
impl TrustTix {
    /// Se ejecuta una sola vez al desplegar. `token` es el contrato del activo
    /// con el que se paga (en Testnet, el Stellar Asset Contract de XLM).
    pub fn __constructor(env: Env, token: Address) {
        env.storage().instance().set(&Clave::Token, &token);
        env.storage().instance().set(&Clave::TotalEventos, &0u32);
        env.storage().instance().set(&Clave::TotalBoletos, &0u32);
    }

    // ---------- Organizador ----------

    /// Registra un evento. La capacidad queda fija y no se puede rebasar.
    pub fn crear_evento(
        env: Env,
        organizador: Address,
        nombre: String,
        recinto: String,
        fecha: String,
        capacidad: u32,
        precio: i128,
    ) -> Result<u32, Error> {
        organizador.require_auth();
        if capacidad == 0 {
            return Err(Error::CapacidadInvalida);
        }
        if precio < 0 {
            return Err(Error::PrecioInvalido);
        }

        let id = siguiente(&env, Clave::TotalEventos);
        let evento = Evento {
            organizador: organizador.clone(),
            nombre,
            recinto,
            fecha,
            capacidad,
            vendidos: 0,
            precio,
        };
        guardar(&env, &Clave::Evento(id), &evento);
        EventoCreado { evento: id, organizador, capacidad }.publish(&env);
        Ok(id)
    }

    /// El organizador autoriza una cuenta para registrar entradas en su evento.
    pub fn autorizar_personal(env: Env, evento_id: u32, cuenta: Address) -> Result<(), Error> {
        let evento = leer_evento(&env, evento_id)?;
        evento.organizador.require_auth();
        guardar(&env, &Clave::Personal(evento_id, cuenta), &true);
        Ok(())
    }

    /// El organizador retira la autorización de una cuenta.
    pub fn quitar_personal(env: Env, evento_id: u32, cuenta: Address) -> Result<(), Error> {
        let evento = leer_evento(&env, evento_id)?;
        evento.organizador.require_auth();
        env.storage().persistent().remove(&Clave::Personal(evento_id, cuenta));
        Ok(())
    }

    // ---------- Asistente ----------

    /// Cobra el precio al comprador, paga al organizador y emite el boleto,
    /// todo en la misma transacción. Falla si ya no quedan lugares.
    pub fn comprar(env: Env, comprador: Address, evento_id: u32) -> Result<u32, Error> {
        comprador.require_auth();
        let mut evento = leer_evento(&env, evento_id)?;
        if evento.vendidos >= evento.capacidad {
            return Err(Error::Agotado);
        }

        if evento.precio > 0 {
            let token: Address = env.storage().instance().get(&Clave::Token).unwrap();
            token::Client::new(&env, &token).transfer(&comprador, &evento.organizador, &evento.precio);
        }

        let id = siguiente(&env, Clave::TotalBoletos);
        let boleto = Boleto {
            evento: evento_id,
            dueno: comprador.clone(),
            usado: false,
            usado_en: 0,
        };
        guardar(&env, &Clave::Boleto(id), &boleto);
        agregar_a(&env, &comprador, id);

        evento.vendidos += 1;
        guardar(&env, &Clave::Evento(evento_id), &evento);

        Compra { evento: evento_id, boleto: id, comprador, precio: evento.precio }.publish(&env);
        Ok(id)
    }

    /// Solo el dueño actual puede transferir, y nunca un boleto ya usado.
    pub fn transferir(env: Env, boleto_id: u32, de: Address, a: Address) -> Result<(), Error> {
        de.require_auth();
        let mut boleto = leer_boleto(&env, boleto_id)?;
        if boleto.dueno != de {
            return Err(Error::NoEsDueno);
        }
        if boleto.usado {
            return Err(Error::YaUsado);
        }
        if de == a {
            return Err(Error::MismoDueno);
        }

        boleto.dueno = a.clone();
        guardar(&env, &Clave::Boleto(boleto_id), &boleto);
        quitar_de(&env, &de, boleto_id);
        agregar_a(&env, &a, boleto_id);

        Transferencia { boleto: boleto_id, de, a }.publish(&env);
        Ok(())
    }

    // ---------- Personal de acceso ----------

    /// Marca el boleto como usado. Un segundo intento se rechaza.
    pub fn registrar_entrada(env: Env, boleto_id: u32, personal: Address) -> Result<(), Error> {
        personal.require_auth();
        let mut boleto = leer_boleto(&env, boleto_id)?;
        let evento = leer_evento(&env, boleto.evento)?;
        let autorizado = personal == evento.organizador
            || env
                .storage()
                .persistent()
                .get::<_, bool>(&Clave::Personal(boleto.evento, personal.clone()))
                .unwrap_or(false);
        if !autorizado {
            return Err(Error::NoAutorizado);
        }
        if boleto.usado {
            return Err(Error::YaUsado);
        }

        boleto.usado = true;
        boleto.usado_en = env.ledger().timestamp();
        guardar(&env, &Clave::Boleto(boleto_id), &boleto);

        Entrada { boleto: boleto_id, evento: boleto.evento, personal }.publish(&env);
        Ok(())
    }

    // ---------- Consultas públicas (no requieren firma) ----------

    pub fn consultar_evento(env: Env, evento_id: u32) -> Result<Evento, Error> {
        leer_evento(&env, evento_id)
    }

    pub fn consultar_boleto(env: Env, boleto_id: u32) -> Result<Boleto, Error> {
        leer_boleto(&env, boleto_id)
    }

    pub fn total_eventos(env: Env) -> u32 {
        env.storage().instance().get(&Clave::TotalEventos).unwrap_or(0)
    }

    pub fn total_boletos(env: Env) -> u32 {
        env.storage().instance().get(&Clave::TotalBoletos).unwrap_or(0)
    }

    pub fn boletos_de(env: Env, cuenta: Address) -> Vec<u32> {
        env.storage()
            .persistent()
            .get(&Clave::BoletosDe(cuenta))
            .unwrap_or(Vec::new(&env))
    }

    pub fn es_personal(env: Env, evento_id: u32, cuenta: Address) -> bool {
        match leer_evento(&env, evento_id) {
            Ok(evento) if evento.organizador == cuenta => true,
            Ok(_) => env
                .storage()
                .persistent()
                .get(&Clave::Personal(evento_id, cuenta))
                .unwrap_or(false),
            Err(_) => false,
        }
    }

    pub fn token(env: Env) -> Address {
        env.storage().instance().get(&Clave::Token).unwrap()
    }
}

// ---------- Funciones internas ----------

fn siguiente(env: &Env, clave: Clave) -> u32 {
    let id: u32 = env.storage().instance().get(&clave).unwrap_or(0) + 1;
    env.storage().instance().set(&clave, &id);
    env.storage().instance().extend_ttl(UMBRAL_TTL, EXTENDER_TTL);
    id
}

fn guardar<V: soroban_sdk::IntoVal<Env, soroban_sdk::Val>>(env: &Env, clave: &Clave, valor: &V) {
    env.storage().persistent().set(clave, valor);
    env.storage().persistent().extend_ttl(clave, UMBRAL_TTL, EXTENDER_TTL);
}

fn leer_evento(env: &Env, id: u32) -> Result<Evento, Error> {
    env.storage()
        .persistent()
        .get(&Clave::Evento(id))
        .ok_or(Error::EventoNoExiste)
}

fn leer_boleto(env: &Env, id: u32) -> Result<Boleto, Error> {
    env.storage()
        .persistent()
        .get(&Clave::Boleto(id))
        .ok_or(Error::BoletoNoExiste)
}

fn agregar_a(env: &Env, cuenta: &Address, boleto_id: u32) {
    let clave = Clave::BoletosDe(cuenta.clone());
    let mut lista: Vec<u32> = env.storage().persistent().get(&clave).unwrap_or(Vec::new(env));
    lista.push_back(boleto_id);
    guardar(env, &clave, &lista);
}

fn quitar_de(env: &Env, cuenta: &Address, boleto_id: u32) {
    let clave = Clave::BoletosDe(cuenta.clone());
    let lista: Vec<u32> = env.storage().persistent().get(&clave).unwrap_or(Vec::new(env));
    if let Some(i) = lista.first_index_of(boleto_id) {
        let mut lista = lista;
        lista.remove(i);
        guardar(env, &clave, &lista);
    }
}

mod test;
