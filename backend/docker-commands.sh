#!/bin/bash
# PassTravels Backend - Docker Quick Commands

# Production Commands
alias pt-build="docker-compose build"
alias pt-up="docker-compose up -d"
alias pt-down="docker-compose down"
alias pt-logs="docker-compose logs -f backend"
alias pt-restart="docker-compose restart backend"
alias pt-ps="docker-compose ps"

# Development Commands
alias pt-dev="docker-compose -f docker-compose.dev.yml up"
alias pt-dev-down="docker-compose -f docker-compose.dev.yml down"

# Database Commands
alias pt-db-shell="docker-compose exec postgres psql -U user -d passtravels"
alias pt-db-backup="docker-compose exec postgres pg_dump -U user passtravels > backup_$(date +%Y%m%d_%H%M%S).sql"

# Prisma Commands
alias pt-prisma-generate="docker-compose exec backend npx prisma generate"
alias pt-prisma-migrate="docker-compose exec backend npx prisma migrate deploy"
alias pt-prisma-seed="docker-compose exec backend npx prisma db seed"
alias pt-prisma-studio="docker-compose exec backend npx prisma studio"

# Maintenance Commands
alias pt-clean="docker-compose down -v"
alias pt-rebuild="docker-compose down && docker-compose build --no-cache && docker-compose up -d"

# Health Check
alias pt-health="curl http://localhost:3000/health"

# View this file
alias pt-help="cat docker-commands.sh"

echo "PassTravels Docker aliases loaded!"
echo "Run 'pt-help' to see all available commands"
