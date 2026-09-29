// Routing Middleware (Vercel) — solo corre en /es.
// Sirve el mismo index.html pero con el <head> ya en español, para que
// Google y los previews de WhatsApp / LinkedIn / X vean título, descripción,
// idioma y canonical correctos sin esperar al JavaScript del navegador.
// El resto de la página se sigue traduciendo en el cliente (translations.js).
//
// Si cambiás meta.title / meta.description / meta.og.* en translations.js (bloque es),
// actualizá también estos textos.

export const config = {
  matcher: ['/es', '/es/:path*'],
};

const ES = {
  title: 'SEGNO STUDIO — Instalaciones Interactivas, Experiencias Inmersivas, Diseño Sonoro',
  description: 'SEGNO STUDIO — instalaciones interactivas, experiencias inmersivas, música y diseño sonoro, apps & web, y talleres de innovación. Más de 400 proyectos para plataformas globales.',
  ogTitle: 'SEGNO STUDIO',
  ogDesc: 'Instalaciones interactivas, experiencias inmersivas, música y diseño sonoro, apps & web, talleres.',
  url: 'https://segnostudio.com/es',
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function setAttr(html, selectorRe, attr, value) {
  return html.replace(selectorRe, (tag) =>
    tag.replace(new RegExp(`${attr}="[^"]*"`), `${attr}="${esc(value)}"`)
  );
}

export default async function middleware(request) {
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

  html = html.replace(/<html lang="[^"]*"/, '<html lang="es"');
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(ES.title)}</title>`);
  html = setAttr(html, /<meta name="description"[^>]*>/, 'content', ES.description);
  html = setAttr(html, /<link rel="canonical"[^>]*>/, 'href', ES.url);
  html = setAttr(html, /<meta property="og:url"[^>]*>/, 'content', ES.url);
  html = setAttr(html, /<meta property="og:title"[^>]*>/, 'content', ES.ogTitle);
  html = setAttr(html, /<meta property="og:description"[^>]*>/, 'content', ES.ogDesc);
  html = setAttr(html, /<meta property="og:locale"[^>]*>/, 'content', 'es_AR');
  html = setAttr(html, /<meta property="og:locale:alternate"[^>]*>/, 'content', 'en_US');
  html = setAttr(html, /<meta name="twitter:title"[^>]*>/, 'content', ES.ogTitle);
  html = setAttr(html, /<meta name="twitter:description"[^>]*>/, 'content', ES.ogDesc);

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
