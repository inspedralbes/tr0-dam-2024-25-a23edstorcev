const express = require('express');
const bodyParser = require('body-parser');
const questionRoutes = require('./utils.js');

const app = express();
app.use(bodyParser.json());

app.use('/api/questions', questionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
