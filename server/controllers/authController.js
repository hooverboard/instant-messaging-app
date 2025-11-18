const User = require("../models/userModels");
const jwt = require("jsonwebtoken");

// registrar usuario

const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // base cases
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Todos campos sao obrigatórios" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "As senhas nao coincidem" });
  }

  // checar se o usuario ja existe
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "Usuario ja existe" });
  }

  // criar novo usuario
  try {
    const newUser = await new User({
      name,
      email,
      password,
    });
    await newUser.save();
    return res.status(201).json({ message: " Usuario criado com sucesso" });
  } catch (error) {
    console.log("Error creating user: ", error);
    return res.status(500).json({ message: "Erro ao criar usuario" });
  }
};

// login usuario

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // base cases
  if (!email || !password) {
    return res.status(400).json({ message: "Todos campos sao obrigatórios" });
  }

  try {
    // checar se o usuario existe
    const userExists = await User.findOne({ email });

    if (!userExists) {
      return res.status(404).json({ message: "Usuario nao encontrado" });
    }

    // checar se a senha esta correta
    if (userExists.password !== password) {
      return res.status(400).json({ message: "Senha incorreta" });
    }

    // criar token
    const token = jwt.sign({ userId: userExists._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // enviar resposta com cookie
    return res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        message: "Login bem sucedido",
        user: {
          id: userExists._id,
          name: userExists.name,
          email: userExists.email,
        },
      });
  } catch (error) {
    console.log("Error logging in: ", error);
    return res.status(500).json({ message: "Erro ao fazer login" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
