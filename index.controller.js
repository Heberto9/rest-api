const getIndex = (req, res) => {
  res.status(200).json({
    message: '¡Bienvenido a la REST API!',
  });
};

const getMarco = (req, res) => {
  res.status(200).json({
    message: '¡Hola Marco!',
  });
};

const getPing = (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'pong 🏓',
  });
};

module.exports = { getIndex, getMarco, getPing };