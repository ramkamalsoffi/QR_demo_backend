# QR Demo Backend

Backend API server for QR Demo application.

## Tech Stack

- Next.js 14
- TypeScript
- Prisma ORM
- Tailwind CSS
- Axios
- TanStack Query

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Set up Prisma:
```bash
npm run db:generate
npm run db:push
```

4. Run the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

