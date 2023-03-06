<template>
  <section class="current-weather">
    <div class="current-weather__description">
      {{ capitalize(weather.current.weather[0].description) }}
    </div>
    <div class="current-weather__temps-today">
      <div class="current-weather__precip">
        <weather-icon
          :condition="weather.current.weather[0].icon"
          width="40"
          height="40"
          :color="iconColor"
        ></weather-icon>
        <div class="current-weather__precip-percent">
          {{ Math.floor((weather.daily[0].pop * 100) / 5) * 5 }}%
        </div>
      </div>
      <div class="current-weather__current-temp">{{ Math.floor(weather.current.temp) }}°</div>
      <div class="current-weather__hi-lo-today">
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

<style lang="scss">
.current-weather {
    align-items: center;
    display: flex;
    flex-direction: column;
    font-size: 2rem;
    margin-bottom: 1rem;
}

.current-weather__current-temp {
  font-size: 4rem;
}

.current-weather__description {
  align-items: center;
  display: flex;
  flex-direction: column;
  font-size: 1.5rem;
}

.current-weather__hi-lo-today {
  font-size: 1.5rem;
  margin-left: 1.5rem;
}

.current-weather__precip {
  display: flex;
  flex-direction: column;
  margin-right: 1.5rem;
}

.current-weather__precip-percent {
  font-size: 1.25rem;
  text-align: center;
}

.current-weather__temps-today {
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>
