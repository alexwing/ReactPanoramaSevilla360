# Sevilla 360

Experiencia panorámica 360 del Guadalquivir a su paso por Sevilla, reconstruida a partir de las fotografías históricas tomadas por Jean Laurent alrededor de 1870.

El proyecto muestra varias versiones del panorama, permite cambiar de idioma, activar u ocultar puntos de interés y abrir información contextual de Wikipedia desde los hotspots.

![Sevilla 360](./public/ogimage.jpg)

Demo pública: http://mappuzzle.xyz/sevilla360/

## Stack

- React 18
- TypeScript
- Vite 5
- React Bootstrap
- i18next / react-i18next
- Pannellum mediante `react-pannellum`
- PWA con `vite-plugin-pwa`

## Requisitos

- Node.js 18 o superior
- npm
- Assets panorámicos dentro de `public/`

Los panoramas completos y tiles multiresolución son archivos grandes. En este repositorio se esperan bajo:

- `public/360photo`
- `public/360photoBN`
- `public/360photoOriginal`
- `public/hotspots.json`

## Desarrollo

Instala dependencias:

```bash
npm install
```

Arranca Vite:

```bash
npm run dev
```

La app usa `base: "/sevilla360/"`, así que en local se abre en:

```text
http://127.0.0.1:3000/sevilla360/
```

## Scripts

```bash
npm run dev        # servidor local de Vite
npm run build      # build de producción en ./build
npm run preview    # previsualiza el build
npm run typecheck  # validación TypeScript sin emitir archivos
```

## Estructura

```text
.
|-- index.html              # entrada HTML de Vite
|-- vite.config.ts          # config de Vite, base path y PWA
|-- public/                 # assets estáticos y tiles panorámicos
|-- python/                 # scripts para generar tiles de Pannellum
`-- src/
    |-- App.tsx             # selección de panoramas y cámara global
    |-- components/         # UI, menú, visor y modales
    |-- i18n/               # traducciones
    |-- services/           # configuración y APIs
    `-- styles/             # estilos globales
```

## Panoramas

Las escenas se definen en `src/App.tsx` como objetos `PanoramaMultiRes`.

Cada escena apunta a un directorio multiresolución en `public/`:

- `./360photo`
- `./360photoBN`
- `./360photoOriginal`

El formato de tiles actual es:

```text
/%l/%s%y_%x.jpg
```

Donde `%l` es el nivel de zoom, `%s` la cara del cubo, `%x` la columna y `%y` la fila.

## Hotspots

Los puntos de interés se cargan desde:

```text
public/hotspots.json
```

Para que un hotspot abra el modal de información, debe incluir la clase `wiki-info` en `cssClass` y una `URL`.

Ejemplo:

```json
{
  "id": "hotspot_3",
  "type": "info",
  "pitch": -7.3,
  "yaw": -56.3,
  "text": "Iglesia de Omnium Sanctorum",
  "URL": "https://es.wikipedia.org/wiki/Iglesia_de_Omnium_Sanctorum_(Sevilla)",
  "cssClass": "pnlm-hotspot-base pnlm-hotspot pnlm-sprite pnlm-info pnlm-pointer pnlm-tooltip wiki-info"
}
```

## Variables de entorno

Vite solo expone variables con prefijo `VITE_`. La configuración se centraliza en:

```text
src/services/configService.tsx
```

Variables soportadas:

```text
VITE_FOO
VITE_COOKIE_DAYS
VITE_EDITOR_ENABLED
VITE_BACKEND_URL
VITE_DATABASE
VITE_DEFAULT_LANG
VITE_LANGS
VITE_STALE_TIME
```

## PWA

La PWA se configura en `vite.config.ts`.

Los assets panorámicos grandes se excluyen del precache para evitar builds pesados y service workers excesivos:

- `360photo/**`
- `360photo-new/**`
- `360photoBN/**`
- `360photoOriginal/**`
- `360photo*.jpg`
- `images/**`

## Generación de tiles

El directorio `python/` contiene utilidades para generar tiles compatibles con Pannellum.

Ejemplo basado en `python/generate.bat`:

```bat
@echo off
python generate.py -n "C:\Program Files\Hugin\bin\nona.exe" --hfov 80 --voffset 0 --haov 200 --vaov 110 ../public/images/360photo.jpg
pause
```

Parámetros relevantes:

- `--hfov`: campo de visión horizontal inicial.
- `--voffset`: desplazamiento vertical.
- `--haov`: ángulo horizontal cubierto por el panorama.
- `--vaov`: ángulo vertical cubierto por el panorama.
- `-n`: ruta al binario `nona.exe` de Hugin.

Dependencias Python usadas originalmente:

```bash
pip install Pillow
pip install numpy
pip install pyshtools
```

## Nota sobre React 19

El proyecto está actualmente en React 18 porque es una base estable para `react-pannellum` 0.2.x.

La rama moderna de `react-pannellum` ya declara soporte para React 18 y React 19, pero cambia parte de la API imperativa hacia `usePannellum`. Si se quiere subir a React 19, el cambio natural es migrar `src/components/Panorama.tsx` al wrapper moderno o sustituir el wrapper por una integración local directa de Pannellum.

## Contexto histórico

Jean Laurent fue un fotógrafo francés afincado en España desde mediados del siglo XIX. Su trabajo documentó ciudades, arquitectura, paisajes y patrimonio cultural con un valor histórico enorme.

Este panorama parte de varias instantáneas del entorno del Guadalquivir. La reconstrucción combina coloreado, ajuste visual, ampliación por superresolución y generación de tiles multiresolución para poder explorarlo de forma fluida en navegador.
