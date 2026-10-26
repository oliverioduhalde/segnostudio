// Routing Middleware (Vercel).
// Sirve el mismo index.html pero con el <head> ya armado para la URL pedida:
// idioma (/es), sección y subsección (/sonido/film, /es/workshops/micra…) y,
// si hay ?play=<id de Vimeo>, el video en sí. Así Google y los previews de
// WhatsApp / LinkedIn / X (que no ven el #hash ni corren JavaScript) muestran
// el título, la descripción y la imagen de lo que efectivamente se comparte.
// El resto de la página se sigue traduciendo en el cliente (translations.js).
//
// Los textos por sección viven en route-meta.js (compartido con index.html).

import './route-meta.js';

export const config = {
  matcher: [
    '/',
    '/es',
    '/es/:path*',
    '/sonido/:path*',
    '/experiencias/:path*',
    '/instalaciones/:path*',
    '/apps/:path*',
    '/workshops/:path*',
  ],
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function setAttr(html, selectorRe, attr, value) {
  return html.replace(selectorRe, (tag) =>
    tag.replace(new RegExp(`${attr}="[^"]*"`), `${attr}="${esc(value)}"`)
  );
}

// Título (y miniatura propia, si tiene) de un video del sitio, buscándolo en el
// propio index.html: SONIDO_VIDEOS ({ id: "…", title: "…", thumbnail: "…" })
// o las tarjetas .film-card[data-vimeo-id] (<strong>Título</strong>).
function findVideo(html, id) {
  const entry = html.match(new RegExp(`\\{\\s*id:\\s*"${id}",\\s*title:\\s*"([^"]+)"[^\\n]*`));
  if (entry) {
    const thumb = entry[0].match(/thumbnail:\s*"([^"]+)"/);
    return { title: entry[1], image: thumb ? thumb[1] : null };
  }
  const card = html.match(new RegExp(`data-vimeo-id="${id}"[\\s\\S]{0,800}?<strong>([^<]+)</strong>`));
  if (card) {
    const img = card[0].match(/<img[^>]*src="([^"]+)"/);
    return { title: card[1], image: img ? img[1].replace(/\?.*$/, '') : null };
  }
  return null;
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const RM = globalThis.SEGNO_ROUTE_META;
  const lang = /^\/es(\/|$)/.test(url.pathname) ? 'es' : 'en';
  const route = RM.routeFromPath(url.pathname);
  const play = (url.searchParams.get('play') || '').replace(/[^0-9]/g, '');

  // portada en inglés sin video: index.html ya trae ese <head>
  if (lang === 'en' && !route && !play) return;

  let res;
  try {
    res = await fetch(new URL('/index.html', request.url), {
      headers: { accept: 'text/html' },
    });
  } catch {
    return; // si algo falla, sigue el flujo normal (rewrite de vercel.json)
  }
  if (!res.ok) return;

  let html = await res.text();
  const m = RM.routeMeta(route, lang);
  let { title, desc, image } = m;
  let ogTitle = route ? title : 'SEGNO STUDIO';
  let pageUrl = m.url;

  if (play) {
    const v = findVideo(html, play);
    if (v) {
      ogTitle = title = `${v.title} — ${route.startsWith('sonido') ? 'Segno Sound' : 'SEGNO STUDIO'}`;
      image = v.image || `https://vumbnail.com/${play}.jpg`;
      pageUrl += `?play=${play}`;
    }
  }

  html = html.replace(/<html lang="[^"]*"/, `<html lang="${lang}"`);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = setAttr(html, /<meta name="description"[^>]*>/, 'content', desc);
  html = setAttr(html, /<link rel="canonical"[^>]*>/, 'href', m.url);
  html = setAttr(html, /<link rel="alternate" hreflang="en"[^>]*>/, 'href', m.urlEn);
  html = setAttr(html, /<link rel="alternate" hreflang="es"[^>]*>/, 'href', m.urlEs);
  html = setAttr(html, /<link rel="alternate" hreflang="x-default"[^>]*>/, 'href', m.urlEn);
  html = setAttr(html, /<meta property="og:url"[^>]*>/, 'content', pageUrl);
  html = setAttr(html, /<meta property="og:title"[^>]*>/, 'content', ogTitle);
  html = setAttr(html, /<meta property="og:description"[^>]*>/, 'content', desc);
  html = setAttr(html, /<meta property="og:image"[^>]*>/, 'content', image);
  html = setAttr(html, /<meta property="og:locale"[^>]*>/, 'content', lang === 'es' ? 'es_AR' : 'en_US');
  html = setAttr(html, /<meta property="og:locale:alternate"[^>]*>/, 'content', lang === 'es' ? 'en_US' : 'es_AR');
  html = setAttr(html, /<meta name="twitter:title"[^>]*>/, 'content', ogTitle);
  html = setAttr(html, /<meta name="twitter:description"[^>]*>/, 'content', desc);
  html = setAttr(html, /<meta name="twitter:image"[^>]*>/, 'content', image);

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
