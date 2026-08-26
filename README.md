# Emitos Peluqueria Canina — V1.1

Hardening básico manteniendo la misma apariencia y funcionamiento de la V1.

## Seguridad incorporada

- CSP básica.
- Referrer Policy.
- Recursos externos forzados a HTTPS.
- `object-src 'none'`.
- `base-uri 'self'`.
- Inputs limitados y normalizados.
- Carrito de `localStorage` validado antes de usarse.
- Cantidad máxima por producto.
- `CONFIG` y `PRODUCTS` congelados mediante `Object.freeze`.
- El mensaje de WhatsApp se reconstruye desde `PRODUCTS`.
- El precio visible en el HTML nunca se toma como fuente del pedido.
- `noopener,noreferrer`.
- Las imágenes externas no envían referrer.

## Imágenes

Continúan permitidas ambas opciones.

Externa:

    image: "https://sitio.com/producto.jpg"

Local en el repo:

    image: "images/producto.jpg"

Más adelante puede cambiarse la CSP a:

    img-src 'self' data:

para bloquear imágenes externas.

## Límite de esta arquitectura

Sin backend no existe una validación inviolable de precios.

Modificar únicamente el HTML visible ya no altera el mensaje generado, pero un usuario avanzado aún puede modificar JavaScript en su propio navegador.

Por eso, el pedido y el precio final deben seguir confirmándose por WhatsApp.
