# tienda-widgets

Código propio de la tienda maktubblends.com.ar (Tiendanube, tema Amazonas).
Se sirve desde jsDelivr fijando el commit, por ejemplo:
`https://cdn.jsdelivr.net/gh/maktubblends/maktub-blends@<commit>/tienda-widgets/maktub-tema.css`

- `maktub-tema.css`: todos los estilos propios (antes en "Código CSS" y en el sello del pie). Se carga con `@import` desde "Código CSS".
- `maktub-tema.js`: scripts propios (antes en línea en el sello del pie). Se carga con `defer` desde el sello.
- `maktub-sello.js`, `maktub-widgets.min.js`: widgets anteriores, siguen cargándose desde el sello.
- `sello-original.html`: copia histórica del sello.

Para cambiar algo: editar el archivo, hacer commit, y actualizar el hash del commit en el panel de Tiendanube (Personalizar diseño → Código CSS / sello).
