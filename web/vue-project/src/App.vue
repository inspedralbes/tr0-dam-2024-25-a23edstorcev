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
          <li v-for="(response, index) in newQuestion.respostes" :key="index">
            {{ response }} <button @click="removeResponse(index)">Eliminar</button>
          </li>
        </ul>
      </div>
      <button @click="createQuestion">Crear</button>
    </div>

    <h2>Preguntes Existents</h2>
    <ul>
      <li v-for="(question, index) in questions" :key="question.id || index">
        <input v-model="question.pregunta" @blur="updateQuestion(question)" />
        <input v-model="question.resposta_correcta" type="number" @blur="updateQuestion(question)" />
        <button @click="deleteQuestion(question.id)">Eliminar</button>
        <button @click="verifyAnswer(question)">Verificar</button>
        <img :src="question.imatge" alt="Imatge de la Pregunta" v-if="question.imatge" />
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
input {
  margin-right: 5px;
}
</style>
