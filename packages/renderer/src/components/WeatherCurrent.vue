<template>
  <section class="flex flex-col items-center mb-4">
    <div class="flex flex-col items-center text-2xl">
      {{ capitalize(weather.current.weather[0].description) }}
    </div>
    <div class="flex items-center justify-center">
      <div class="flex flex-col mr-6">
        <weather-icon
          :condition="weather.current.weather[0].icon"
          width="40"
          height="40"
          :color="iconColor"
        ></weather-icon>
        <div class="text-center text-lg">
          {{ Math.floor((weather.daily[0].pop * 100) / 5) * 5 }}%
        </div>
      </div>
      <div class="text-6xl">{{ Math.floor(weather.current.temp) }}°</div>
      <div class="ml-6 text-xl">
        <div>Hi {{ Math.floor(weather.daily[0].temp.max) }}°</div>
        <div>Lo {{ Math.floor(weather.daily[0].temp.min) }}°</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import WeatherIcon from './WeatherIcon.vue';
import capitalize from '../utils/capitalize';

const props = defineProps({
  iconColor: {
    type: String,
    default: '#000000',
  },
  weather: {
    type: Object,
    required: true,
  },
});
</script>
