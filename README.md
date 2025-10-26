
# Tiew Tid Ngob

KMITL's Innovation project 

## Prerequisites

- Node.js (LTS recommended, e.g. 18 or 20)
- pnpm
- Docker
- Android Studio (if you want to run the mobile frontend on an Android emulator/device)
- Git

## Quick overview

- Backend: `./backend` (Express.js / Prisma / Node)
- Frontend: `./frontend` (Expo / React Native / web)

## Backend — local development

1) Start required services with Docker (must run first):

```powershell
docker compose up -d db
```

2) Backend (run after Docker is up):

```powershell
cd .\backend
pnpm install

pnpm prisma generate
pnpm prisma migrate dev --name local

pnpm run dev
```

## Frontend — local development

```powershell
cd .\frontend
pnpm install
pnpm start    # or `npx expo start`
```