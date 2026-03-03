# Taskello

A Trello-style kanban board built with Rails 7.1 + React 19. Real-time updates via ActionCable, drag & drop with @dnd-kit, keyboard navigation with vim motions, and 3 themes (light/dark/gruvbox).

## Stack

- **Backend**: Rails 7.1, PostgreSQL 16, ActionCable
- **Frontend**: React 19, React Router, Zustand, Tailwind CSS v4
- **DnD**: @dnd-kit
- **Auth**: `has_secure_password` + session cookies
- **Build**: esbuild
- **Testing**: Minitest + FactoryBot

## Setup

```bash
# Start services
docker compose up -d db
docker compose build web

# Create database, run migrations, seed
docker compose run --rm web bin/rails db:create db:migrate db:seed

# Start dev server
docker compose up
# Or locally: bin/dev
```

The app runs at http://localhost:3000

## Seed Users

All passwords: `password`

| Username | Email |
|---|---|
| admin | admin@taskello.dev |
| barbascura_x | barbascura@taskello.dev |
| pippo_baudo | pippo@taskello.dev |
| gianni_morandi | gianni@taskello.dev |
| ilary_blasi | ilary@taskello.dev |
| chiara_ferragni | chiara@taskello.dev |
| totti_er_pupone | totti@taskello.dev |
| salvini_meme | salvini@taskello.dev |

## Seed Boards

- **Grande Fratello VIP 2026** (creator: ilary_blasi)
- **Sanremo 2026** (creator: pippo_baudo)
- **Piano Influencer Q1** (creator: chiara_ferragni)
- **Ponte sullo Stretto** (creator: salvini_meme)

## Features

- Board CRUD with membership management
- Cards with drag & drop between columns (todo/doing/done)
- Labels with color palette
- Comments with @mentions and notifications
- File attachments (Active Storage) and link attachments
- Card participants
- Real-time updates via ActionCable
- Two layouts: kanban (default) and email-client
- 3 themes: light, dark, gruvbox
- Responsive design

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `h` / `l` | Move between columns |
| `j` / `k` | Move between cards |
| `Tab` | Sequential navigation |
| `Enter` | Open card detail |
| `Esc` | Close card detail |
| `d` | Delete focused card |
| `m` / `M` | Move card right / left |
| `Ctrl+h/j/k/l` | Move card position (DnD) |
| `?` | Toggle keyboard legend |

## Tests

```bash
docker compose run --rm -e RAILS_ENV=test web bin/rails db:create db:migrate
docker compose run --rm -e RAILS_ENV=test web bin/rails test
```

## API Endpoints

All under `/api/v1/`:

- `POST /signup`, `POST /login`, `DELETE /logout`, `GET /me`
- `GET/POST /boards`, `GET/PATCH/DELETE /boards/:id`
- `POST/DELETE /boards/:id/members`
- `GET/POST/PATCH/DELETE /boards/:id/labels`
- `GET/POST/PATCH/DELETE /cards/:id`
- `PATCH /cards/:id/move`
- `GET/POST/DELETE /cards/:id/comments`
- `GET/POST/DELETE /cards/:id/attachments`
- `POST/DELETE /cards/:id/participants`
- `POST/DELETE /cards/:id/card_labels`
- `GET /notifications`, `PATCH /notifications/:id/read`, `POST /notifications/read_all`
