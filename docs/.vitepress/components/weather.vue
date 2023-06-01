<script setup>
import dayjs from "dayjs";
import { reactive, ref, toRaw, onMounted } from "vue";

const loading = ref(true);
const weather = reactive({
  date: "",
  windLevel: "",
  windDirection: "",
  high: "",
  low: "",
  tip: "",
  type: "",
  week: "",
  city: "",
});

onMounted(() => {
  getWeather()
})

const getCache = () => {
  const cache = JSON.parse(localStorage.getItem("weather") || "{}");

  if (cache.date && cache.date === dayjs().format("YYYY-MM-DD")) {
    const { date, windDirection, windLevel, week, tip, high, low, type, city } = cache;

    weather.date = date;
    weather.windDirection = windDirection;
    weather.windLevel = windLevel;
    weather.week = week;
    weather.tip = tip;
    weather.high = high;
    weather.low = low;
    weather.type = type;
    weather.city = city;
    loading.value = false;
    return true;
  }

  return false;
};

const getWeather = () => {
  if (getCache()) {
    return;
  }

  fetch("https://api.vvhan.com/api/weather?city=绍兴市")
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        const { date, fengli, fengxiang, week, tip, high, low, type } =
          res.info;

        weather.date = date;
        weather.windDirection = fengxiang;
        weather.windLevel = fengli;
        weather.week = week;
        weather.tip = tip;
        weather.high = high;
        weather.low = low;
        weather.type = type;
        weather.city = res.city;

        localStorage.setItem("weather", JSON.stringify(toRaw(weather)));
        loading.value = false;
      }
    });
};
</script>

<template>
  <div class="weather" v-if="!loading">
    {{ weather.date }} {{ weather.city }} {{ weather.week }} <br />
    {{ weather.low }}度~{{ weather.high }}度 {{ weather.type }}<br />
    {{ weather.windDirection }} {{ weather.windLevel }} <br />
    {{ weather.tip }}
  </div>
</template>

<style lang="scss">
.weather {
  position: absolute;
  right: 0px;
  bottom: 0px;
  text-align: right;
  color: #fff;
  height: 100%;
  padding: 10px;
}
</style>
