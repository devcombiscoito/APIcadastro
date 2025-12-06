import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Cadastro
router.post("/cadastro", async (req, res) => {
  try {
    const user = req.body;

    const saltRounds = await bcrypt.genSalt(15);
    const hashPassword = await bcrypt.hash(user.password, saltRounds);

    const userDB = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: hashPassword,
      },
    });
    res.status(201).json(userDB);
  } catch (err) {
    res.status(500).json({
      message: "Erro no servidor! 😱",
    });
  }
});

// Login

router.post("/login", async (req, res) => {
  try {
    const userInfo = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: userInfo.email,
      },
    });

    if(!user) {
      return res.status(404).json({message: "Usuário não encontrado. 🧐"})
    }
  } catch (err) {
    res.status(500).json({
      message: "Erro no servidor! 😱",
    });
  }
});

export default router;
