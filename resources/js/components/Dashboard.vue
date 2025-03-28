<template>
    <div class="dashboard">
      <h2>{{ title }}</h2>
      <p>Aquí se mostrará la información de {{ title }}.</p>
    </div>
  </template>
  
  <script>
  export default {
    props: ['title']
  };
  </script>
  
  <style scoped>
  .dashboard {
    flex: 1;
    padding: 20px;
  }
  </style>
  