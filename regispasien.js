const { db } = require("./database");


const RegisPasienRouter = require("express").Router();

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

RegisPasienRouter.post("/", async (req, res) => {
  console.log("Data yang dikirim :", req.body)
  const nama = req.body.nama;
  const email = req.body.email;
  const kata_sandi = req.body.kata_sandi;
  const kabupaten_kota = req.body.kabupaten_kota;
  const kecamatan = req.body.kecamatan;
  const alamat_detail = req.body.alamat_detail;
  const role = "Pasien"

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

    if (existingUser) {
      return res.status(409).json({
        status: 409,
        message: "Email sudah digunakan! Silakan gunakan email lain.",
      });
    }
  
  
    const data = await db.user.create({
      data: {
        nama: nama,
        email: email,
        kata_sandi: kata_sandi,
        kabupaten_kota: kabupaten_kota,
        kecamatan: kecamatan,
        alamat_detail: alamat_detail,
        role: role
      }
    })
    return res.status(200).json({
      status: 200,
      message: "Berhasil Membuat Data User",
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

RegisPasienRouter.delete("/", async (req, res) => {
  console.log("Data yang dikirim :", req.body)
    const userId = parseInt(req.body.id);
      const data = await db.user.delete({
    where: {
      id:userId
    }
  })
  return res.status(200).json({
      status: 200,
      message: "Berhasil Menghapus Data User",
      data
  })
})


module.exports = {RegisPasienRouter};