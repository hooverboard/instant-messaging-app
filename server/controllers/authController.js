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

  // checar se o usuario existe
  const userExists = await User.findOne({ email });

  if (userExists) {
    // checar se a senha esta correta
    if (userExists.password !== password) {
      return res.status(400).json({ message: "Senha incorreta" });
    }
    jwt.sign(
      { id: userExists._id, email: userExists.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token, { httpOnly: true })
          .json({ message: "Login bem sucedido" });
      }
    );
  }
};

module.exports = {
  registerUser,
  loginUser,
};
