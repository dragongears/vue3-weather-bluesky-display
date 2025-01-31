<template>
  <section class="text-center font-bold mb-4 mt-[-8px]">
    <div class="mb-2 text-6xl">{{ timeStr }}</div>
    <div class="text-3xl">{{ dateStr }}</div>
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
