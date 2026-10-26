/* ============================================================
 * SEGNO STUDIO — título, descripción e imagen de cada sección
 * ------------------------------------------------------------
 * Cada sección / subsección tiene URL propia (/sonido/film,
 * /es/sonido/film…). Los previews de WhatsApp, LinkedIn, X o Google
 * no ven el #hash ni corren JavaScript, así que middleware.js inyecta
 * estos textos en el <head> según la ruta. En el navegador,
 * index.html los usa para el título de la pestaña.
 *
 * Clave = ruta sin idioma ('' = portada). Una subsección que no esté
 * acá usa la de su sección.
 * Script clásico (sin export) para que sirva en el navegador y en el
 * middleware (que lo importa y lee globalThis.SEGNO_ROUTE_META).
 * ============================================================ */
(function () {
  const SITE = 'https://segnostudio.com';
  const IMG_DEFAULT = 'https://static.wixstatic.com/media/fdedb3_ee6b0b4c4ccf47b1b5b8101dd6b8943e~mv2.jpg';
  const vimeoStill = (hashPart) => 'https://i.vimeocdn.com/video/' + hashPart + '-d_1280x720';
  const vumb = (id) => 'https://vumbnail.com/' + id + '.jpg';
  const STUDIO = SITE + '/images/studio/';

  const IMG_ASTRO   = vimeoStill('2206556863-cabe0b0cb4d55b124def3a40f95fca68c6268d744b910cd70bd50b5da2a68f10');
  const IMG_SEED    = vimeoStill('2151313077-f64b94fae6dc9c7172383dbc4bbc81975dd3b7064a41613cf946e395ce3b6be5');
  const IMG_BAGO    = vimeoStill('2151388459-45fff001649b879cd0d7b2dc45c7f986318b825ce3bd5e7f653a679dd990d44f');
  const IMG_CHEVY   = vimeoStill('2151396339-1ab919705e3c842e232749f175b8862615e66735421563e37a39ad6b0842f201');

  const R = {
    '': {
      img: IMG_DEFAULT,
      en: { title: 'SEGNO STUDIO — Interactive Installations, Immersive Experiences, Sound Design',
            desc: 'Interactive installations, immersive experiences, music and sound design, apps & web, workshops.' },
      es: { title: 'SEGNO STUDIO — Instalaciones Interactivas, Experiencias Inmersivas, Diseño Sonoro',
            desc: 'Instalaciones interactivas, experiencias inmersivas, música y diseño sonoro, apps & web, talleres.' },
    },

    // ── Sonido ────────────────────────────────────────────────
    'sonido': {
      img: STUDIO + 'studio-01-control-wide.jpg',
      en: { title: 'Segno Sound — Music, Audio Post & Sound Design',
            desc: 'Original music, sound design, audio post-production and Dolby Atmos mixing. 400+ projects for Netflix, HBO and global brands.' },
      es: { title: 'Segno Sound — Música, Post de Audio y Diseño Sonoro',
            desc: 'Música original, diseño sonoro, post-producción de audio y mezcla Dolby Atmos. Más de 400 proyectos para Netflix, HBO y marcas globales.' },
    },
    'sonido/film': {
      img: 'https://img.youtube.com/vi/HHxSvR5k-hQ/maxresdefault.jpg',
      en: { title: 'Film | Series — Segno Sound',
            desc: 'Sound design, Foley, ADR and surround / Dolby Atmos mixing for feature films, documentaries and series on Netflix, HBO and more.' },
      es: { title: 'Cine | Series — Segno Sound',
            desc: 'Diseño sonoro, Foley, ADR y mezcla surround / Dolby Atmos para largometrajes, documentales y series de Netflix, HBO y más.' },
    },
    'sonido/animation': {
      img: vumb('939754996'),
      en: { title: 'Animation | Gaming — Segno Sound',
            desc: 'Sound design and music for animated series, game trailers and mobile games.' },
      es: { title: 'Animación | Juegos — Segno Sound',
            desc: 'Diseño sonoro y música para series animadas, trailers de juegos y juegos mobile.' },
    },
    'sonido/sonic': {
      img: vumb('939758042'),
      en: { title: 'Sonic Brand — Segno Sound',
            desc: 'Sonic identities, sound logos and audio systems for brands and broadcasters.' },
      es: { title: 'Identidad Sonora — Segno Sound',
            desc: 'Identidades sonoras, logos sonoros y sistemas de audio para marcas y señales de TV.' },
    },
    'sonido/openings': {
      img: vumb('939758072'),
      en: { title: 'Openings — Segno Sound',
            desc: 'Music and sound design for TV openings, IDs and title sequences.' },
      es: { title: 'Aperturas — Segno Sound',
            desc: 'Música y diseño sonoro para aperturas, IDs de canal y secuencias de títulos.' },
    },
    'sonido/advertising': {
      img: vumb('939239971'),
      en: { title: 'Advertising — Segno Sound',
            desc: 'Music, sound design and mixing for advertising campaigns.' },
      es: { title: 'Publicidad — Segno Sound',
            desc: 'Música, diseño sonoro y mezcla para campañas publicitarias.' },
    },
    'sonido/services': {
      img: STUDIO + 'studio-01-control-wide.jpg',
      en: { title: 'Studio — Segno Sound',
            desc: 'Dolby Atmos 7.1.2 control room, recording booth and live room. Composition, sound design, recording, voice & dubbing, mixing and mastering.' },
      es: { title: 'Estudio — Segno Sound',
            desc: 'Sala de control Dolby Atmos 7.1.2, cabina de grabación y sala de toma. Composición, diseño sonoro, grabación, voces y doblaje, mezcla y masterización.' },
    },
    'sonido/about': {
      img: STUDIO + 'studio-04-live-room.jpg',
      en: { title: 'About — Segno Sound',
            desc: 'Production company specializing in original music, sound design, sonic identity, dubbing and surround mixing. 400+ projects for global platforms.' },
      es: { title: 'Nosotros — Segno Sound',
            desc: 'Productora especializada en música original, diseño sonoro, identidad sonora, doblaje y mezcla surround. Más de 400 proyectos para plataformas globales.' },
    },
    'sonido/contact': {
      img: STUDIO + 'studio-02-control-desk.jpg',
      en: { title: 'Contact — Segno Sound',
            desc: 'Get in touch with Segno Sound for music, sound design and mixing.' },
      es: { title: 'Contacto — Segno Sound',
            desc: 'Contactá a Segno Sound para música, diseño sonoro y mezcla.' },
    },

    // ── Experiencias inmersivas ───────────────────────────────
    'experiencias': {
      img: IMG_ASTRO,
      en: { title: 'Immersive Experiences — SEGNO STUDIO',
            desc: 'Immersive rooms, fulldome, 360° LED tunnels and audiovisual performances.' },
      es: { title: 'Experiencias Inmersivas — SEGNO STUDIO',
            desc: 'Salas inmersivas, fulldome, túneles LED 360° y performances audiovisuales.' },
    },

    // ── Instalaciones interactivas ────────────────────────────
    'instalaciones': {
      img: IMG_SEED,
      en: { title: 'Interactive Installations — SEGNO STUDIO',
            desc: 'Interactive walls, installations for brands, corporate events and festivals.' },
      es: { title: 'Instalaciones Interactivas — SEGNO STUDIO',
            desc: 'Paredes interactivas, instalaciones para marcas, eventos corporativos y festivales.' },
    },
    'instalaciones/interactive': {
      img: IMG_SEED,
      en: { title: 'Interactive — Interactive Installations — SEGNO STUDIO',
            desc: 'Interactive walls and installations that respond to people.' },
      es: { title: 'Interactivas — Instalaciones Interactivas — SEGNO STUDIO',
            desc: 'Paredes e instalaciones interactivas que responden al público.' },
    },
    'instalaciones/corporate': {
      img: IMG_BAGO,
      en: { title: 'Corporate — Interactive Installations — SEGNO STUDIO',
            desc: 'Installations and content for corporate conventions and events.' },
      es: { title: 'Corporativo — Instalaciones Interactivas — SEGNO STUDIO',
            desc: 'Instalaciones y contenido para convenciones y eventos corporativos.' },
    },
    'instalaciones/events': {
      img: IMG_CHEVY,
      en: { title: 'Events — Interactive Installations — SEGNO STUDIO',
            desc: 'Interactive installations for festivals, brand activations and live events.' },
      es: { title: 'Eventos — Instalaciones Interactivas — SEGNO STUDIO',
            desc: 'Instalaciones interactivas para festivales, activaciones de marca y eventos en vivo.' },
    },

    // ── Apps & web ────────────────────────────────────────────
    'apps': {
      img: IMG_DEFAULT,
      en: { title: 'Apps & Web — SEGNO STUDIO',
            desc: 'Augmented reality apps, retail experiences and web design.' },
      es: { title: 'Apps & Web — SEGNO STUDIO',
            desc: 'Apps de realidad aumentada, experiencias de retail y diseño web.' },
    },
    'apps/ar': {
      img: IMG_DEFAULT,
      en: { title: 'Augmented Reality — Apps & Web — SEGNO STUDIO',
            desc: 'Augmented reality apps for brands.' },
      es: { title: 'Realidad Aumentada — Apps & Web — SEGNO STUDIO',
            desc: 'Apps de realidad aumentada para marcas.' },
    },
    'apps/retail': {
      img: IMG_DEFAULT,
      en: { title: 'Retail — Apps & Web — SEGNO STUDIO',
            desc: 'Interactive retail experiences and in-store apps.' },
      es: { title: 'Retail — Apps & Web — SEGNO STUDIO',
            desc: 'Experiencias interactivas de retail y apps para puntos de venta.' },
    },

    // ── Workshops ─────────────────────────────────────────────
    'workshops': {
      img: 'https://static.wixstatic.com/media/fdedb3_55b70d9500cc4c48a516207fe9e31a64~mv2_d_5250_3143_s_4_2.jpg/v1/fill/w_1200,h_630,al_c,q_85/file.jpg',
      en: { title: 'Workshops — SEGNO STUDIO',
            desc: 'Workshops and laboratories to prototype crossings between experience, technology, image, sound and interaction.' },
      es: { title: 'Workshops — SEGNO STUDIO',
            desc: 'Workshops y laboratorios para prototipar cruces entre experiencia, tecnología, imagen, sonido e interacción.' },
    },
    'workshops/banda-de-robots': {
      img: 'https://static.wixstatic.com/media/fdedb3_55b70d9500cc4c48a516207fe9e31a64~mv2_d_5250_3143_s_4_2.jpg/v1/fill/w_1200,h_630,al_c,q_85/file.jpg',
      en: { title: 'Banda de Robots — Workshops — SEGNO STUDIO',
            desc: 'Educational innovation project combining engineering, electronics, programming, lutherie, visual arts and music to build a robot orchestra.' },
      es: { title: 'Banda de Robots — Workshops — SEGNO STUDIO',
            desc: 'Proyecto de innovación educativa que combina ingeniería, electrónica, programación, luthería, artes plásticas y música para crear una orquesta de robots.' },
    },
    'workshops/micra': {
      img: 'https://i.vimeocdn.com/video/1989933744-cab26900a8be2b50fb66c68ef98b7bb578c55672604cbd70529480c68b484c4f-d_1280x720',
      en: { title: 'MicRA · Micropraxiscopio — Workshops — SEGNO STUDIO',
            desc: 'Collective creation laboratory with microscopy, bioinstallations and interaural sound.' },
      es: { title: 'MicRA · Micropraxiscopio — Workshops — SEGNO STUDIO',
            desc: 'Laboratorio de creación colectiva con microscopía, bioinstalaciones y sonido interaural.' },
    },
    'workshops/astrologio': {
      img: SITE + '/images/astrologio/green-tunnel.jpg',
      en: { title: 'Astro.log.io — Workshops — SEGNO STUDIO',
            desc: 'Personalized immersive soundscapes from natal charts, blending AI, astronomy and astrology.' },
      es: { title: 'Astro.log.io — Workshops — SEGNO STUDIO',
            desc: 'Paisajes sonoros inmersivos personalizados a partir de cartas natales, con IA, astronomía y astrología.' },
    },
    'workshops/ciclomusic': {
      img: IMG_DEFAULT,
      en: { title: 'Ciclomusic — Workshops — SEGNO STUDIO',
            desc: 'Ciclomusic workshop by SEGNO STUDIO.' },
      es: { title: 'Ciclomusic — Workshops — SEGNO STUDIO',
            desc: 'Taller Ciclomusic de SEGNO STUDIO.' },
    },
  };

  // Rutas válidas: sección conocida + subsección opcional
  const SECTIONS = ['sonido', 'experiencias', 'instalaciones', 'apps', 'workshops'];

  // '/es/sonido/film/' -> 'sonido/film'; cualquier otra cosa -> ''
  function routeFromPath(pathname) {
    const p = String(pathname || '').replace(/^\/+|\/+$/g, '').replace(/^es(\/|$)/, '');
    const parts = p.split('/');
    if (!SECTIONS.includes(parts[0])) return '';
    return parts.slice(0, 2).filter(Boolean).join('/');
  }

  // Ruta + idioma -> path ('/es/sonido/film', '/sonido', '/', '/es')
  function routePath(route, lang) {
    return ((lang === 'es' ? '/es' : '') + (route ? '/' + route : '')) || '/';
  }

  function routeMeta(route, lang) {
    const sec = String(route).split('/')[0];
    route = R[route] ? route : (R[sec] ? sec : '');
    const entry = R[route];
    const t = entry[lang === 'es' ? 'es' : 'en'];
    return {
      title: t.title,
      desc: t.desc,
      image: entry.img || IMG_DEFAULT,
      url: SITE + routePath(route, lang),
      urlEn: SITE + routePath(route, 'en'),
      urlEs: SITE + routePath(route, 'es'),
    };
  }

  globalThis.SEGNO_ROUTE_META = { SITE, SECTIONS, routes: R, routeFromPath, routePath, routeMeta };
})();
