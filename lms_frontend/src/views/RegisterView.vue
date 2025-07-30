<template>
  <div class="auth-bg">
    <div class="auth-card">
      <h2>Register for Lambda LMS</h2>
      <form @submit.prevent="onRegister">
        <label>Name
          <input v-model="name" type="text" required placeholder="Your name" />
        </label>
        <label>Email
          <input v-model="email" type="email" required placeholder="Enter your email" />
        </label>
        <label>Password
          <input v-model="password" type="password" required placeholder="Create a password" />
        </label>
        <label>Role
          <select v-model="role" required>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </label>
        <button class="cta" type="submit">Register</button>
      </form>
      <div class="switch-link">
        Already have an account?
        <RouterLink to="/login">Login</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('student')
function onRegister() {
  // TODO: handle register
  alert('Register: ' + name.value + ', ' + email.value + ', ' + role.value)
}
</script>

<style scoped>
.auth-bg {
  min-height: 100vh;
  background: #181818;
  display: flex;
  align-items: center;
  justify-content: center;
}
.auth-card {
  background: #222222;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.12);
  padding: 2.5rem 2rem 2rem 2rem;
  min-width: 320px;
  max-width: 95vw;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}
h2 {
  color: #0099ff;
  margin-bottom: 1.5rem;
}
form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
label {
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  color: #fff;
}
input, select {
  margin-top: 0.4rem;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: none;
  background: #181818;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: box-shadow 0.2s;
}
input:focus, select:focus {
  box-shadow: 0 0 0 2px #0099ff;
}
.cta {
  background: #0099ff;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.2rem;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
}
.cta:hover {
  background: #33bfff;
}
.switch-link {
  margin-top: 1.2rem;
  font-size: 0.98rem;
  color: #fff;
}
.switch-link a {
  color: #ffd600;
  text-decoration: underline;
  margin-left: 0.3rem;
}
@media (max-width: 600px) {
  .auth-card {
    min-width: 90vw;
    padding: 1.2rem 0.5rem;
  }
}
</style>
