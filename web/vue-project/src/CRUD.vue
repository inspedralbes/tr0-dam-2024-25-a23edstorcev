<template>
  <div>
    <h1>Gestor de Preguntes</h1>

    <div>
      <h2>Crear Nova Pregunta</h2>
      <input v-model="newQuestion.pregunta" placeholder="Pregunta" />
      <input v-model="newQuestion.resposta_correcta" type="number" placeholder="Índex de Resposta Correcta" />
      <div>
        <h3>Respostes</h3>
        <input v-model="newResponse" placeholder="Nova Resposta" />
        <button @click="addResponse">Afegir Resposta</button>
        <ul>
          <li v-for="(response, index) in newQuestion.respostes" :key="index" class="response-item">
            {{ response }} <button @click="removeResponse(index)">Eliminar</button>
          </li>
        </ul>
      </div>
      <button @click="createQuestion">Crear</button>
    </div>

    <h2>Preguntes </h2>
    <ul class="questions-list">
      <li v-for="(question, index) in questions" :key="question.id || index" class="question-item">
        <div class="question-content">
          <input v-model="question.pregunta" @blur="updateQuestion(question)" class="question-input" />
          <div class="respostes-container">
          <ul class="respostes-list">
    <li v-for="(resposta, index) in question.respostes" :key="index" class="resposta-item">
      <input v-model="question.respostes[index]" @blur="updateQuestion(question)" />
    </li>
  </ul>
</div>

          <input v-model="question.resposta_correcta" type="number" @blur="updateQuestion(question)" class="correct-answer-input" />
          <button @click="updateQuestion(question.id)" class="updatee-btn">Actualitzar</button>
          <button @click="deleteQuestion(question.id)" class="delete-btn">Eliminar</button>
          <img :src="question.imatge" alt="Imatge de la Pregunta" v-if="question.imatge" class="question-img" />
        </div>
      </li>
    </ul>
  </div>
</template>



<script>

export default {
  data() {
    return {
      questions: [],
      newQuestion: {
        pregunta: '',
        respostes: [],
        resposta_correcta: null,
        imatge: ''
      },
      newResponse: '',
    };
  },
  mounted() {
    this.fetchQuestions();
  },
  methods: {
    // Obtener las preguntas (GET request)
    async fetchQuestions() {
      try {
        const response = await fetch('http://localhost:3000/api/questions');
        const data = await response.json();
        this.questions = data.preguntes;
      } catch (error) {
        console.error('Error al obtener las preguntas:', error);
      }
    },

    // Crear una nueva pregunta (POST request)
    async createQuestion() {
      try {
        const response = await fetch('http://localhost:3000/api/questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.newQuestion),
        });
        const data = await response.json();
        this.questions.push(data);
        this.newQuestion = { pregunta: '', respostes: [], resposta_correcta: null, imatge: '' };
      } catch (error) {
        console.error('Error al crear la pregunta:', error);
      }
    },

    // Añadir una nueva respuesta
    addResponse() {
      if (this.newResponse) {
        this.newQuestion.respostes.push(this.newResponse);
        this.newResponse = '';
      }
    },

    // Eliminar una respuesta
    removeResponse(index) {
      this.newQuestion.respostes.splice(index, 1);
    },

    // Actualizar una pregunta (PUT request)
    async updateQuestion(question) {
      try {
        await fetch(`http://localhost:3000/api/questions/${question.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(question),
        });
      } catch (error) {
        console.error('Error al actualizar la pregunta:', error);
      }
    },

    // Eliminar una pregunta (DELETE request)
    async deleteQuestion(id) {
      try {
        await fetch(`http://localhost:3000/api/questions/${id}`, {
          method: 'DELETE',
        });
        this.questions = this.questions.filter(q => q.id !== id);
      } catch (error) {
        console.error('Error al eliminar la pregunta:', error);
      }
    },

    // Verificar la respuesta correcta
    async verifyAnswer(question) {
      const answerIndex = prompt('Introdueix l\'índex de la resposta correcta (0, 1, 2, etc.):');
      const isCorrect = parseInt(answerIndex) === question.resposta_correcta;
      alert(isCorrect ? '¡Resposta Correcta!' : 'Resposta Incorrecta.');
    },
  },
};
</script>

<style scoped>
/* Contenedor principal */
div {
  font-family: 'Arial', sans-serif;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Título principal */
h1 {
  text-align: center;
  color: #333;
  font-size: 2.5em;
  margin-bottom: 20px;
}

/* Subtítulos */
h2 {
  color: #555;
  font-size: 1.8em;
  margin-bottom: 10px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 5px;
}

/* Estilo de los inputs */
input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1em;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

input:focus {
  border-color: #80b4ff;
  outline: none;
}

/* Botones */
button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s;
  margin: 5px 0;
  display: block;
  width: 100%;
}

button:hover {
  background-color: #45a049;
  transform: scale(1.05);
}

button:active {
  background-color: #3e8e41;
}

/* Botón eliminar */
.delete-btn {
  background-color: #f44336;
}

.delete-btn:hover {
  background-color: #e41e1e;
}

/* Lista de preguntas y respuestas */
.questions-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.question-item {
  margin-bottom: 20px;
}

.question-item {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Contenedor de respuestas */



.question-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
  
}

/* Imágenes */
.question-img {
  max-width: 100px;
  border-radius: 10px;
  margin-top: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: block; /* Asegurarse de que sea un bloque */
  margin-left: auto; /* Margen automático para centrar a la izquierda */
  margin-right: auto; /* Margen automático para centrar a la derecha */
}

/* Estilos adicionales para inputs de la pregunta */
.question-input,
.correct-answer-input {
  width: 100%;
}

/* Transiciones */
button,
input,
.question-item {
  transition: all 0.3s ease;
}

h3 {
  margin-top: 15px;
  font-size: 1.5em;
  color: #666;
}
/* Respuestas y contenedor de respuestas */
.respostes-container {
  margin-top: 10px;
}

.respostes-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Alinear respuestas a la izquierda */
  padding: 0; /* Quitar el padding si es necesario */
}

.resposta-item {
  margin-bottom: 10px;
  text-align: left; /* Alinear el texto de cada respuesta a la izquierda */
}

</style>


