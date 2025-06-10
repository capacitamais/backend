require('dotenv').config();
const jwt = require("jsonwebtoken");

const createUserToken = async (user, req, res) => {
    // Definir o tempo de expiração baseado no papel do usuário
    let expiresIn;

    switch (user.role) {
        case "technician":
            expiresIn = "23h"; // Admins têm tokens com 12 horas de duração
            break;
        case "analyst":
            expiresIn = "2h"; // Usuários padrão têm tokens com 2 horas
            break;
        default:
            expiresIn = "1h"; // Outros papéis têm 1 hora
            break;
    }
    
    const token = jwt.sign(
        {
            id: user._id,
            name: user.name,
            registration: user.registration,
            role: user.role,
        },
        process.env.TOKEN_KEY,
        { expiresIn } 
    );

    res.status(200).json({
        message: 'Usuário autenticado.',
        token: token,
        expiresIn
    });
};

module.exports = createUserToken;
