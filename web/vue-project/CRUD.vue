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
        <li v-for="question in questions" :key="question.id">
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
  import axios from 'axios';
  
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
    created() {
      this.fetchQuestions();
    },
    methods: {
      async fetchQuestions() {
        const response = await axios.get('http://localhost:3000/api/questions');
        this.questions = response.data.preguntes; // Asegúrate de que la respuesta sea correcta
      },
      async createQuestion() {
        const response = await axios.post('http://localhost:3000/api/questions', this.newQuestion);
        this.questions.push(response.data);
        this.newQuestion = { pregunta: '', respostes: [], resposta_correcta: null, imatge: '' };
      },
      addResponse() {
        if (this.newResponse) {
          this.newQuestion.respostes.push(this.newResponse);
          this.newResponse = '';
        }
      },
      removeResponse(index) {
        this.newQuestion.respostes.splice(index, 1);
      },
      async updateQuestion(question) {
        await axios.put(`http://localhost:3000/api/questions/${question.id}`, question);
      },
      async deleteQuestion(id) {
        await axios.delete(`http://localhost:3000/api/questions/${id}`);
        this.questions = this.questions.filter(q => q.id !== id);
      },
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
  