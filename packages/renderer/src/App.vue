<template>
  <main>
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
      <bluesky-image
        :token="blueskyUsername"
        :slideshow-max-images="20"
      ></bluesky-image>
    </section>
  </main>
</template>

<script setup>
import DateAndTime from './components/DateAndTime.vue';
import BlueskyImage from './components/BlueskyImage.vue';
import WeatherPanel from './components/WeatherPanel.vue';
import { computed, ref } from 'vue';

const lastUpdated = ref(null);
const weatherApiKey = ref(import.meta.env.VITE_APP_OPENWEATHER);
const blueskyUsername = ref(import.meta.env.VITE_APP_BLUESKY_USERNAME);
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
