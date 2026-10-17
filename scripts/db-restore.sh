#!/usr/bin/env bash
set -euo pipefail

# StudyDock Database Restore Script

if [ $# -lt 1 ]; then
  echo "Usage: bash scripts/db-restore.sh <path-to-backup.sql>"
  echo ""
  echo "Available backups in backups/:"
  ls -lh backups/*.sql 2>/dev/null || echo "  (no backups found in backups/)"
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "${BACKUP_FILE}" ]; then
  echo "❌ Error: Backup file not found at: ${BACKUP_FILE}"
  exit 1
fi

echo "⚠️  WARNING: Restoring will overwrite existing data in StudyDock database with:"
echo "   ${BACKUP_FILE}"
read -p "Are you sure you want to proceed? [y/N] " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Restore cancelled."
  exit 0
fi

if docker ps --format '{{.Names}}' | grep -q "^studydock-db$"; then
  echo "Restoring into running Docker container 'studydock-db'..."
  docker exec -i studydock-db psql -U studydock -d studydock < "${BACKUP_FILE}"
else
  echo "Attempting local restore via DATABASE_URL..."
  DB_URL="${DATABASE_URL:-postgresql://studydock:studydock_password@127.0.0.1:5432/studydock}"
  psql "${DB_URL}" < "${BACKUP_FILE}"
fi

echo "✅ Database restored successfully from ${BACKUP_FILE}!"
