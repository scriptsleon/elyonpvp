# 🗄️ Elyon PvP - Database Setup

## Přehled tabulek

| Tabulka | Popis |
|---------|-------|
| `users` | Uživatelé přihlášení přes Discord OAuth |
| `news` | Novinky zobrazené na webu |
| `recruitment_applications` | Náborové přihlášky do Admin Teamu |
| `wiki_articles` | Wiki články a návody |
| `commands` | Seznam herních příkazů |
| `site_settings` | Nastavení webu (barvy, fonty, atd.) |
| `sessions` | Uživatelské session pro přihlášení |

## Instalace

### MySQL
```bash
mysql -u root -p elyon_web < schema.sql
```

### PostgreSQL
```bash
psql -U postgres -d elyon_web -f schema.sql
```

> ⚠️ Pro PostgreSQL: Uprav `ENUM` typy na `VARCHAR` s `CHECK` constraints a `AUTO_INCREMENT` na `SERIAL`.

## Připojení z webu

### Varianta 1: Přímé připojení (Node.js backend)

```javascript
// Nainstaluj: npm install mysql2
import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Příklad: Získat novinky
const [news] = await db.query('SELECT * FROM v_published_news LIMIT 10');
```

### Varianta 2: REST API (doporučeno)

Vytvoř Express/Fastify API na tvém VPS, které bude komunikovat s DB:

```javascript
// api/news.js
app.get('/api/news', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM v_published_news');
  res.json(rows);
});
```

Pak z React frontendu volej:
```javascript
const response = await fetch('https://api.tvuj-server.cz/api/news');
const news = await response.json();
```

## Vztahy mezi tabulkami

```
users
  ├── news (author_id)
  ├── wiki_articles (author_id)
  ├── recruitment_applications (user_id, reviewed_by)
  └── sessions (user_id)
```

## Discord OAuth Flow

1. Uživatel klikne "Přihlásit přes Discord"
2. Redirect na Discord OAuth URL
3. Discord vrátí `code`
4. Backend vymění `code` za `access_token`
5. Backend získá user info z Discord API
6. Vytvoří/aktualizuje záznam v `users`
7. Vytvoří session v `sessions`
8. Vrátí JWT token na frontend
