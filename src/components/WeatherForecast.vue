<template>
  <div class="forecast-daily">
    <template v-for="(day, index) in props.forecast.daily" :key="index">
      <div v-if="index > 0 && index < 7" class="forecast-day">
        <div class="forecast-day__dow">{{ dow[(Math.floor(day.dt / 86400) + 4) % 7] }}</div>
        <weather-icon
          :color="props.iconColor"
          :condition="day.weather[0].icon"
          height="20"
          width="20"
        ></weather-icon>
        <div class="forcast-day__precip">
          {{ Math.floor((day.pop * 100) / 5) * 5 }}%
        </div>
        <div class="forecast-day__min">{{ Math.floor(day.temp.max) }}°</div>
        <div class="forecast-day__max">{{ Math.floor(day.temp.min) }}°</div>
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

<style lang="scss">
.forecast-daily {
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.forecast-day {
  align-items: center;
  display: flex;
  flex-direction: column;
}

.forecast-day__dow {
  margin-bottom: 0.5rem;
}

.forcast-day__precip {
  margin-bottom: 0.5rem;
}
</style>
