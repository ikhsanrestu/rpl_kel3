const { db } = require("./database");
const UlasanRouter = require("express").Router();

UlasanRouter.post("/", async (req, res) => {
  console.log("Data yang dikirim :", req.body)
  const rating = parseFloat(req.body.rating);
  const komentar = req.body.komentar;

  if (isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        status: 400,
        message: "Rating harus berupa angka antara 1.0 hingga 5.0",
      });
    }
  const data = await db.ulasan.create({
      data: {
          rating: rating,
          komentar: komentar
    }
  })
  return res.status(200).json({
      status: 200,
      message: "Berhasil Membuat Data Ulasan",
      data
  })
})

UlasanRouter.delete("/", async (req, res) => {
  console.log("Data yang dikirim :", req.body)
   const ulasanfId = parseInt(req.body.id);
   const data = await db.ulasan.delete({
    where: {
      id_ulasan : ulasanfId
    }
  })
  return res.status(200).json({
      status: 200,
      message: "Berhasil menghapus data Ulasan",
      data
  })
})

UlasanRouter.get("/", async (req, res) => {
  try {
    const data = await db.ulasan.findMany();
    return res.status(200).json({
      status: 200,
      message: "Berhasil mendapatkan data ulasan",
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan saat mendapatkan data ulasan",
      error: error.message,
    });
  }
});

UlasanRouter.get("/:id", async (req, res) => {
  const idUlasan = parseInt(req.params.id, 10);
  if (isNaN(idUlasan)) {
      return res.status(400).json({ status: 400, message: "ID ulasan tidak valid" });
  }
  try {
      const ulasan = await db.ulasan.findUnique({ where: { id_ulasan: idUlasan } });
      if (!ulasan) {
          return res.status(404).json({ status: 404, message: "Ulasan tidak ditemukan" });
      }
      return res.status(200).json({ status: 200, message: "Berhasil mendapatkan ulasan", data: ulasan });
  } catch (error) {
      console.error("Error fetching ulasan:", error);
      return res.status(500).json({ status: 500, message: "Kesalahan server", error: error.message });
  }
});


module.exports = {UlasanRouter};