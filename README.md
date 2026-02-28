# CineScope 🎬

> **English** | [Español](#español)

---

## English

CineScope started as a personal project — I wanted a clean, fast place to discover movies and TV shows without the noise of mainstream platforms. What began as a simple vanilla JavaScript app with hash-based routing eventually became something I'm genuinely proud of: a full-stack platform built with modern web technologies, real multilingual support, and a UI that actually feels cinematic.

---

### What it does

You open CineScope and you get trending content immediately — no loading screens, no skeleton flashes, just content. You can browse by genre, search for anything, save your favorites, and switch between 7 languages. Click on any movie or show and you get the full picture: cast, crew, streaming availability in your region, similar recommendations, and a score that actually means something.

The search works the way search should work — you type, you press Enter, you get results. No page jumping while you're still writing. On mobile it feels like a native app, with a bottom navigation bar and a dedicated search input right where your thumbs are.

---

### How it's built

The foundation is **Next.js 14** with the App Router. I chose this because it lets me be deliberate about what renders on the server and what renders in the browser. The home page, movie detail pages, and TV show pages are all server-rendered — meaning the first thing the browser receives is already populated with real content, which is both faster and better for SEO.

Interactive parts — infinite scroll grids, the favorites section, the command palette, the language switcher — live on the client. This split is intentional. There's no reason to ship JavaScript for content that never changes once loaded.

State management is handled by **Zustand**, a lightweight alternative to Redux. I use two stores: one for the favorites system (saved to `localStorage` so it persists between sessions) and one for the active language. Both are kept in sync between the server and client through a pattern I built specifically for this project.

The styling is pure **Tailwind CSS** with custom design tokens. The visual identity — dark backgrounds, violet glow accents, glassmorphism panels, the film grain overlay — was built entirely in utility classes without a single external UI component library.

Data comes from the **TMDB API**, which provides movies, TV shows, cast and crew, streaming providers, and search. Every piece of content on the platform flows through a typed API layer that ensures consistent data regardless of what TMDB returns.

---

### The hard parts

#### Making translations actually work across the server

The trickiest engineering challenge was multilingual support. Most tutorials show you how to translate static text on the client — but TMDB itself returns translated content (titles, descriptions, genres) when you pass a language code to the API. The problem is: how does the server know which language the user selected if that preference lives in the browser?

The solution was a cookie bridge. When you pick a language in the dropdown, the app writes a small cookie. The server reads that cookie on every request and passes the correct language code to the TMDB API. The result is that translated content arrives from the database already in your language — not patched in after the fact by JavaScript.

#### Hydration errors that crashed the entire app

When you use server-side rendering with client-side state stored in `localStorage`, you run into a fundamental conflict: the server renders the page with empty state (because `localStorage` doesn't exist on the server), but the moment the browser takes over, it has data — and React sees the mismatch and crashes.

The fix required three things working together: configuring Zustand to skip automatic hydration during SSR, creating a provider component that manually rehydrates stores only after the browser is ready, and wrapping dynamic content in a mount guard that shows a stable placeholder until the client has caught up. Getting all three right took significant trial and error.

#### Search that doesn't fight the user

The original implementation triggered a navigation event on every keystroke with a debounce. This meant the page was constantly remounting while you typed, which felt terrible on both desktop and mobile. The fix was conceptually simple but easy to get wrong: the search input is just local state. Nothing happens to the URL until you decide you're done typing and press Enter. The page only loads once, with the query you actually wanted.

---

### What I learned

Building CineScope taught me that the gap between "it works" and "it works well" is where most of the real engineering happens. The features that users never notice — no hydration flash, translations that just work, a search bar that doesn't fight you — are the ones that took the most time to get right.

I also learned to be deliberate about rendering strategies. Every page has a reason for being server-rendered or client-rendered, and that decision affects performance, SEO, and user experience in ways that compound across the whole application.

---

### Built with

[Next.js](https://nextjs.org/) · [TypeScript](https://www.typescriptlang.org/) · [Tailwind CSS](https://tailwindcss.com/) · [Zustand](https://zustand-demo.pmnd.rs/) · [TMDB API](https://www.themoviedb.org/)

*This product uses the TMDB API but is not endorsed or certified by TMDB.*

---
---

## Español

CineScope empezó como un proyecto personal — quería un lugar limpio y rápido para descubrir películas y series sin el ruido de las plataformas convencionales. Lo que comenzó como una aplicación simple en JavaScript vanilla terminó convirtiéndose en algo de lo que me siento orgulloso: una plataforma full-stack construida con tecnologías modernas, soporte multiidioma real, y una interfaz que realmente se siente cinematográfica.

---

### Qué hace

Abres CineScope y el contenido en tendencia aparece de inmediato — sin pantallas de carga, sin parpadeos, solo contenido. Puedes explorar por género, buscar cualquier cosa, guardar tus favoritos y cambiar entre 7 idiomas. Entra a cualquier película o serie y ves el panorama completo: reparto, equipo técnico, disponibilidad en plataformas de streaming según tu región, recomendaciones similares y una puntuación con contexto real.

La búsqueda funciona como debería funcionar una búsqueda — escribes, presionas Enter, obtienes resultados. Sin saltos de página mientras todavía estás escribiendo. En móvil se siente como una app nativa, con una barra de navegación inferior y un input de búsqueda justo donde están los pulgares.

---

### Cómo está construido

La base es **Next.js 14** con el App Router. Lo elegí porque me permite ser deliberado sobre qué se renderiza en el servidor y qué en el navegador. La página de inicio, las páginas de detalle de películas y series se renderizan en el servidor — lo que significa que lo primero que recibe el navegador ya viene con contenido real, lo cual es más rápido y mejor para el SEO.

Las partes interactivas — grids con scroll infinito, la sección de favoritos, la paleta de comandos, el selector de idioma — viven en el cliente. Esta separación es intencional. No tiene sentido enviar JavaScript para contenido que no cambia una vez cargado.

El manejo de estado es con **Zustand**, una alternativa liviana a Redux. Uso dos stores: uno para el sistema de favoritos (guardado en `localStorage` para que persista entre sesiones) y otro para el idioma activo. Ambos se mantienen sincronizados entre servidor y cliente mediante un patrón que construí específicamente para este proyecto.

Los estilos son **Tailwind CSS** puro con tokens de diseño personalizados. La identidad visual — fondos oscuros, acentos de resplandor violeta, paneles con glassmorphism, la superposición de grano de película — fue construida completamente en clases de utilidad sin una sola biblioteca de componentes UI externa.

Los datos vienen de la **API de TMDB**, que provee películas, series, reparto, plataformas de streaming y búsqueda. Cada pieza de contenido en la plataforma fluye a través de una capa de API tipada que garantiza datos consistentes independientemente de lo que devuelva TMDB.

---

### Las partes difíciles

#### Hacer que las traducciones realmente funcionen en el servidor

El desafío más complicado fue el soporte multiidioma. La mayoría de los tutoriales muestran cómo traducir texto estático en el cliente — pero TMDB en sí devuelve contenido traducido (títulos, descripciones, géneros) cuando le pasas un código de idioma a la API. El problema es: ¿cómo sabe el servidor qué idioma seleccionó el usuario si esa preferencia vive en el navegador?

La solución fue un puente con cookies. Cuando eliges un idioma en el selector, la aplicación escribe una cookie pequeña. El servidor lee esa cookie en cada solicitud y pasa el código de idioma correcto a la API de TMDB. El resultado es que el contenido traducido llega desde la base de datos ya en tu idioma — no parcheado después por JavaScript.

#### Errores de hidratación que rompían toda la aplicación

Cuando usas renderizado del lado del servidor con estado del cliente guardado en `localStorage`, te encuentras con un conflicto fundamental: el servidor renderiza la página con estado vacío (porque `localStorage` no existe en el servidor), pero en el momento en que el navegador toma el control, tiene datos — y React detecta la diferencia y se rompe.

La solución requirió tres cosas funcionando juntas: configurar Zustand para omitir la hidratación automática durante SSR, crear un componente proveedor que rehidrata los stores manualmente solo después de que el navegador está listo, y envolver el contenido dinámico en un guard de montaje que muestra un placeholder estable hasta que el cliente se haya puesto al día. Lograr que los tres funcionaran bien juntos requirió bastante prueba y error.

#### Un buscador que no peleara contra el usuario

La implementación original disparaba una navegación en cada tecla presionada con un debounce. Esto significaba que la página se remontaba constantemente mientras escribías, lo cual se sentía terrible tanto en desktop como en móvil. La solución fue conceptualmente simple pero fácil de equivocar: el input de búsqueda es solo estado local. Nada le pasa a la URL hasta que decides que terminaste de escribir y presionas Enter. La página solo carga una vez, con la búsqueda que realmente querías.

---

### Lo que aprendí

Construir CineScope me enseñó que la brecha entre "funciona" y "funciona bien" es donde ocurre la mayor parte de la ingeniería real. Las funcionalidades que los usuarios nunca notan — sin parpadeo de hidratación, traducciones que simplemente funcionan, un buscador que no pelea contigo — son las que más tiempo tomaron en hacer bien.

También aprendí a ser deliberado con las estrategias de renderizado. Cada página tiene una razón para ser renderizada en el servidor o en el cliente, y esa decisión afecta el rendimiento, el SEO y la experiencia de usuario de maneras que se acumulan en toda la aplicación.

---

### Construido con

[Next.js](https://nextjs.org/) · [TypeScript](https://www.typescriptlang.org/) · [Tailwind CSS](https://tailwindcss.com/) · [Zustand](https://zustand-demo.pmnd.rs/) · [API de TMDB](https://www.themoviedb.org/)

*Este producto usa la API de TMDB pero no está respaldado ni certificado por TMDB.*