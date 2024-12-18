const { db } = require("./database");
const JadwalDokterRouter = require("express").Router();

JadwalDokterRouter.get("/:id_jadwal", async (req, res) => {
  const idJadwal = parseInt(req.params.id_jadwal);

  try {
    const jadwal = await db.jadwal.findUnique({
      where: {
        id_jadwal: idJadwal  // Pastikan id_jadwal menggunakan nilai idJadwal yang sudah dihitung
      },
      include: {
        dokter: {
          include: {
            user_dokter_id_user_klinikTouser: true
          }
        }
      }
    });

    if (!jadwal) {
      return res.status(404).json({
        status: 404,
        message: "Jadwal tidak ditemukan.",
      });
    }

    const dokterInfo = jadwal.dokter
      ? {
          id_dokter: jadwal.dokter.id_dokter, // Menambahkan id_dokter
          nama_dokter: jadwal.dokter.nama_dokter || "Tidak Diketahui",
          spesialis: jadwal.dokter.spesialis || "Tidak Diketahui",
          id_user_klinik: jadwal.dokter.user_dokter_id_user_klinikTouser
            ? jadwal.dokter.user_dokter_id_user_klinikTouser.id
            : null,
        }
      : {};

    return res.status(200).json({
      status: 200,
      data: {
        jadwal: {
          id_jadwal: jadwal.id_jadwal,
          hari: jadwal.hari,
          jam: jadwal.jam,
        },
        dokter: dokterInfo,
      },
    });
  } catch (error) {
    console.error("Error fetching jadwal:", error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan pada server.",
    });
  }
});



JadwalDokterRouter.get("/dokter/:id_dokter", async (req, res) => {
  const idDokter = parseInt(req.params.id_dokter); // Pastikan id_dokter adalah integer

  // Pastikan idDokter valid (integer dan bukan NaN)
  if (isNaN(idDokter)) {
      return res.status(400).json({
          status: 400,
          message: "ID dokter tidak valid.",
      });
  }

  try {
      // Query Prisma untuk mencari jadwal berdasarkan id_dokter
      const jadwalDokter = await db.jadwal.findMany({
          where: {
              id_dokter: idDokter, // id_dokter harus langsung dalam bentuk integer
          },
          include: {
              dokter: true, // Menyertakan informasi dokter
          },
      });

      if (!jadwalDokter || jadwalDokter.length === 0) {
          return res.status(404).json({
              status: 404,
              message: "Tidak ada jadwal yang ditemukan untuk dokter ini.",
          });
      }

      return res.status(200).json({
          status: 200,
          data: jadwalDokter,
      });
  } catch (error) {
      console.error("Error fetching jadwal:", error);
      return res.status(500).json({
          status: 500,
          message: "Terjadi kesalahan pada server.",
      });
  }
});




JadwalDokterRouter.post("/", async (req, res) => {
  let { id_dokter, hari, jam } = req.body;

  // Validasi input
  if (!id_dokter || !hari || !jam) {
    return res.status(400).json({
      status: 400,
      message: "Semua field harus diisi (id_dokter, hari, jam).",
    });
  }

  // Konversi id_dokter menjadi integer
  id_dokter = parseInt(id_dokter);
  if (isNaN(id_dokter)) {
    return res.status(400).json({
      status: 400,
      message: "ID dokter harus berupa angka.",
    });
  }

  // Validasi format jam
  const jamPattern = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
  if (!jamPattern.test(jam)) {
    return res.status(400).json({
      status: 400,
      message: "Format jam tidak valid. Harus menggunakan format HH:mm.",
    });
  }

  try {
    // Menyimpan data jadwal ke database
    const jadwalBaru = await db.jadwal.create({
      data: {
        id_dokter,
        hari,
        jam,
      },
    });

    return res.status(201).json({
      status: 201,
      message: "Jadwal berhasil ditambahkan.",
      data: jadwalBaru,
    });
  } catch (error) {
    console.error("Error saving jadwal:", error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan pada server.",
    });
  }
});




module.exports = { JadwalDokterRouter };
