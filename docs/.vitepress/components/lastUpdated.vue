<script setup>
import { toRefs, computed, defineProps } from "vue";
import { useData } from "vitepress";
import dayjs from "dayjs";

const props = defineProps({
  date: { type: String },
});

const { page } = useData();
const { lastUpdated } = toRefs(page.value);

const today = computed(() => {
  console.log(props.date)

  if (props.date) {
    return dayjs(props.date).format("YYYY年M月DD号");
  }

  if (lastUpdated?.value) {
    return dayjs(lastUpdated?.value).format("YYYY年M月DD号");
  }
  return dayjs().format("YYYY年M月DD号");
});
</script>

<template>
  <div class="today">今天是 {{ today }}。</div>
</template>

<style lang="scss">
.today {
  font-size: 14px;
  font-weight: 500;
  min-width: 60px;
  height: 24px;
  border-radius: 4px;
  margin-right: 4px;
}
</style>
