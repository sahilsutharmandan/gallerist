# Gallerist

An art museum explorer for the Cleveland Museum of Art open access collection, built with React 18, Vite, Zustand, and hand-written CSS.

## Features

- **Home** - Hero search, featured departments, and a rail of collection highlights
- **Explore** - Search with department, object type, date range (two-thumb slider), and public-domain filters, client-side sorting, a masonry grid, and "Load more" paging
- **Artwork Detail** - Large image, artist, culture, medium, dimensions, description, tombstone citation, and "More from this department"
- **Lightbox** - Full-screen viewer with zoom (buttons, wheel, double-click), drag to pan, and prev/next arrows plus keyboard shortcuts
- **Collections** - Create collections, save artworks through a checklist modal, rename, reorder (drag or arrows), and remove works
- **Favorites** - One-tap hearts on every card, listed on the Collections page
- **Compare** - Two artworks side by side with their key facts
- **Toasts** - Feedback for saves, removals, and errors
- **Dark/Light Theme** - Follows the system setting, can be toggled, and is saved to localStorage
- **Responsive** - Bottom tab bar and bottom-sheet modals on mobile

All collections, favorites, the compare selection, and settings are stored in `localStorage` (keys prefixed with `gallerist:`). There is no backend.

## API Used

- [Cleveland Museum of Art Open Access API](https://openaccess-api.clevelandart.org/) - artworks search and detail (no API key required)
  - `GET /api/artworks/?q=&department=&type=&created_after=&created_before=&has_image=1&skip=&limit=`
  - `GET /api/artworks/{id}`
  - Images come from `images.web.url`, and the zoomed lightbox loads `images.print.url`

In development, requests go through the Vite proxy at `/cma`. The production build calls the API directly.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Tech Stack

- React 18 (function components and hooks)
- Vite
- Zustand (state management)
- React Router (hash history)
- Plain CSS with custom properties for theming
