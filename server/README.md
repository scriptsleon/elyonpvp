# Elyon PvP - Backend Server

Express.js backend server pro Elyon PvP web s Discord OAuth, MySQL databází a Discord bot integrací.

## 🚀 Rychlý start

### 1. Instalace závislostí

```bash
cd server
npm install
```

### 2. Konfigurace

Zkopíruj `.env.example` do `.env` a vyplň hodnoty:

```bash
cp .env.example .env
```

Povinné hodnoty:
- `SESSION_SECRET` - Náhodný řetězec pro session
- `DB_*` - MySQL connection details
- `DISCORD_CLIENT_ID` - Z Discord Developer Portal
- `DISCORD_CLIENT_SECRET` - Z Discord Developer Portal
- `DISCORD_BOT_TOKEN` - Z Discord Developer Portal (Bot section)
- `DISCORD_GUILD_ID` - ID tvého Discord serveru
- `DISCORD_ADMIN_ROLE_ID` - ID role pro administrátory

### 3. Vytvoření databáze

Spusť SQL schéma z `../database/schema.sql` ve svém MySQL klientu:

```bash
mysql -u root -p elyon_pvp < ../database/schema.sql
```

### 4. Discord Developer Portal nastavení

1. Jdi na https://discord.com/developers/applications
2. Vytvoř novou aplikaci
3. V **OAuth2** sekci:
   - Přidej Redirect URL: `http://localhost:3001/api/auth/discord/callback`
   - Zkopíruj Client ID a Client Secret do `.env`
4. V **Bot** sekci:
   - Vytvoř bota
   - Zkopíruj Token do `.env`
   - Zapni **Server Members Intent** a **Presence Intent**
5. Pozvi bota na server s permissions: `Send Messages`, `Embed Links`, `Read Message History`

### 5. Spuštění

```bash
# Development (s hot reload)
npm run dev

# Production
npm start
```

Server poběží na `http://localhost:3001`

## 📡 API Endpoints

### Auth
- `GET /api/auth/discord` - Zahájí Discord OAuth
- `GET /api/auth/discord/callback` - OAuth callback
- `GET /api/auth/me` - Vrátí aktuálního uživatele + isAdmin
- `POST /api/auth/logout` - Odhlášení

### News
- `GET /api/news` - Publikované novinky (public)
- `GET /api/news/all` - Všechny novinky (admin)
- `POST /api/news` - Vytvořit novinku (admin)
- `PUT /api/news/:id` - Upravit novinku (admin)
- `DELETE /api/news/:id` - Smazat novinku (admin)
- `POST /api/news/:id/toggle-publish` - Přepnout publikaci (admin)

### Recruitment
- `POST /api/recruitment` - Odeslat přihlášku (authenticated)
- `GET /api/recruitment` - Všechny přihlášky (admin)
- `PUT /api/recruitment/:id/status` - Změnit status (admin)
- `DELETE /api/recruitment/:id` - Smazat přihlášku (admin)

### Wiki
- `GET /api/wiki` - Publikované články (public)
- `GET /api/wiki/article/:slug` - Článek podle slug (public)
- `GET /api/wiki/all` - Všechny články (admin)
- `POST /api/wiki` - Vytvořit článek (admin)
- `PUT /api/wiki/:id` - Upravit článek (admin)
- `DELETE /api/wiki/:id` - Smazat článek (admin)

### Commands
- `GET /api/commands` - Všechny příkazy (public)
- `POST /api/commands` - Vytvořit příkaz (admin)
- `PUT /api/commands/:id` - Upravit příkaz (admin)
- `DELETE /api/commands/:id` - Smazat příkaz (admin)

### Settings
- `GET /api/settings` - Veřejná nastavení (public)
- `GET /api/settings/all` - Všechna nastavení (admin)
- `PUT /api/settings/:key` - Upravit nastavení (admin)
- `POST /api/settings/bulk` - Hromadně upravit (admin)

### Discord
- `POST /api/discord/webhook/news` - Odeslat novinku přes webhook (admin)
- `POST /api/discord/bot/news` - Odeslat novinku přes bota (admin)
- `POST /api/discord/bot/message` - Odeslat zprávu přes bota (admin)

## 🔐 Autorizace

Admin přístup je určen podle Discord role. Nastav `DISCORD_ADMIN_ROLE_ID` v `.env`.

Každý request na admin endpointy:
1. Zkontroluje, zda je uživatel přihlášen
2. Zkontroluje, zda má uživatel danou roli na Discord serveru

## 🏃 Spuštění celého projektu

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

Frontend poběží na `http://localhost:8080`, backend na `http://localhost:3001`.
