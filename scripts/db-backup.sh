#!/usr/bin/env bash
set -euo pipefail

# StudyDock Database Backup Script
BACKUP_DIR="$(pwd)/backups"
TIMESTAMP="$(date +"%Y%m%d_%H%M%S")"
BACKUP_FILE="${BACKUP_DIR}/studydock_backup_${TIMESTAMP}.sql"

mkdir -p "${BACKUP_DIR}"

echo "📦 Initiating StudyDock database backup..."

# Check if Docker container is running
if docker ps --format '{{.Names}}' | grep -q "^studydock-db$"; then
  echo "Found running container 'studydock-db'. Running pg_dump inside container..."
  docker exec -t studydock-db pg_dump -U studydock -d studydock --clean --if-exists > "${BACKUP_FILE}"
else
  echo "Docker container 'studydock-db' not found. Attempting local pg_dump via DATABASE_URL..."
  DB_URL="${DATABASE_URL:-postgresql://studydock:studydock_password@127.0.0.1:5432/studydock}"
  pg_dump "${DB_URL}" --clean --if-exists > "${BACKUP_FILE}"
fi

FILE_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
echo "✅ Backup successfully created at:"
echo "   ${BACKUP_FILE} (${FILE_SIZE})"
