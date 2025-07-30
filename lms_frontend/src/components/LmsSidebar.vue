<template>
  <aside :class="['lms-sidebar', { collapsed }]">
    <div class="sidebar-header">
      <span class="logo">Λ</span>
      <button class="sidebar-toggle" @click="collapsed = !collapsed" aria-label="Toggle sidebar">
        <span v-if="collapsed">☰</span>
        <span v-else>×</span>
      </button>
    </div>
    <nav>
      <ul>
        <li v-for="item in navItems" :key="item.label">
          <RouterLink :to="item.to" class="sidebar-link">
            <span class="icon">{{ item.icon }}</span>
            <span v-if="!collapsed" class="label">{{ item.label }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
const collapsed = ref(false)
const navItems = [
  { label: 'Dashboard', to: '/', icon: '🏠' },
  { label: 'Courses', to: '/courses', icon: '📚' },
  { label: 'Enrollments', to: '/enrollments', icon: '📝' },
  { label: 'Live Sessions', to: '/live', icon: '🎥' },
  { label: 'Certificates', to: '/certificates', icon: '🎓' },
  { label: 'Profile', to: '/profile', icon: '👤' },
  { label: 'Logout', to: '/logout', icon: '🚪' },
]
</script>

<style scoped>
.lms-sidebar {
  background: #222222;
  color: #fff;
  width: 220px;
  min-width: 60px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  transition: width 0.2s;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
}
.lms-sidebar.collapsed {
  width: 60px;
}
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}
.logo {
  font-size: 2rem;
  font-weight: bold;
  color: #ffd600;
}
.sidebar-toggle {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
}
nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar-link {
  display: flex;
  align-items: center;
  padding: 1rem;
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  margin: 0.25rem 0.5rem;
  transition: background 0.2s;
}
.sidebar-link:hover, .sidebar-link.router-link-active {
  background: #181818;
  color: #ffd600;
}
.icon {
  font-size: 1.3rem;
  width: 2rem;
  text-align: center;
}
.label {
  margin-left: 0.5rem;
}
@media (max-width: 900px) {
  .lms-sidebar {
    position: fixed;
    width: 60px;
  }
  .lms-sidebar:not(.collapsed) {
    width: 180px;
  }
}
@media (max-width: 600px) {
  .lms-sidebar {
    width: 100vw;
    height: 56px;
    flex-direction: row;
    bottom: 0;
    top: auto;
    left: 0;
    right: 0;
    z-index: 200;
  }
  .sidebar-header, nav ul {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0;
  }
  nav ul {
    display: flex;
    width: 100vw;
  }
  .sidebar-link {
    flex-direction: column;
    padding: 0.5rem 0.25rem;
    margin: 0 0.25rem;
    font-size: 0.9rem;
  }
  .label {
    margin-left: 0;
    font-size: 0.7rem;
  }
}
</style>
