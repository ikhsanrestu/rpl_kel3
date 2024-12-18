const { db } = require("./database");
const LoginRouter = require("express").Router();

LoginRouter.post("/", async (req, res) => {
  try {
    const { email, kata_sandi } = req.body;

    if (!email || !kata_sandi) {
      return res.status(400).json({
        status: 400,
        message: "Email dan kata sandi wajib diisi!",
      });
    }

    const user = await db.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "Email tidak ditemukan!",
      });
    }

    if (user.kata_sandi !== kata_sandi) {
      return res.status(401).json({
        status: 401,
        message: "Kata sandi salah!",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Login berhasil!",
      data: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan pada server.",
    });
  }
});

module.exports = { LoginRouter };
