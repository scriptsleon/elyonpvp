-- =============================================
-- ELYON PVP - DATABASE SCHEMA
-- Kompatibilní s MySQL 8+ a PostgreSQL 14+
-- =============================================

-- =============================================
-- TABULKA: users (Uživatelé přihlášení přes Discord)
-- =============================================
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,                    -- UUID
    discord_id VARCHAR(32) UNIQUE NOT NULL,        -- Discord User ID
    discord_username VARCHAR(64) NOT NULL,         -- Discord username
    discord_avatar VARCHAR(255),                   -- Avatar URL
    email VARCHAR(255),                            -- Email z Discordu
    role ENUM('user', 'moderator', 'admin', 'owner') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Pro PostgreSQL použij:
-- role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin', 'owner'))

-- =============================================
-- TABULKA: news (Novinky)
-- =============================================
CREATE TABLE news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),                        -- Volitelný obrázek
    author_id VARCHAR(36),                         -- Reference na users
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    discord_message_id VARCHAR(32),                -- ID zprávy na Discordu
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Pro PostgreSQL: použij SERIAL místo AUTO_INCREMENT

-- =============================================
-- TABULKA: recruitment_applications (Náborové přihlášky)
-- =============================================
CREATE TABLE recruitment_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36),                           -- Reference na users (pokud přihlášen)
    discord_username VARCHAR(64) NOT NULL,
    discord_id VARCHAR(32),
    age INT NOT NULL,
    experience TEXT NOT NULL,                      -- Zkušenosti s FiveM/adminováním
    motivation TEXT,                               -- Proč chce být v týmu
    availability VARCHAR(255),                     -- Kdy je dostupný
    position ENUM('moderator', 'admin', 'developer', 'builder') DEFAULT 'moderator',
    status ENUM('pending', 'reviewing', 'approved', 'rejected') DEFAULT 'pending',
    reviewed_by VARCHAR(36),                       -- Admin který rozhodl
    reviewed_at TIMESTAMP NULL,
    review_note TEXT,                              -- Interní poznámka
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- TABULKA: wiki_articles (Wiki články)
-- =============================================
CREATE TABLE wiki_articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,             -- URL slug (napr. "jak-zacit")
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,                         -- Markdown obsah
    category ENUM('zaklady', 'pve', 'pvp', 'marketplace', 'eventy', 'ostatni') DEFAULT 'zaklady',
    author_id VARCHAR(36),
    views INT DEFAULT 0,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- TABULKA: commands (Herní příkazy)
-- =============================================
CREATE TABLE commands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    command VARCHAR(64) NOT NULL,                  -- Např. "/spawn"
    description TEXT NOT NULL,
    usage_example VARCHAR(255),                    -- Příklad použití
    category ENUM('zakladni', 'admin', 'ekonomika', 'boj', 'ostatni') DEFAULT 'zakladni',
    permission_level ENUM('all', 'vip', 'moderator', 'admin') DEFAULT 'all',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABULKA: site_settings (Nastavení webu)
-- =============================================
CREATE TABLE site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(64) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Výchozí nastavení
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('primary_color', '#d4a853', 'string', 'Hlavní barva webu'),
('background_color', '#0a0a0a', 'string', 'Barva pozadí'),
('font_family', 'DynaPuff', 'string', 'Hlavní font'),
('font_size', '16', 'number', 'Základní velikost písma'),
('enable_animations', 'true', 'boolean', 'Povolit animace'),
('enable_particles', 'true', 'boolean', 'Povolit částice'),
('discord_webhook_news', '', 'string', 'Discord webhook pro novinky'),
('discord_webhook_recruitment', '', 'string', 'Discord webhook pro nábory'),
('fivem_server_ip', '', 'string', 'IP FiveM serveru'),
('fivem_cfx_code', '', 'string', 'CFX.re kód serveru');

-- =============================================
-- TABULKA: sessions (Uživatelské relace)
-- =============================================
CREATE TABLE sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- INDEXY pro lepší výkon
-- =============================================
CREATE INDEX idx_news_published ON news(published, published_at);
CREATE INDEX idx_recruitment_status ON recruitment_applications(status);
CREATE INDEX idx_wiki_category ON wiki_articles(category, published);
CREATE INDEX idx_commands_category ON commands(category, is_active);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- =============================================
-- VIEWS pro snadnější dotazy
-- =============================================
CREATE VIEW v_published_news AS
SELECT n.*, u.discord_username as author_name
FROM news n
LEFT JOIN users u ON n.author_id = u.id
WHERE n.published = TRUE
ORDER BY n.published_at DESC;

CREATE VIEW v_pending_applications AS
SELECT ra.*, u.discord_username as applicant_name
FROM recruitment_applications ra
LEFT JOIN users u ON ra.user_id = u.id
WHERE ra.status = 'pending'
ORDER BY ra.created_at ASC;
