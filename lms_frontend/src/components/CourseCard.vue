<template>
  <div class="course-card" :style="{ background: cardColor }">
    <div class="course-image">
      <img :src="image" alt="Course image" />
    </div>
    <div class="course-content">
      <h2>{{ title }}</h2>
      <p class="instructor">By {{ instructor }}</p>
      <p class="desc">{{ description }}</p>
      <button class="cta" @click="$emit('view', id)">{{ ctaLabel }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: number|string,
  title: string,
  instructor: string,
  description: string,
  image: string,
  ctaLabel?: string,
  cardColor?: string
}>()
</script>

<style scoped>
.course-card {
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.12);
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  display: flex;
  flex-direction: column;
  background: #0099ff;
  color: #181818;
  min-width: 220px;
  max-width: 340px;
  min-height: 320px;
  margin: 0.5rem auto;
  transition: transform 0.15s, box-shadow 0.15s;
}
.course-card:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.18);
}
.course-image {
  width: 100%;
  height: 120px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.course-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.course-content h2 {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 0.3rem 0;
  color: #181818;
}
.instructor {
  font-size: 0.95rem;
  color: #222;
  margin-bottom: 0.5rem;
}
.desc {
  font-size: 1rem;
  color: #222;
  margin-bottom: 1.2rem;
}
.cta {
  background: #ffd600;
  color: #181818;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.cta:hover {
  background: #ffea80;
}
</style>
