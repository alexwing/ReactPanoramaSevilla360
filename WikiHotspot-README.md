# WikiHotspot - Funcionalidad de Información de Wikipedia

## Descripción

Esta funcionalidad añade la capacidad de mostrar información de Wikipedia para los hotspots marcados en el panorama 360°. Cuando el usuario hace clic en un hotspot que tiene la clase `wiki-info`, se abre un modal con información de Wikipedia relacionada.

## Archivos creados

1. **WikiHotspot.tsx** - Componente principal que muestra el modal con información de Wikipedia
2. **WikiHotspot.css** - Estilos para el modal de Wikipedia
3. **LoadingDialog.tsx** - Componente de diálogo de carga
4. **AlertMessage.tsx** - Componente para mostrar mensajes de alerta

## Cómo funciona

### Configuración de hotspots

Los hotspots que deben mostrar información de Wikipedia deben tener en su `cssClass` la clase `wiki-info`. Ejemplo:

```json
{
  "id": "hotspot_1",
  "type": "info",
  "pitch": -8.1,
  "yaw": -75,
  "text": "Catedral de Sevilla",
  "URL": "https://es.wikipedia.org/wiki/Catedral_de_Sevilla",
  "cssClass": "pnlm-hotspot-base pnlm-hotspot pnlm-sprite pnlm-info pnlm-pointer pnlm-tooltip wiki-info"
}
```

### Detección de clicks

El sistema detecta clicks en hotspots usando dos métodos:

1. **Listener de eventos DOM** - Escucha clicks en elementos con clase `wiki-info`
2. **API de Pannellum** - Usa `clickHandlerFunc` si la biblioteca lo soporta

### Obtención de información

Cuando se hace clic en un hotspot de Wikipedia:

1. Se extrae el título desde la URL de Wikipedia o se usa el texto del hotspot
2. Se hace una consulta a la API de Wikipedia en español
3. Se obtiene el extracto del artículo y la imagen principal
4. Se muestra la información en un modal

### API de Wikipedia utilizada

```
https://es.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts|pageimages&piprop=original&format=json&exintro=&titles={título}
```

## Personalización

### Estilos

Los estilos se pueden personalizar en `WikiHotspot.css`. La clase `.alertWiki` controla la apariencia del modal.

### Idioma

La funcionalidad está configurada para usar Wikipedia en español, pero se puede modificar cambiando la URL base en `WikiHotspot.tsx`:

```typescript
const url = `https://es.wikipedia.org/w/api.php...`
```

Para usar en inglés:
```typescript
const url = `https://en.wikipedia.org/w/api.php...`
```

### Traducciones

Las traducciones se toman del sistema i18n existente usando la clave `wikiInfo.notFound` para errores.

## Debugging

Durante el desarrollo, se incluyen logs en la consola para facilitar el debugging:

- Clicks en hotspots
- Detección de hotspots de Wikipedia
- Búsqueda de datos de hotspots
- Errores de API

## Limitaciones

1. Requiere conexión a internet para obtener datos de Wikipedia
2. Depende de la disponibilidad de la API de Wikipedia
3. Solo funciona con hotspots que tengan la clase `wiki-info`
4. La extracción del título desde URLs de Wikipedia puede fallar con URLs muy complejas

## Uso

Una vez implementado, los usuarios simplemente necesitan hacer clic en cualquier hotspot que tenga un icono de información (clase `wiki-info`) para ver la información de Wikipedia en un modal.