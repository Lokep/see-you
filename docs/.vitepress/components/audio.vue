<script setup>
import { ref, onMounted, nextTick, reactive, computed } from "vue";
import dayjs from "dayjs";
import * as qs from "qs";

const props = defineProps({
  name: { type: String, default: "闭上眼睛, 听会歌吧" },
  link: { type: String },
});

const audio = ref(null);
const playing = ref(false);
const currentTime = ref(0);
const duration = ref(0);

const toggle = () => {
  if (playing.value) {
    audio.value?.pause();
  } else {
    audio.value?.play();
  }

  playing.value = !playing.value;
};

function progressFormatter(time = 0) {
  if (loading.value) {
    return "";
  }

  if (time) {
    return dayjs(time * 1000).format("mm:ss");
  }

  return "00:00";
}

onMounted(async () => {
  await getSongInfo()
  nextTick(() => {
    if (audio.value) {
      audio.value.oncanplay = () => {
        currentTime.value = audio.value?.currentTime || 0;
        duration.value = audio.value?.duration || 0;
      };

      audio.value.ontimeupdate = () => {
        currentTime.value = audio.value?.currentTime || 0;
        duration.value = audio.value?.duration || 0;
      };
    }
  });
});

const media = reactive({
  name: "",
  cover: "",
  url: "",
  author: "",
});

const loading = computed(() => {
  return !media.name;
});

const progress = computed(() => {
  if (duration.value > 0) {
    return (currentTime.value / duration.value) * 100 + "%";
  }

  return 0;
});

const getSongInfo = () => {
  const { id } = qs.parse(props.link.split('?').at(-1));

  fetch("https://api.vvhan.com/api/music?id=" + id + "&type=song&media=netease")
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        const { name, author, cover, mp3url: url } = res;

        media.name = name;
        media.author = author;
        media.cover = cover;
        media.url = url;
      }
    });
};
</script>

<template>
  <div class="player">
    <audio ref="audio" preload="auto" controls loop :src="media.url"></audio>
    <div class="player-faker">
      <div
        class="player-faker--icon"
        :class="{ loading }"
        v-if="!media.cover"
      ></div>
      <div
        class="iconfont player-faker--icon"
        :class="[playing ? 'icon24gf-pause2' : 'iconicon_play']"
        v-else
        @click="toggle"
        :style="{
          backgroundImage: 'url(' + media.cover + ')',
          backgroundSize: 'cover',
        }"
      ></div>
      <div class="flex-1" style="margin-right: 12px; width: 0">
        <div class="player-faker--name" :class="{ loading }">
          <span v-if="media.name">{{ media.name }} - {{ media.author }}</span>
        </div>
        <div class="flex items-center">
          <div class="player-faker--time" :class="{ loading }">
            {{ progressFormatter(currentTime) }}
          </div>
          <div class="player-faker--progress" :class="{ loading }">
            <div
              class="player-faker--progress__inner"
              :style="{
                width: progress,
              }"
            ></div>
          </div>
          <div class="player-faker--time" :class="{ loading }">
            {{ progressFormatter(duration) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.player {
  margin: 8px 0;

  audio {
    display: none;
  }

  &-faker {
    background-color: var(--audio-bg-color);
    width: 360px;
    height: 72px;
    border-radius: 6px;
    overflow: hidden;
    transition: background-color 0.3s;

    display: flex;
    align-items: center;

    &--icon {
      margin: 12px;
      height: 48px;
      width: 48px;
      border-radius: inherit;
      color: #fff;
      font-size: 28px;
      line-height: 48px;
      text-align: center;

      margin-right: 8px;
      flex-shrink: 0;
    }

    &--name {
      font-family: "PingFang SC";
      font-size: 12px;
      line-height: 20px;
      height: 20px;
      min-width: 120px;
      border-radius: 4px;
      letter-spacing: 0.04em;
      margin-bottom: 4px;

      span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
      }
    }

    &--time {
      height: 14px;
      font-family: "PingFang SC";
      font-size: 10px;
      line-height: 14px;
      width: 40px;
      border-radius: 2px;
    }

    &--progress {
      flex: 1;
      margin: 0 8px;
      height: 4px;
      border-radius: 2px;
      background-color: #fff;
      overflow: hidden;

      &__inner {
        width: 0;
        background-color: #568cd4;
        height: inherit;
        border-radius: 4px;
        transition: width 0.3s;
      }
    }
  }
}
</style>
