const { db } = require("./database");


const RegisKlinikRouter = require("express").Router();

// RegisPasienRouter.post("/", async (req, res) => {
//   console.log("Data yang dikirim :", req.body)
//   const nama = req.body.nama;
//   const password = req.body.password;

//   //buat data
//   // const data = await db.user.create({
//   //   data: {
//   //     nama: nama,
//   //     password: password
//   //   }
//   // })
//   //delete data
//   //  const data = await db.user.delete({
//   //   where: {
//   //     id:1
//   //   }
//   // })
//   //update data
//   // const data = await db.user.update({
//   //   where: {
//   //     id:2
//   //   },
//   //   data: {
//   //     nama: nama,
//   //     password: password
//   //   }
//   // })

//   // const data = await db.user.findMany()

//   // const data = await db.user.findFirst({
//   //   where: {
//   //     nama: nama
//   //   }
//   // })

//   return res.status(200).json({
//       status: 200,
//       message: "Berhasil Membuat Data User",
//       data
//   })
// })

RegisKlinikRouter.post("/", async (req, res) => {
console.log("Data yang dikirim :", req.body)
    const nama = req.body.nama;
    const email = req.body.email;
    const kata_sandi = req.body.kata_sandi;
    const kabupaten_kota = req.body.kabupaten_kota;
    const kecamatan = req.body.kecamatan;
    const alamat_detail = req.body.alamat_detail;
    const role = req.body.role;
    
     if (!nama || !email || !kata_sandi || !kabupaten_kota || !kecamatan || !alamat_detail || !role) {
      return res.status(400).json({
        status: 400,
        message: "Data tidak lengkap. Harap isi semua field yang diperlukan.",
      });
    }

    try {
    const existingUser = await db.user.findFirst({
      where: {
        email: email,
      },
    });
        
    const data = await db.user.create({
    data: {
        nama: nama,
        email: email,
        kata_sandi: kata_sandi,
        kabupaten_kota: kabupaten_kota,
        kecamatan: kecamatan,
        alamat_detail: alamat_detail,
        role : role
    }
    })
  return res.status(200).json({
      status: 200,
      message: "Berhasil Membuat Data klinik",
      data
  })
}catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan pada server.",
    });
  }
});

RegisKlinikRouter.delete("/", async (req, res) => {
  console.log("Data yang dikirim :", req.body)
    const userId = parseInt(req.body.id);
      const data = await db.user.delete({
    where: {
      id:userId
    }
  })
  return res.status(200).json({
      status: 200,
      message: "Berhasil Menghapus Data Klinik",
      data
  })
})

RegisKlinikRouter.get("/", async (req, res) => {
  try {
    // Ambil query parameter, jika ada
    const { id, email } = req.query;

    let klinikData;

    if (id) {
      // Jika ada ID, cari klinik berdasarkan ID
      klinikData = await db.user.findUnique({
        where: { id: parseInt(id) },
      });
    } else if (email) {
      // Jika ada email, cari klinik berdasarkan email
      klinikData = await db.user.findUnique({
        where: { email: email },
      });
    } else {
      // Jika tidak ada parameter, ambil semua data klinik
      klinikData = await db.user.findMany({
        where: { role: "Klinik" }, // Filter hanya data dengan role 'Klinik'
      });
    }

    // Periksa apakah data ditemukan
    if (!klinikData || (Array.isArray(klinikData) && klinikData.length === 0)) {
      return res.status(404).json({
        status: 404,
        message: "Data klinik tidak ditemukan.",
      });
    }

    // Berikan respons dengan data
    return res.status(200).json({
      status: 200,
      message: "Berhasil mendapatkan data klinik.",
      data: klinikData,
    });
  } catch (error) {
    console.error("Error fetching klinik data:", error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan pada server.",
    });
  }
});

module.exports = {RegisKlinikRouter};
