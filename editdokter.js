const { db } = require("./database");

const EditDokterRouter = require("express").Router();

EditDokterRouter.post("/", async (req, res) => {
  console.log("Data yang dikirim:", req.body);  // Menampilkan data yang diterima

  const { nama, spesialis, biodata, pendidikan, pengalaman, kontak, id_user, id_user_klinik } = req.body;

  // Validasi bahwa id_user dan id_user_klinik ada
  if (!id_user) {
    return res.status(400).json({
      status: 400,
      message: "ID User wajib diisi.",
    });
  }

  // Jika id_user_klinik ada, validasi apakah klinik tersebut valid
  if (id_user_klinik) {
    const klinik = await db.user.findUnique({
      where: { id: id_user_klinik },
    });

    if (!klinik) {
      return res.status(404).json({
        status: 404,
        message: "User klinik dengan ID tersebut tidak ditemukan.",
      });
    }
  }

  try {
    const data = await db.dokter.create({
      data: {
        nama_dokter: nama,
        spesialis: spesialis,
        biodata: biodata,
        pendidikan: pendidikan,
        pengalaman: pengalaman,
        kontak: kontak,
        id_user: id_user, // Menambahkan ID User yang wajib
        id_user_klinik: id_user_klinik, // ID User Klinik bisa kosong
      },
    });

    return res.status(200).json({
      status: 200,
      message: "Berhasil Membuat Data dokter",
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan saat membuat data dokter.",
    });
  }
});





// EditDokterRouter.delete("/:id", async (req, res) => { ... });
EditDokterRouter.delete("/:id", async (req, res) => {
  console.log("Data yang dikirim:", req.params);

  const dokterId = parseInt(req.params.id); // Gunakan req.params.id untuk mendapatkan ID dari URL

  if (!dokterId) {
    return res.status(400).json({
      status: 400,
      message: "ID Dokter tidak ditemukan.",
    });
  }

  try {
    // Validasi dokter yang ingin dihapus
    const dokter = await db.dokter.findUnique({
      where: { id_dokter: dokterId },
    });

    if (!dokter) {
      return res.status(404).json({
        status: 404,
        message: "Dokter dengan ID tersebut tidak ditemukan.",
      });
    }

    // Hapus data yang berelasi (misalnya Jadwal, Reservasi)
    await db.jadwal.deleteMany({
      where: { id_dokter: dokterId },
    });

    await db.reservasi.deleteMany({
      where: {
        id_jadwal: {
          in: await db.jadwal.findMany({
            where: { id_dokter: dokterId },
            select: { id_jadwal: true },
          }).then((res) => res.map((item) => item.id_jadwal)),
        },
      },
    });

    // Hapus Dokter
    const data = await db.dokter.delete({
      where: { id_dokter: dokterId },
    });

    return res.status(200).json({
      status: 200,
      message: "Dokter berhasil dihapus",
      data,
    });
  } catch (error) {
    console.error("Error while deleting doctor:", error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan saat menghapus Dokter.",
    });
  }
});



EditDokterRouter.get("/", async (req, res) => {
  try {
    const data = await db.dokter.findMany({
      include: {
        user: true, // Relasi utama ke user
        user_dokter_id_user_klinikTouser: true, // Relasi opsional ke klinik
      },
    });

    return res.status(200).json({
      status: 200,
      message: "Berhasil mendapatkan data dokter",
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan saat mendapatkan data dokter.",
    });
  }
});
// EditDokterRouter.get("/", async (req, res) => { ... }); 

EditDokterRouter.get("/:id_user_klinik", async (req, res) => {
  const { id_user_klinik } = req.params;

  try {
    const data = await db.dokter.findMany({
      where: {
        id_user_klinik: parseInt(id_user_klinik),
      },
      include: {
        user: true,
        user_dokter_id_user_klinikTouser: true,
      },
    });

    return res.status(200).json({
      status: 200,
      message: "Berhasil mendapatkan data dokter",
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan saat mendapatkan data dokter.",
    });
  }
});






EditDokterRouter.put("/:id", async (req, res) => {
  const { id } = req.params; // Ambil ID dari URL
  const { nama_dokter, spesialis, biodata, pendidikan, pengalaman, kontak, id_user_klinik } = req.body;

  // Validasi id_user_klinik (pastikan ada user yang valid untuk id_user_klinik)
  const user = await db.user.findUnique({
    where: { id: id_user_klinik },
  });

  if (!user) {
    return res.status(404).json({
      status: 404,
      message: "User dengan ID tersebut tidak ditemukan.",
    });
  }

  try {
    const dokter = await db.dokter.update({
      where: { id_dokter: parseInt(id) }, // Gunakan ID dari URL
      data: {
        nama_dokter,
        spesialis,
        biodata,
        pendidikan,
        pengalaman,
        kontak,
        id_user_klinik, // Pastikan id_user_klinik valid
      },
    });

    return res.status(200).json({
      status: 200,
      message: "Dokter berhasil diperbarui.",
      data: dokter,
    });
  } catch (error) {
    console.error("Error while updating doctor:", error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan saat memperbarui data dokter.",
    });
  }
});






module.exports = {EditDokterRouter};