<template>
  <LmsLayout>
    <div class="course-grid">
      <CourseCard
        v-for="course in courses"
        :key="course.id"
        v-bind="course"
        cta-label="Enroll"
        :card-color="course.cardColor"
        @view="onViewCourse"
      />
    </div>
  </LmsLayout>
</template>

<script setup lang="ts">
import LmsLayout from '../layouts/LmsLayout.vue'
import CourseCard from '../components/CourseCard.vue'
import { ref } from 'vue'
const courses = ref([
  {
    id: 1,
    title: 'Vue.js for Beginners',
    instructor: 'Jane Doe',
    description: 'Learn Vue.js from scratch with hands-on projects.',
    image: 'https://placehold.co/320x120/0099ff/fff?text=Vue',
    cardColor: '#0099ff',
  },
  {
    id: 2,
    title: 'Node.js Essentials',
    instructor: 'John Smith',
    description: 'Master backend development with Node.js and Express.',
    image: 'https://placehold.co/320x120/ffd600/181818?text=Node',
    cardColor: '#ffd600',
  },
  {
    id: 3,
    title: 'Modern CSS & Responsive Design',
    instructor: 'Alex Lee',
    description: 'Build beautiful, responsive UIs for any device.',
    image: 'https://placehold.co/320x120/222222/ffd600?text=CSS',
    cardColor: '#222222',
  },
  {
    id: 4,
    title: 'Database Fundamentals',
    instructor: 'Maria Garcia',
    description: 'Understand SQL, NoSQL, and data modeling for web apps.',
    image: 'https://placehold.co/320x120/0099ff/fff?text=DB',
    cardColor: '#0099ff',
  },
  {
    id: 5,
    title: 'Fullstack Project Bootcamp',
    instructor: 'Chris Kim',
    description: 'Build and deploy a real-world LMS project end-to-end.',
    image: 'https://placehold.co/320x120/ffd600/181818?text=Fullstack',
    cardColor: '#ffd600',
  },
])
function onViewCourse(id: number|string) {
  // TODO: route to course details
  alert('View course ' + id)
}
</script>

<style scoped>
.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  margin: 0 auto;
  justify-items: center;
}
@media (max-width: 900px) {
  .course-grid {
    gap: 1rem;
  }
}
@media (max-width: 600px) {
  .course-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}
</style>
