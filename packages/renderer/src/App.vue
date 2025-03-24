<template>
  <main class="flex justify-between gap-4 h-screen max-h-[480px] max-w-[800px] w-screen p-4 m-auto">
    <section class="flex flex-col min-w-[220px] w-full">
      <DateAndTime></DateAndTime>
      <WeatherPanel :api-key="weatherApiKey" :latitude="latitude" :longitude="longitude" @updated="showUpdateDateTime">
      </WeatherPanel>
      <section v-if="lastUpdated" class="flex flex-col-reverse flex-grow text-xs">
        <div>
          Last updated: {{ dateStr }} {{ timeStr }}
        </div>
      </section>
    </section>
    <section class="w-[1129px]">
      <bluesky-image :token="blueskyUsername" :slideshow-max-images="maxImages"></bluesky-image>
    </section>
  </main>
</template>

<script setup>
import DateAndTime from './components/DateAndTime.vue';
import BlueskyImage from './components/BlueskyImage.vue';
import WeatherPanel from './components/WeatherPanel.vue';
import { computed, ref } from 'vue';

const geoapifyApiKey = import.meta.env.VITE_APP_GEOAPIFY;
const latitude = ref(0);
const longitude = ref(0);
const lastUpdated = ref(null);
const weatherApiKey = ref(import.meta.env.VITE_APP_OPENWEATHER);
const blueskyUsername = ref(import.meta.env.VITE_APP_BLUESKY_USERNAME);
const maxImages = ref(Number(import.meta.env.VITE_APP_MAX_IMAGES));
const dateStr = computed(() => {
  return lastUpdated.value.toDateString('en-US', { weekday: 'long' });
});
const timeStr = computed(() => {
  return lastUpdated.value.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  })
});

getGeolocation();

function getGeolocation() {
  fetch(`https://api.geoapify.com/v1/ipinfo?&apiKey=${geoapifyApiKey}`, { method: 'GET', })
    .then(response => response.json())
    .then(result => {
      console.log('>>>> geolocation success ', result)
      latitude.value = result.location.latitude;
      longitude.value = result.location.longitude;
    })
    .catch(error => {
      console.log('>>>> geolocation error', error)
      latitude.value = Number(import.meta.env.VITE_APP_LATITUDE);
      longitude.value = Number(import.meta.env.VITE_APP_LONGITUDE);
    });
}

function showUpdateDateTime() {
  lastUpdated.value = new Date();
}
</script>
