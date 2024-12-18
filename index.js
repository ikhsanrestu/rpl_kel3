const express = require("express");
const { RegisPasienRouter } = require("./regispasien");
const { EditDokterRouter } = require("./editdokter");
const { ReservasiRouter } = require("./reservasi");
const { JadwalDokterRouter } = require("./jadwaldokter");
const { UlasanRouter } = require("./ulasan");
const { RegisKlinikRouter } = require("./regisklinik");
const { NotifikasiRouter } = require("./notifikasi");
const { LoginRouter } = require("./login");
const server = express();
const port = 4000;

const cors = require("cors")

server.use(cors())

server.use(express.json())


// Req untuk menerima data frontend
// Res mengirim data ke frontend
server.get("/", (req, res) => {

    return res.status(200).json({
        status: 200,
        message: "Berhasil Mengambil Data User",
    })
})

server.use("/pasien", RegisPasienRouter)
server.use("/dokter", EditDokterRouter)
server.use("/reservasi", ReservasiRouter)
server.use("/jadwal", JadwalDokterRouter)
server.use("/ulasan", UlasanRouter)
server.use("/klinik", RegisKlinikRouter)
server.use("/notifikasi",NotifikasiRouter)
server.use("/login", LoginRouter)

server.listen(port, ()  => {
    console.log("Server berjalan di port "+ port)
})