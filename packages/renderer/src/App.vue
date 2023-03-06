<template>
  <main id="app">
    <section class="left-side">
      <DateAndTime></DateAndTime>
      <WeatherPanel
        :api-key="weatherApiKey"
        latitude="33.751497"
        longitude="-84.747714"
        @updated="showUpdateDateTime"
      ></WeatherPanel>
      <section v-if="lastUpdated" class="last-updated">
        <div class="last-updated__content">
          Last updated: {{ dateStr }} {{ timeStr }}
        </div>
      </section>
    </section>
    <section class="right-side">
      <instagram-image
        :token="instagramToken"
        :slideshow-max-images="10"
      ></instagram-image>
    </section>
  </main>
</template>

<script setup>
import DateAndTime from './components/DateAndTime.vue';
import InstagramImage from './components/InstagramImage.vue';
import WeatherPanel from './components/WeatherPanel.vue';
import { computed, ref } from 'vue';

const lastUpdated = ref(null);
const weatherApiKey = ref(import.meta.env.VITE_APP_OPENWEATHER);
const instagramToken = ref(import.meta.env.VITE_APP_INSTAGRAM_TOKEN);
const dateStr = computed(() => {
  return lastUpdated.value.toDateString('en-US', { weekday: 'long' });
});
const timeStr = computed(() => {
  return lastUpdated.value.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  })
});

function showUpdateDateTime() {
  lastUpdated.value = new Date();
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

main {
  display: flex;
  font-family: 'Source Sans Pro', sans-serif;
  gap: 16px;
  height: 100vh;
  justify-content: space-between;
  margin: auto;
  max-height: 480px;
  max-width: 800px;
  padding: 16px;
  width: 100vw;
}

.last-updated {
  display: flex;
  flex-direction: column-reverse;
  flex-grow: 1;
  font-size: 0.75em;
}

.left-side {
  display: flex;
  flex-direction: column;
  min-width: 220px;
  width: 568px;
}

.right-side {
    width: 100%;
}
</style>
