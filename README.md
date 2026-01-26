# Botrix Widget Builder

Design a branded chat bubble and widget UI for WhatsApp, Telegram, Messenger, or Email, then embed it on any site with a single script tag. The builder saves widget configurations, generates an embeddable script, and hosts a lightweight widget runtime.

## Features

- Multi-platform chat widgets (WhatsApp, Telegram, Messenger, Email).
- Live preview of bubble + widget UI with custom sizing, colors, and messaging.
- One-line embed script that fetches the public widget configuration.
- Profile image uploads via Cloudinary.
- MongoDB-backed storage for widget configs and metadata.

## Tech Stack

- Next.js App Router
- React 19 + TypeScript
- Tailwind CSS v4 + PostCSS
- MongoDB + Mongoose
- Zod for validation
- Cloudinary for image uploads

## Folder Structure

```
.
├── public/                     # Static assets
├── scripts/                    # Utility scripts
│   └── upload-icons.mjs
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── public/widgets/[id]/route.ts
│   │   │   ├── uploads/profile/route.ts
│   │   │   └── widgets/route.ts
│   │   ├── widget.js/route.ts  # Embeddable widget runtime
│   │   ├── layout.tsx
│   │   └── page.tsx            # Builder UI
│   ├── lib/
│   │   ├── db.ts
│   │   ├── models/Widget.ts
│   │   └── validation.ts
│   └── types/
│       └── widget.ts
├── package.json
└── next.config.ts
```

## Requirements

- Node.js 18+
- MongoDB instance
- Cloudinary account (optional, for profile uploads)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` and set the required environment variables.
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`.

## Environment Variables

Set these in `.env.local` (or in your hosting provider):

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string. |
| `MONGODB_DB` | No | Database name (default: `widget_builder`). |
| `CLOUDINARY_CLOUD_NAME` | No | Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | No | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | No | Cloudinary API secret. |
| `MAX_PROFILE_UPLOAD_BYTES` | No | Max upload size in bytes (default: `2000000`). |
| `NEXT_PUBLIC_APP_URL` | Yes | Public base URL used in embed code. |
| `NEXT_PUBLIC_BRANDING_LOGO` | No | Branding logo URL for widget footer. |
| `NEXT_PUBLIC_BRANDING_LINK` | No | Branding link URL. |
| `NEXT_PUBLIC_WHATSAPP_ICON_URL` | No | Custom WhatsApp icon URL. |
| `NEXT_PUBLIC_TELEGRAM_ICON_URL` | No | Custom Telegram icon URL. |
| `NEXT_PUBLIC_MESSENGER_ICON_URL` | No | Custom Messenger icon URL. |
| `NEXT_PUBLIC_EMAIL_ICON_URL` | No | Custom Email icon URL. |

## Scripts

- `npm run dev` - Start the dev server.
- `npm run build` - Build the production app.
- `npm run start` - Start the production server.
- `npm run lint` - Run ESLint.
- `npm run upload:icons` - Upload icon assets (see `scripts/upload-icons.mjs`).

## Embedding a Widget

Once a widget is saved, embed it with:

```html
<script src="https://your-domain.com/widget.js" data-widget-id="YOUR_WIDGET_ID" async></script>
```

The script fetches the public configuration from `/api/public/widgets/[id]` and renders the widget on the client.

## API Endpoints

- `GET /api/widgets` - List recent widgets.
- `POST /api/widgets` - Create a widget.
- `GET /api/widgets/[id]` - Fetch a widget.
- `PUT /api/widgets/[id]` - Update a widget.
- `DELETE /api/widgets/[id]` - Delete a widget.
- `GET /api/public/widgets/[id]` - Public widget config (CORS enabled).
- `POST /api/uploads/profile` - Upload profile image via Cloudinary.
- `GET /widget.js` - Embeddable widget runtime script.

## Contributing

1. Fork the repo and create a feature branch.
2. Run `npm install` and `npm run dev` to verify locally.
3. Keep changes focused and add/update documentation when relevant.
4. Run `npm run lint` before opening a PR.

## Deployment

- Configure the environment variables in your hosting provider.
- Ensure `NEXT_PUBLIC_APP_URL` matches your public domain.
- Build and start:
  ```bash
  npm run build
  npm run start
  ```

## License

No license specified. Add a `LICENSE` file if you plan to open-source this project.
