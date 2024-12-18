const express = require('express');
const app = express();
const port = 4000;

// Middleware untuk meng-handle JSON
app.use(express.json());

// Endpoint untuk menerima data dari form
app.post('/submit-clinic-data', (req, res) => {
    const { name, email, password, district, subdistrict, address } = req.body;

    // Proses data di sini (misalnya simpan ke database)
    console.log('Data Klinik:', {
        name, email, password, district, subdistrict, address
    });

    // Mengirimkan respon ke frontend
    res.json({ success: true, message: 'Data berhasil diterima' });
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
