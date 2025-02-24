<template>
  <div class="flex justify-between mb-4 items-start">
    <template v-for="(day, index) in props.forecast.daily" :key="index">
      <div v-if="index > 0 && index < 7" class="flex flex-col items-center">
        <div class="mb-2">{{ dow[(Math.floor(day.dt / 86400) + 4) % 7] }}</div>
        <weather-icon
          :color="props.iconColor"
          :condition="day.weather[0].icon"
          height="30"
          width="30"
        ></weather-icon>
        <div class="mb-2">
          {{ Math.floor((day.pop * 100) / 5) * 5 }}%
        </div>
        <div>{{ Math.floor(day.temp.max) }}°</div>
        <div>{{ Math.floor(day.temp.min) }}°</div>
      </div>
    </template>
  </div>
</template>

<script setup>
import WeatherIcon from './WeatherIcon.vue';

const props = defineProps({
  forecast: {
    type: Object,
    required: true,
  },
  iconColor: {
    type: String,
    default: '#000000',
  },
});

const dow = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

</script>
