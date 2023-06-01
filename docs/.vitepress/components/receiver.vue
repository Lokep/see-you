<script setup>
import { reactive, ref, onMounted } from "vue";

const loading = ref(true);
const receiver = reactive({
  name: "",
  avatar: "",
});

const getReceiver = () => {
  fetch("https://api.vvhan.com/api/qq?qq=592536372")
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        receiver.name = res.name;
        receiver.avatar = res.imgurl;

        loading.value = false;
      }
    });
};

onMounted(() => {
  getReceiver();
});
</script>

<template>
  <div class="receiver flex items-center">
    <div class="receiver-nickname" :class="{ loading }">
      {{ loading ? "" : "你好啊，" }}
    </div>
    <div class="receiver-avatar" :class="{ loading }">
      <img
        class="receiver-avatar--img"
        v-if="receiver.avatar"
        :src="receiver.avatar"
        alt=""
      />
    </div>
    <div class="receiver-nickname" :class="{ loading }">
      {{ receiver.name }}
    </div>
  </div>
</template>

<style lang="scss">
.receiver {
  margin: 8px 0;
  &-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 6px;
    overflow: hidden;

    &--img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  &-nickname {
    font-size: 14px;
    font-weight: 500;
    min-width: 60px;
    height: 24px;
    border-radius: 4px;
    margin-right: 4px;
  }

  &-avatar,
  &-nickname {
    transition: background-image 0.3s;
  }
}
</style>
