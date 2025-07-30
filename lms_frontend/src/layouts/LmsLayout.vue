<template>
  <div class="lms-layout">
    <LmsSidebar />
    <main class="lms-main">
      <header class="lms-header">
        <h1>Welcome to Lambda LMS</h1>
        <div class="user-greeting">Hello, Demo User!</div>
      </header>
      <section class="lms-content">
        <slot />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import LmsSidebar from '../components/LmsSidebar.vue'
</script>

<style scoped>
.lms-layout {
  display: flex;
  min-height: 100vh;
  background: #181818;
  color: #fff;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
}
.lms-main {
  flex: 1;
  width: 100%;
  min-width: 0;
  margin-left: 220px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #181818;
  transition: margin-left 0.2s;
}
.lms-header {
  padding: 2rem 2rem 1rem 2rem;
  background: #181818;
  border-bottom: 1px solid #222;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.lms-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #ffd600;
  margin: 0;
}
.user-greeting {
  font-size: 1.1rem;
  color: #fff;
}
.lms-content {
  flex: 1;
  width: 100%;
  min-width: 0;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
@media (max-width: 900px) {
  .lms-main {
    margin-left: 60px;
    width: 100%;
    min-width: 0;
  }
  .lms-header, .lms-content {
    padding: 1rem;
  }
}
@media (max-width: 600px) {
  .lms-layout {
    flex-direction: column;
  }
  .lms-main {
    margin-left: 0;
    margin-top: 56px;
    width: 100%;
    min-width: 0;
  }
  .lms-header, .lms-content {
    padding: 0.5rem;
  }
}
</style>
