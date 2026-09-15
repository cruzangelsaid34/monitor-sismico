# Alerta Sísmica México — paquete para publicar

Estos 5 archivos van juntos, en la misma carpeta:

- `index.html`
- `manifest.json`
- `service-worker.js`
- `icon-192.png`
- `icon-512.png`

## Publicarlo (elige una opción, ambas son gratis)

### Opción A — GitHub Pages
1. Crea un repositorio nuevo en GitHub (puede ser público).
2. Sube estos 5 archivos a la raíz del repo.
3. Ve a **Settings → Pages**, en "Source" elige la rama `main` y carpeta `/root`.
4. Guarda. En un par de minutos tu app queda en `https://tu-usuario.github.io/tu-repo/`.

### Opción B — Netlify (arrastrar y soltar, sin cuenta de GitHub)
1. Entra a https://app.netlify.com/drop
2. Arrastra la carpeta con los 5 archivos.
3. Netlify te da una URL con HTTPS al instante (algo como `nombre-random.netlify.app`).

Cualquiera de las dos te sirve — ambas dan HTTPS, que es requisito para que el
service worker y la instalación funcionen.

## Qué vas a poder hacer una vez publicado
- Abrir la URL desde el celular y usar "Agregar a pantalla de inicio" /
  "Instalar app" — queda como app normal, con ícono y sin barra del navegador.
- La app abre más rápido y funciona offline para la pantalla base (aunque
  claro, sin internet no hay datos de sismos nuevos).

## Qué NO hace esto todavía: notificaciones con la app cerrada
Un service worker no puede "despertar solo" a cada rato a revisar el USGS o
EMSC — solo reacciona a eventos reales (push, click de notificación, abrir la
app). Mientras la pestaña o la app instalada esté abierta (aunque sea en
segundo plano en el celular), las alertas suenan igual que ahora.

Para que te llegue una alerta con la app totalmente cerrada, se necesita un
servidor propio (aunque sea pequeño) que:
1. Monitoree el USGS/EMSC por ti, corriendo todo el tiempo.
2. Cuando detecte un sismo que cumpla el umbral, mande un **Web Push**
   (con claves VAPID) a los navegadores que se hayan suscrito.

Es una pieza de infraestructura aparte del sitio estático — si más adelante
quieres montarla (por ejemplo con un servidor gratuito tipo Cloudflare
Workers o un Node pequeño), dile a Claude y lo armamos.
