const { db } = require("./database");
const ReservasiRouter = require("express").Router();

// Endpoint untuk membuat reservasi
ReservasiRouter.post("/", async (req, res) => {
  console.log("Data yang dikirim:", req.body);
  const id_user = parseInt(req.body.id_user);
  const id_notifikasi = parseInt(req.body.id_notifikasi);
  const id_ulasan = parseInt(req.body.id_ulasan);
  const id_jadwal = parseInt(req.body.id_jadwal);
  const status = req.body.status;

  // Validasi input
  if (!id_user || !id_notifikasi || !id_ulasan || !status) {
    return res.status(400).json({
      status: 400,
      message: "Diharapkan untuk mengisi data semuanya",
    });
  }

  try {
    const data = await db.reservasi.create({
      data: {
        id_user: id_user,
        id_notifikasi: id_notifikasi,
        id_ulasan: id_ulasan,
        id_jadwal: id_jadwal,
        status: status,
      },
    });

    return res.status(200).json({
      status: 200,
      message: "Berhasil Membuat Reservasi",
      data,
    });
  } catch (error) {
    console.error("Error during reservasi creation:", error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan pada server.",
    });
  }
});

// Endpoint untuk mendapatkan reservasi
ReservasiRouter.get("/", async (req, res) => {
  const userId = req.query.id_user;  // Mengambil userId dari query parameter

  try {
    let reservasi;
    if (userId) {  // Use userId here instead of id_user
      // Mengambil data reservasi untuk user tertentu
      reservasi = await db.reservasi.findMany({
        where: {
          id_user: parseInt(userId),
        },
      });
    } else {
      // Mengambil semua data reservasi jika userId tidak ada
      reservasi = await db.reservasi.findMany();
    }

    // Jika tidak ada data reservasi ditemukan, beri pesan yang sesuai
    if (reservasi.length === 0) {
      return res.status(200).json({
        status: 200,
        message: "Tidak ada data reservasi.",
        reservasi: [],  // Kirimkan array kosong jika tidak ada data
      });
    }

    // Jika data ditemukan, kirimkan respons dengan data reservasi
    return res.status(200).json({
      status: 200,
      message: "Berhasil Mendapatkan Data Reservasi",
      reservasi: reservasi,
    });
  } catch (error) {
    console.error("Error during fetching reservasi:", error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan pada server.",
    });
  }
});

// Endpoint untuk menghapus reservasi
ReservasiRouter.delete("/", async (req, res) => {
  console.log("Data yang dikirim:", req.body);
  const { id_reservasi } = req.body;

  // Validasi input
  if (!id_reservasi) {
    return res.status(400).json({
      status: 400,
      message: "ID reservasi tidak ditemukan.",
    });
  }

  try {
    const data = await db.reservasi.delete({
      where: {
        id_reservasi: parseInt(id_reservasi),
      },
    });

    return res.status(200).json({
      status: 200,
      message: "Berhasil Menghapus Reservasi",
      data,
    });
  } catch (error) {
    console.error("Error during reservasi deletion:", error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan pada server.",
    });
  }
});

module.exports = { ReservasiRouter };
