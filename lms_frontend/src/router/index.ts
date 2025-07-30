import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/LandingView.vue')
    },
    {
      path: '/courses',
      name: 'courses',
      component: () => import('../views/LandingView.vue') // stub, reuse landing for now
    },
    {
      path: '/enrollments',
      name: 'enrollments',
      component: { template: '<div style="color:#fff;padding:2rem;">Enrollments Page (stub)</div>' }
    },
    {
      path: '/live',
      name: 'live',
      component: { template: '<div style="color:#fff;padding:2rem;">Live Sessions Page (stub)</div>' }
    },
    {
      path: '/certificates',
      name: 'certificates',
      component: { template: '<div style="color:#fff;padding:2rem;">Certificates Page (stub)</div>' }
    },
    {
      path: '/profile',
      name: 'profile',
      component: { template: '<div style="color:#fff;padding:2rem;">Profile Page (stub)</div>' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/logout',
      name: 'logout',
      component: { template: '<div style="color:#fff;padding:2rem;">Logging out...</div>' }
    }
  ]
})

export default router
