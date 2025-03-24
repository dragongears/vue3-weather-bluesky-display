<template>
  <section class="weather font-bold">
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
import { onMounted, ref, watch } from 'vue';
import capitalize from '../utils/capitalize';

const props = defineProps({
  apiKey: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
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

watch(() => props.latitude, (newVal) => {
  if (newVal > 0) {
    getWeather();
  }
});

async function fetchWeather() {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${props.latitude}&lon=${props.longitude}&appid=${props.apiKey}&units=imperial&exclude=minutely,alerts`);
    let responseData = null;

    if (response.status === 200) {
      responseData = await response.json();
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return responseData;
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    throw error;
  }
}

function getWeather() {
  fetchWeather()
  .then((response) => {
    weather.value = response;
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
  // getWeather()
});
</script>
