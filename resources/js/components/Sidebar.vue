<template>
  <div class="sidebar">
    <ul>
      <li @click="selectSection('clients')">Clientes</li>
      <li @click="selectSection('suppliers')">Proveedores</li>
      <li @click="selectSection('dispatches')">Despachos</li>
    </ul>
  </div>
</template>

<script>
export default {
  methods: {
    selectSection(section) {
      this.$emit('section-selected', section);
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 200px;
  background: #2c3e50;
  color: white;
  height: 100vh;
  padding: 20px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  padding: 10px;
  cursor: pointer;
}
li:hover {
  background: #34495e;
}
</style>
