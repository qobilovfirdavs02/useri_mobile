const mysql = require('mysql2');

// MySQL ga ulanish konfiguratsiyasi
const connection = mysql.createConnection({
  host: 'MySQL-8.2',      // MySQL server manzili
  user: 'root',           // Foydalanuvchi nomi (odatda root)
  password: '',           // Parol (agar yo'q bo'lsa, bo'sh qoldiring)
  database: 'contacts_db'  // Bazaning nomi
});

// Bazaga ulanish
connection.connect((err) => {
  if (err) {
    console.error('Bazaga ulanishda xato:', err.stack);
    return;
  }
  console.log('Bazaga muvaffaqiyatli ulandik. ID:', connection.threadId);
});

// Ulanishni eksport qilish
module.exports = connection;