const Usuario = require("../models/Usuario");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { throws } = require("assert");
const { exception } = require("console");
let salt = "f844b09ff50c";

exports.signup = (req, res) => {
  console.log(req.body);
  const userData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    nickname: req.body.usuario,
    password: req.body.password,
  };
  Usuario.findOne({
    // Asegúrese de que el nombre de usuario sea único, es decir, que el nombre de usuario no esté ya en la base de datos
    nickname: req.body.usuario,
  })
    .then((user) => {
      // Si es usuario es unico lo agrega a la base de datos
      if (!user) {
        let hash = crypto
          .pbkdf2Sync(userData.password, salt, 1000, 64, `sha512`)
          .toString(`hex`);
        userData.password = hash;
        Usuario.create(userData)
          .then((user) => {
            // Después de crear con éxito userData muestra el mensaje registrado
            res.status(200).send(user);
          })
          .catch((err) => {
            // Si se produjo un error al intentar crear userData, continúe y muestre el error
            res.status(500).send("error:" + err);
          });
      } else {
        // Si el nombre de usuario no es único, muestra que el nombre de usuario ya está registrado en una cuenta
        res.status(500).send({
          error:
            "El nickname " +
            req.body.usuario +
            " esta esta registrado con una  cuenta",
        });
      }
    })
    .catch((err) => {
      res.send("error:" + err);
    });
};

exports.list = (req, res) => {
  Usuario.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({ data });
  });
};

exports.signin = async(req, res) => {
  const { nickname, password } = req.body;

    try {
      const usuario = await Usuario.findOne({nickname});
      if( !usuario ){
        return res.status(400).json({
          ok: false,
          msg: 'Usuario no existe.'
        });
      }

      const newPassword = crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`)

      if(newPassword !== usuario.password){
        return res.status(400).json({
          ok: false,
          msg: 'Password incorrecto'
        });
      }
 
      res.json({
        usuario
      });
   
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: 'Por favor, hable con el Administrador.'
      });
    }  
};

exports.updateUsuario = async (req, res) => {
  const idUsuario = req.params.authId;
 
  try {
    const usuario = Usuario.findById(idUsuario);
    if (!usuario) {
      res.status(404).json({
        error: "Usuario no encontrada o no existe",
      });
    }
    const usuarioToInsert = {
      ...req.body,
    };
    const usuarioUpdated = await Usuario.findByIdAndUpdate(
      idUsuario,
      usuarioToInsert,
      { new: true }
    );

    res.json({
      message: "Actualizado",
      usuario: usuarioUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error interno",
    });
  }
};
