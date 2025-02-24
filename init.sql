-- Contacts jadvalini yaratish
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

-- Test ma’lumot qo‘shish (ixtiyoriy)
INSERT INTO contacts (name, email) VALUES
    ('Ali', 'ali@example.com'),
    ('Vali', 'vali@example.com')
ON CONFLICT DO NOTHING; -- Agar ma’lumot allaqachon bo‘lsa, xato bermaydi