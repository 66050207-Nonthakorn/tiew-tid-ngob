#!/bin/sh
set -e

# Wait for database to be ready
until pg_isready -h "${DB_HOST:-db}" -p "${DB_PORT:-5432}" -U "${POSTGRES_USER:-tiew-tid-ngob}"; do
  echo "Database is not ready - sleeping"
  sleep 2
done

echo "Database is ready! Running migrations..."

# Run migrations
pnpm prisma migrate deploy

echo "Starting application..."
exec "$@"