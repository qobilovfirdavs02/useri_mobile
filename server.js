// const express = require('express');
// const serverless = require('serverless-http');
// const { Pool } = require('pg');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // PostgreSQL ulanish (Neon bilan)
// const pool = new Pool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT,
//     ssl: { rejectUnauthorized: false }
// });

// // Test endpoint
// app.get('/test', async (req, res) => {
//     try {
//         const result = await pool.query('SELECT NOW()');
//         res.json({ message: 'Ulanish muvaffaqiyatli', time: result.rows[0].now });
//     } catch (error) {
//         console.error('Ulanish xatosi:', error);
//         res.status(500).json({ message: 'Ulanishda xato', error: error.message });
//     }
// });

// // Kontakt qo‘shish (yangi maydonlar bilan)
// app.post('/api/contacts', async (req, res) => {
//     const { name, passport_id, phone_number, inn, email } = req.body;
//     if (!name || !email) {
//         return res.status(400).json({ message: 'Ism va email majburiy' });
//     }

//     try {
//         // Mavjudligini tekshirish (name va email bo‘yicha)
//         const checkResult = await pool.query(
//             'SELECT * FROM contacts WHERE name = $1 AND email = $2',
//             [name, email]
//         );
//         if (checkResult.rows.length > 0) {
//             return res.status(409).json({ message: 'Foydalanuvchi allaqachon mavjud' });
//         }

//         // Yangi kontakt qo‘shish
//         const insertResult = await pool.query(
//             'INSERT INTO contacts (name, passport_id, phone_number, inn, email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
//             [name, passport_id || null, phone_number || null, inn || null, email]
//         );
//         res.status(201).json(insertResult.rows[0]);
//     } catch (error) {
//         console.error('Xato:', error);
//         res.status(500).json({ message: 'Bazaga ulanishda xato', error: error.message });
//     }
// });

// // Kontaktlar ro‘yxatini olish
// app.get('/api/contacts', async (req, res) => {
//     try {
//         const result = await pool.query('SELECT * FROM contacts');
//         res.json(result.rows);
//     } catch (error) {
//         console.error('Xato:', error);
//         res.status(500).json({ message: 'Server xatosi' });
//     }
// });

// // Qidiruv endpoint’i (yangi maydonlar bilan)
// app.post('/api/contacts/search', async (req, res) => {
//     const { name, passport_id, phone_number, inn, email } = req.body;
//     if (!name || !email) {
//         return res.status(400).json({ message: 'Ism va email kerak' });
//     }

//     try {
//         const result = await pool.query(
//             'SELECT * FROM contacts WHERE name = $1 AND email = $2',
//             [name, email]
//         );
//         if (result.rows.length > 0) {
//             res.json({ found: true, contact: result.rows[0] });
//         } else {
//             res.json({ found: false, message: 'Foydalanuvchi topilmadi' });
//         }
//     } catch (error) {
//         console.error('Qidiruv xatosi:', error);
//         res.status(500).json({ message: 'Server xatosi' });
//     }
// });

// module.exports = app;
const express = require('express');
const serverless = require('serverless-http');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL ulanish (Neon bilan)
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
});

// Test endpoint
app.get('/test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ message: 'Ulanish muvaffaqiyatli', time: result.rows[0].now });
    } catch (error) {
        console.error('Ulanish xatosi:', error);
        res.status(500).json({ message: 'Ulanishda xato', error: error.message });
    }
});

// Kontakt qo‘shish
app.post('/api/contacts', async (req, res) => {
    const { name, passport_id, phone_number, inn, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Ism va email majburiy' });
    }

    try {
        const checkResult = await pool.query(
            'SELECT * FROM contacts WHERE name = $1 AND email = $2',
            [name, email]
        );
        if (checkResult.rows.length > 0) {
            return res.status(409).json({ message: 'Foydalanuvchi allaqachon mavjud' });
        }

        const insertResult = await pool.query(
            'INSERT INTO contacts (name, passport_id, phone_number, inn, email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, passport_id || null, phone_number || null, inn || null, email]
        );
        res.status(201).json(insertResult.rows[0]);
    } catch (error) {
        console.error('Xato:', error);
        res.status(500).json({ message: 'Bazaga ulanishda xato', error: error.message });
    }
});

// Kontaktlar ro‘yxatini olish
app.get('/api/contacts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM contacts');
        res.json(result.rows);
    } catch (error) {
        console.error('Xato:', error);
        res.status(500).json({ message: 'Server xatosi' });
    }
});

// Qidiruv endpoint’i (faqat name va passport_id bilan)
app.post('/api/contacts/search', async (req, res) => {
    const { name, passport_id } = req.body;
    if (!name || !passport_id) {
        return res.status(400).json({ message: 'Ism va pasport ID kerak' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM contacts WHERE name = $1 AND passport_id = $2',
            [name, passport_id]
        );
        if (result.rows.length > 0) {
            res.json({ found: true, contact: result.rows[0] });
        } else {
            res.json({ found: false, message: 'Foydalanuvchi topilmadi' });
        }
    } catch (error) {
        console.error('Qidiruv xatosi:', error);
        res.status(500).json({ message: 'Server xatosi' });
    }
});

module.exports = app;