# TrustTix

## Requisitos

**Para el front:**

- [Node.js](https://nodejs.org/) 20.19 o superior (incluye npm).
- Git.
- La extensión [Freighter](https://www.freighter.app) en Chrome, Edge o Brave, configurada en **Testnet** y con saldo de prueba (botón **Fund with Friendbot** dentro de la extensión).

**Para el contrato (opcional; ya está desplegado en Testnet):**

- [Rust](https://www.rust-lang.org/tools/install) 1.84 o superior y el target `wasm32v1-none`.
- [Stellar CLI](https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup).
- En Windows, las herramientas de compilación de C++ de Visual Studio (Build Tools).

## Instalación

```bash
git clone https://github.com/DanielRosalesAlanis/Builders101.git
cd Builders101/frontend
npm install
```

Para el contrato:

```bash
rustup target add wasm32v1-none
```

## Cómo correrlo

**Front:**

```bash
cd frontend
npm run dev
```

Abre <http://localhost:5173>, inicia sesión y conecta Freighter. El front ya apunta al contrato desplegado en Testnet (`CDL3FPYBY7HDNFDCCJMUZ4OLWHXWX7AXZ3WWFFM7YYHKA3O3LDRGYK4R`).

**Pruebas del contrato:**

```bash
cd contracts
cargo test
```

**Compilar el contrato:**

```bash
cd contracts
stellar contract build
```

**Desplegar una instancia propia en Testnet (opcional):**

```bash
stellar keys generate mi-cuenta --network testnet --fund
stellar contract deploy --wasm target/wasm32v1-none/release/trusttix.wasm \
  --source-account mi-cuenta --network testnet \
  -- --token $(stellar contract id asset --asset native --network testnet)
```

Para usar esa instancia en el front, crea `frontend/.env.local` con `VITE_CONTRATO_ID=<id del contrato>` y vuelve a correr `npm run dev`.
