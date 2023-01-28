<template>
  <section class="dt">
    <div class="dt__time">{{ timeStr }}</div>
    <div class="dt__date">{{ dateStr }}</div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';

let date = ref(new Date());

const dateStr = computed(() => {
  return date.value.toDateString('en-US', { weekday: 'long' });
});

const timeStr = computed(() => {
  return date.value.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  });
});

function intervalFunc() {
  date.value = new Date();
  setTimeout(intervalFunc, 1000);
}

onMounted(() => {
  intervalFunc();
});
</script>

<style lang="scss">
.dt {
  align-items: center;
  display: flex;
  flex-direction: column;
  font-weight: bold;
  margin-bottom: 1rem;
  margin-top: -14px;
}

.dt__date {
  font-size: 2rem;
}

.dt__time {
  font-size: 4rem;
}
</style>
