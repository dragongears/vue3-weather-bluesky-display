<template>
  <section class="weather">
    <div v-if="weather" class="weather__data">
      <weather-current
        :icon-color="iconColor"
        :weather="weather"
      ></weather-current>
      <weather-forecast
        :forecast="weather"
        :icon-color="iconColor"
      ></weather-forecast>
      <div class="weather__summary">
        {{ capitalize(weather.daily[0].weather[0].description) }}
      </div>
    </div>
    <div v-else class="weather__message">
      {{ message }}
    </div>
  </section>
</template>

<script setup>
import WeatherCurrent from './WeatherCurrent.vue';
import WeatherForecast from './WeatherForecast.vue';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import capitalize from '../utils/capitalize';

const props = defineProps({
  apiKey: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  updateInterval: {
    type: Number,
    default: 3600,
  },
});
const emit = defineEmits(['updated']);
const iconColor = ref('#35495e');
let message = ref('Waiting for weather data');
let weather = ref(null);

function getWeather() {
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${props.latitude}&lon=${props.longitude}&appid=${props.apiKey}&units=imperial&exclude=minutely,alerts`,
    )
    .then((response) => {
      if (response.status === 200) {
        weather.value = response.data;
      } else {
        weather.value = null;
        message.value = `${response.status}: ${response.statusText}`;
      }
      emit('updated', Date.now());
      if (props.updateInterval) {
        setTimeout(getWeather, props.updateInterval * 1000);
      }
    })
    .catch((e) => {
      weather.value = null;
      message.value = `${e.message} - ${new Date().toString()}`;
      if (props.updateInterval) {
        setTimeout(getWeather, props.updateInterval * 1000);
      }
    });
}

onMounted(() =>{
  getWeather()
});
</script>

<style lang="scss">
.weather {
  font-weight: bold;
}
</style>
