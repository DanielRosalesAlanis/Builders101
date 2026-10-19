#![cfg(test)]

use super::*;
use soroban_sdk::testutils::Address as _;
use soroban_sdk::token::{StellarAssetClient, TokenClient};
use soroban_sdk::{Address, Env, String};

const PRECIO: i128 = 250_000_000; // 25 XLM

struct Prueba<'a> {
    env: Env,
    tix: TrustTixClient<'a>,
    token: TokenClient<'a>,
    organizador: Address,
}

fn preparar<'a>() -> Prueba<'a> {
    let env = Env::default();
    env.mock_all_auths();

    let emisor = Address::generate(&env);
    let activo = env.register_stellar_asset_contract_v2(emisor);
    let token_id = activo.address();

    let tix_id = env.register(TrustTix, (token_id.clone(),));
    let tix = TrustTixClient::new(&env, &tix_id);
    let token = TokenClient::new(&env, &token_id);
    let organizador = Address::generate(&env);

    Prueba { env, tix, token, organizador }
}

fn texto(env: &Env, t: &str) -> String {
    String::from_str(env, t)
}

fn crear(p: &Prueba, capacidad: u32, precio: i128) -> u32 {
    p.tix.crear_evento(
        &p.organizador,
        &texto(&p.env, "El Rey León"),
        &texto(&p.env, "Teatro Telcel"),
        &texto(&p.env, "2026-12-12T20:00"),
        &capacidad,
        &precio,
    )
}

fn con_saldo(p: &Prueba, cantidad: i128) -> Address {
    let cuenta = Address::generate(&p.env);
    StellarAssetClient::new(&p.env, &p.token.address).mint(&cuenta, &cantidad);
    cuenta
}

#[test]
fn comprar_cobra_paga_al_organizador_y_emite_el_boleto() {
    let p = preparar();
    let evento = crear(&p, 10, PRECIO);
    let comprador = con_saldo(&p, 1_000_000_000);

    let boleto = p.tix.comprar(&comprador, &evento);

    assert_eq!(boleto, 1);
    assert_eq!(p.token.balance(&comprador), 1_000_000_000 - PRECIO);
    assert_eq!(p.token.balance(&p.organizador), PRECIO);

    let b = p.tix.consultar_boleto(&boleto);
    assert_eq!(b.dueno, comprador);
    assert_eq!(b.evento, evento);
    assert!(!b.usado);
    assert_eq!(p.tix.consultar_evento(&evento).vendidos, 1);
    assert_eq!(p.tix.boletos_de(&comprador).len(), 1);
}

#[test]
fn no_se_vende_mas_que_la_capacidad() {
    let p = preparar();
    let evento = crear(&p, 2, 0);
    let a = Address::generate(&p.env);
    let b = Address::generate(&p.env);
    let c = Address::generate(&p.env);

    p.tix.comprar(&a, &evento);
    p.tix.comprar(&b, &evento);
    let tercera = p.tix.try_comprar(&c, &evento);

    assert_eq!(tercera, Err(Ok(Error::Agotado)));
    assert_eq!(p.tix.consultar_evento(&evento).vendidos, 2);
}

#[test]
fn sin_saldo_no_hay_boleto() {
    let p = preparar();
    let evento = crear(&p, 5, PRECIO);
    let sin_dinero = Address::generate(&p.env);

    assert!(p.tix.try_comprar(&sin_dinero, &evento).is_err());
    assert_eq!(p.tix.consultar_evento(&evento).vendidos, 0);
    assert_eq!(p.tix.total_boletos(), 0);
}

#[test]
fn solo_el_dueno_transfiere() {
    let p = preparar();
    let evento = crear(&p, 5, 0);
    let dueno = Address::generate(&p.env);
    let amigo = Address::generate(&p.env);
    let extrano = Address::generate(&p.env);
    let boleto = p.tix.comprar(&dueno, &evento);

    let intento = p.tix.try_transferir(&boleto, &extrano, &amigo);
    assert_eq!(intento, Err(Ok(Error::NoEsDueno)));

    p.tix.transferir(&boleto, &dueno, &amigo);
    assert_eq!(p.tix.consultar_boleto(&boleto).dueno, amigo);
    assert_eq!(p.tix.boletos_de(&dueno).len(), 0);
    assert_eq!(p.tix.boletos_de(&amigo).len(), 1);

    // El dueño anterior ya no puede moverlo.
    let otra_vez = p.tix.try_transferir(&boleto, &dueno, &extrano);
    assert_eq!(otra_vez, Err(Ok(Error::NoEsDueno)));
}

#[test]
fn una_sola_entrada_y_solo_personal_autorizado() {
    let p = preparar();
    let evento = crear(&p, 5, 0);
    let asistente = Address::generate(&p.env);
    let personal = Address::generate(&p.env);
    let colado = Address::generate(&p.env);
    let boleto = p.tix.comprar(&asistente, &evento);

    let sin_permiso = p.tix.try_registrar_entrada(&boleto, &colado);
    assert_eq!(sin_permiso, Err(Ok(Error::NoAutorizado)));

    p.tix.autorizar_personal(&evento, &personal);
    assert!(p.tix.es_personal(&evento, &personal));
    p.tix.registrar_entrada(&boleto, &personal);
    assert!(p.tix.consultar_boleto(&boleto).usado);

    let segunda = p.tix.try_registrar_entrada(&boleto, &personal);
    assert_eq!(segunda, Err(Ok(Error::YaUsado)));

    // Un boleto usado ya no se puede transferir.
    let amigo = Address::generate(&p.env);
    let transferir = p.tix.try_transferir(&boleto, &asistente, &amigo);
    assert_eq!(transferir, Err(Ok(Error::YaUsado)));
}

#[test]
fn el_organizador_puede_registrar_entradas_y_quitar_personal() {
    let p = preparar();
    let evento = crear(&p, 5, 0);
    let personal = Address::generate(&p.env);
    p.tix.autorizar_personal(&evento, &personal);
    p.tix.quitar_personal(&evento, &personal);
    assert!(!p.tix.es_personal(&evento, &personal));

    let asistente = Address::generate(&p.env);
    let boleto = p.tix.comprar(&asistente, &evento);
    p.tix.registrar_entrada(&boleto, &p.organizador);
    assert!(p.tix.consultar_boleto(&boleto).usado);
}

#[test]
fn validaciones_al_crear_y_consultar() {
    let p = preparar();
    let vacio = p.tix.try_crear_evento(
        &p.organizador,
        &texto(&p.env, "Sin lugares"),
        &texto(&p.env, "Ninguno"),
        &texto(&p.env, "2026-12-01T20:00"),
        &0,
        &0,
    );
    assert_eq!(vacio, Err(Ok(Error::CapacidadInvalida)));

    let negativo = p.tix.try_crear_evento(
        &p.organizador,
        &texto(&p.env, "Precio raro"),
        &texto(&p.env, "Ninguno"),
        &texto(&p.env, "2026-12-01T20:00"),
        &10,
        &-1,
    );
    assert_eq!(negativo, Err(Ok(Error::PrecioInvalido)));

    assert_eq!(p.tix.try_consultar_evento(&99), Err(Ok(Error::EventoNoExiste)));
    assert_eq!(p.tix.try_consultar_boleto(&99), Err(Ok(Error::BoletoNoExiste)));
    assert_eq!(p.tix.total_eventos(), 0);
}
