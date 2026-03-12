const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/reservations.db", (err) => {
    if (err) {
        console.error("Database error:", err);
    } else {
        console.log("Connected to SQLite database");
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            checkin TEXT,
            checkout TEXT,
            guest TEXT
        )
    `);
});

module.exports = db;