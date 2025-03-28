<template>
  <div class="container">
    <Sidebar @section-selected="changeSection" />
    <component :is="selectedComponent" ref="activeComponent" />
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue';
import Clients from './components/Clients.vue';
import Suppliers from './components/Suppliers.vue';
import Dispatches from './components/Dispatches.vue';

export default {
  components: { Sidebar, Clients, Suppliers, Dispatches },
  data() {
    return {
      selectedSection: 'clients'
    };
  },
  computed: {
    selectedComponent() {
      switch (this.selectedSection) {
        case 'clients': return 'Clients';
        case 'suppliers': return 'Suppliers';
        case 'dispatches': return 'Dispatches';
        default: return null;
      }
    }
  },
  methods: {
    changeSection(section) {
      this.selectedSection = section;
    }
  },
  watch: {
    selectedSection(newSection) {
      this.$nextTick(() => {
        if (newSection === 'clients') {
          this.$refs.activeComponent?.fetchClients?.();
        }
      });
    }
  }
};
</script>

<style>
.container {
  display: flex;
}
</style>