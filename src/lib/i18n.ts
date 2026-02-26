// ─── Translations (migrated from nodes.js) ───────────────────
export const translations = {
  'en-US': {
    title:             'CineScope',
    trending:          'Trending',
    seeMore:           'See More',
    categories:        'Categories',
    likedMovies:       'Favorite Movies',
    movieSimilar:      'Similar Movies',
    tvSimilar:         'Similar Series',
    searchPlaceholder: 'Search movies & series...',
  },
  'es-ES': {
    title:             'CineScope',
    trending:          'Tendencias',
    seeMore:           'Ver más',
    categories:        'Categorías',
    likedMovies:       'Películas favoritas',
    movieSimilar:      'Películas similares',
    tvSimilar:         'Series similares',
    searchPlaceholder: 'Buscar películas y series...',
  },
  'fr-FR': {
    title:             'CineScope',
    trending:          'Tendances',
    seeMore:           'Voir plus',
    categories:        'Catégories',
    likedMovies:       'Films favoris',
    movieSimilar:      'Films similaires',
    tvSimilar:         'Séries similaires',
    searchPlaceholder: 'Rechercher des films...',
  },
  'pt-BR': {
    title:             'CineScope',
    trending:          'Tendências',
    seeMore:           'Ver mais',
    categories:        'Categorias',
    likedMovies:       'Filmes favoritos',
    movieSimilar:      'Filmes semelhantes',
    tvSimilar:         'Séries semelhantes',
    searchPlaceholder: 'Pesquisar filmes...',
  },
  'zh-CN': {
    title:             'CineScope',
    trending:          '趋势',
    seeMore:           '查看更多',
    categories:        '类别',
    likedMovies:       '最喜欢的电影',
    movieSimilar:      '类似的电影',
    tvSimilar:         '类似的系列',
    searchPlaceholder: '搜索电影...',
  },
  'de-DE': {
    title:             'CineScope',
    trending:          'Trends',
    seeMore:           'Mehr sehen',
    categories:        'Kategorien',
    likedMovies:       'Lieblingsfilme',
    movieSimilar:      'Ähnliche Filme',
    tvSimilar:         'Ähnliche Serien',
    searchPlaceholder: 'Filme suchen...',
  },
  'it-IT': {
    title:             'CineScope',
    trending:          'Tendenze',
    seeMore:           'Vedi di più',
    categories:        'Categorie',
    likedMovies:       'Film preferiti',
    movieSimilar:      'Film simili',
    tvSimilar:         'Serie simili',
    searchPlaceholder: 'Cerca film...',
  },
} as const

export type LangCode = keyof typeof translations
export type TranslationKeys = keyof typeof translations['en-US']

export function t(lang: LangCode, key: TranslationKeys): string {
  return translations[lang]?.[key] ?? translations['en-US'][key]
}
