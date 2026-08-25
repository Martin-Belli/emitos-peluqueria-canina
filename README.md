# Pet Shop - Catálogo V1

Versión inicial de catálogo online sin backend.

## Incluye

- Catálogo responsive
- Filtro por categorías
- Buscador
- Carrito
- Cantidades
- Total
- Persistencia temporal del carrito en el navegador
- Envío del pedido por WhatsApp
- Sin base de datos
- Sin login
- Sin pagos online

## Archivos

- `index.html`: estructura de la página
- `styles.css`: estilos
- `productos.js`: configuración del negocio y catálogo
- `app.js`: lógica del catálogo, carrito y WhatsApp

## Qué editar primero

Abrir `productos.js`.

### Nombre del negocio

Cambiar:

    shopName: "Mi Pet Shop"

### WhatsApp

Usar formato internacional sin `+`, espacios ni guiones.

Ejemplo para Argentina:

    whatsappNumber: "5491123456789"

### Productos

Cada producto tiene:

- id
- name
- category
- price
- description
- image

Los precios se escriben como número, sin `$` ni puntos:

    price: 25000

## Cómo probarlo

Podés abrir `index.html` directamente en un navegador.

Para desarrollo es mejor usar un servidor local, por ejemplo la extensión "Live Server" de VS Code.

## Publicación

Esta versión puede publicarse como sitio estático en:

- GitHub Pages
- Cloudflare Pages
- Netlify
- Vercel

HTTPS puede obtenerse automáticamente con esos servicios.

## Seguridad de esta V1

No hay backend ni base de datos. El carrito vive en el navegador del cliente.

El pedido se envía por WhatsApp y debe ser confirmado manualmente.

No guardar claves, tokens, contraseñas o secretos dentro de estos archivos.
