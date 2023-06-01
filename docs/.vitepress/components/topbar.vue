<script setup>
import { defineProps } from "vue";
import Audio from "./audio.vue";
import Receiver from "./receiver.vue";
import LastUpdated from "./lastUpdated.vue";

const props = defineProps({
  name: { type: String, default: "闭上眼睛, 听会歌吧" },
  link: { type: String },
  date: { type: String },
});
</script>

<template>
  <div>
    <div class="flex items-center">
      <Receiver />。

      <LastUpdated :date="props.date" />
    </div>

    <Audio :link="props.link"></Audio>
  </div>
</template>
