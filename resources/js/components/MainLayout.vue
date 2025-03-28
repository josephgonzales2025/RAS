<template>
    <div class="container">
      <!-- Menú lateral -->
      <aside class="sidebar">
        <ul>
          <li @click="selectedComponent = 'Clientes'">Clientes</li>
          <li @click="selectedComponent = 'Proveedores'">Proveedores</li>
        </ul>
      </aside>
  
      <!-- Contenido dinámico -->
      <main class="content">
        <h1>{{ selectedComponent }}</h1>
        <p>Aquí se mostrará la interfaz según la opción seleccionada.</p>
      </main>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedComponent: 'Clientes' // Opción por defecto
      };
    }
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    height: 100vh;
  }
  .sidebar {
    width: 200px;
    background: #333;
    color: white;
    padding: 20px;
  }
  .sidebar ul {
    list-style: none;
    padding: 0;
  }
  .sidebar li {
    cursor: pointer;
    padding: 10px;
    border-bottom: 1px solid gray;
  }
  .sidebar li:hover {
    background: #555;
  }
  .content {
    flex-grow: 1;
    padding: 20px;
  }
  </style>
  