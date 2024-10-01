const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// Creamos la aplicación Express
const app = express();
app.use(cors());
// Definir la ruta del archivo JSON de preguntas
const questionsFilePath = path.join(__dirname, 'questionari.json');
console.log('Ruta del archivo:', questionsFilePath);

// Middleware para parsear el cuerpo de las solicitudes en JSON
app.use(express.json());

// Función para leer las preguntas del archivo
const readQuestionsFromFile = () => {
  if (!fs.existsSync(questionsFilePath)) {
    console.error('El archivo no existe:', questionsFilePath);
    return []; // Devuelve un array vacío si el archivo no existe
  }
  try {
    const data = fs.readFileSync(questionsFilePath, 'utf8');
    console.log('Contenido del archivo:', data); // Verifica el contenido
    return JSON.parse(data).preguntes; // Devuelve directamente el array de preguntas
  } catch (error) {
    console.error('Error al leer el archivo:', error);
    throw new Error('Error al leer las preguntas.');
  }
};

// Función para escribir las preguntas en el archivo
const writeQuestionsToFile = (questions) => {
  try {
    const data = JSON.stringify({ preguntes: questions }, null, 2);
    fs.writeFileSync(questionsFilePath, data);
  } catch (error) {
    console.error('Error al escribir el archivo:', error);
    throw new Error('Error al guardar las preguntas.');
  }
};

// Crear una nueva pregunta
app.post('/api/questions/', (req, res) => {
  const { pregunta, respostes, resposta_correcta } = req.body;

  if (!pregunta || !respostes || resposta_correcta === undefined) {
    return res.status(400).send('Datos incompletos.');
  }

  const questions = readQuestionsFromFile();
  const newQuestion = {
    id: questions.length + 1,
    pregunta,
    respostes,
    resposta_correcta,
    stats: {
      correctCount: 0,
      incorrectCount: 0,
      averageResponseTime: 0,
    },
  };

  questions.push(newQuestion);
  writeQuestionsToFile(questions);
  res.status(201).json(newQuestion);
});

// Obtener todas las preguntas
app.get('/api/questions', (req, res) => {
  try {
    const questions = readQuestionsFromFile();
    res.json({ preguntes: questions });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Verificar respuesta
app.post('/verify', (req, res) => {
  const { id, answer, responseTime } = req.body;

  if (id === undefined || answer === undefined || responseTime === undefined) {
    return res.status(400).send('Datos incompletos.');
  }

  const questions = readQuestionsFromFile();
  const question = questions.find(q => q.id === id);

  if (!question) {
    return res.status(404).send('Pregunta no encontrada.');
  }

  const isCorrect = answer === question.resposta_correcta;

  // Actualizar estadísticas
  if (isCorrect) {
    question.stats.correctCount++;
  } else {
    question.stats.incorrectCount++;
  }

  const totalResponses = question.stats.correctCount + question.stats.incorrectCount;
  question.stats.averageResponseTime =
    ((question.stats.averageResponseTime * (totalResponses - 1)) + responseTime) / totalResponses;

  writeQuestionsToFile(questions);
  res.json({ isCorrect, question });
});

// Actualizar pregunta
app.put('/api/questions/:id', (req, res) => {
  const { id } = req.params;
  const { pregunta, respostes, resposta_correcta } = req.body;

  if (!pregunta || !respostes || resposta_correcta === undefined) {
    return res.status(400).send('Datos incompletos.');
  }

  const questions = readQuestionsFromFile();
  const questionToUpdate = questions.find(q => q.id === parseInt(id));

  if (!questionToUpdate) {
    return res.status(404).send('Pregunta no encontrada.');
  }

  questionToUpdate.pregunta = pregunta;
  questionToUpdate.respostes = respostes;
  questionToUpdate.resposta_correcta = resposta_correcta;

  writeQuestionsToFile(questions);
  res.json(questionToUpdate);
});

// Eliminar pregunta
app.delete('/api/questions/:id', (req, res) => {
  const { id } = req.params;
  const questions = readQuestionsFromFile();
  const updatedQuestions = questions.filter(q => q.id !== parseInt(id));

  if (questions.length === updatedQuestions.length) {
    return res.status(404).send('Pregunta no encontrada.');
  }

  writeQuestionsToFile(updatedQuestions);
  res.status(204).send();
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
