const { db } = require("./database");
const NotifikasiRouter = require("express").Router();

NotifikasiRouter.post("/", async (req, res) => {
  console.log("Data yang dikirim :", req.body);
  const pesan = req.body.pesan;
  const tanggal = req.body.tanggal;
  const data = await db.notifikasi.create({
      data: {
          pesan: pesan,
          tanggal_notifikasi: tanggal
    }
  });
  return res.status(200).json({
      status: 200,
      message: "Berhasil Membuat Data Notifikasi",
      data
  });
});

NotifikasiRouter.delete("/", async (req, res) => {
  console.log("Data yang dikirim :", req.body);
   const notifId = parseInt(req.body.id);
   const data = await db.notifikasi.delete({
    where: {
      id_notifikasi : notifId
    }
  });
  return res.status(200).json({
      status: 200,
      message: "Berhasil menghapus data Notifikasi",
      data
  });
});

// Endpoint untuk mendapatkan data notifikasi
NotifikasiRouter.get("/", async (req, res) => {
  try {
    const data = await db.notifikasi.findMany();
    return res.status(200).json({
      status: 200,
      message: "Berhasil mendapatkan data Notifikasi",
      data
    });
  } catch (error) {
    console.error("Error fetching notifikasi:", error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan pada server"
    });
  }
});

module.exports = { NotifikasiRouter };
