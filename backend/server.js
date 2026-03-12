const express = require("express");
const db = require("./database/db");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Booking backend running 🚀");
});


// ver reservas
app.get("/reservations", (req, res) => {

    db.all("SELECT * FROM reservations", [], (err, rows) => {

        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        const events = rows.map(r => ({
            title: "Reserved",
            start: r.checkin,
            end: r.checkout
        }));

        res.json(events);

    });

});


// crear reserva
app.post("/reservation", (req, res) => {

    const { checkin, checkout, guest } = req.body;

    const query = `
        SELECT * FROM reservations
        WHERE NOT (
            checkout <= ? OR checkin >= ?
        )
    `;

    db.all(query, [checkin, checkout], (err, rows) => {

        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (rows.length > 0) {
            res.status(400).json({
                message: "Dates not available"
            });
            return;
        }

        db.run(
            `INSERT INTO reservations (checkin, checkout, guest) VALUES (?, ?, ?)`,
            [checkin, checkout, guest],
            function(err) {

                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }

                res.json({
                    message: "Reservation confirmed",
                    id: this.lastID
                });

            }
        );

    });

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});