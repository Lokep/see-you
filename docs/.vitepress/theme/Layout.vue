<script setup>
import DefaultTheme from "vitepress/theme";
import { reactive, onMounted, ref } from "vue";
import { icons } from "vitepress/dist/client/theme-default/support/socialIcons.js";
import VPIconSun from "vitepress/dist/client/theme-default/components/icons/VPIconSun.vue";
import VPIconMoon from "vitepress/dist/client/theme-default/components/icons/VPIconMoon.vue";
import { usePreferredDark } from "@vueuse/core";
import Weather from "../components/weather.vue";

const { Layout } = DefaultTheme;

const github = "https://github.com/Lokep/see-you";

const top = reactive({
  viewurl: "",
  width: "",
  height: "",
});

const isDark = usePreferredDark();

const toggleDarkMode = () => {
  isDark.value = !isDark.value;

  if (isDark.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

const loading = ref(true);

const getPic = () => {
  loading.value = true;
  top.viewurl = "";
  fetch("https://api.vvhan.com/api/view?type=json")
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        top.viewurl = res.imgurl;
      }
    });
};

onMounted(() => {
  getPic();
});

</script>

<template>
  <Layout>
    <template #doc-top>
      <div class="top-bg" :class="{ loading }" @click="getPic">
        <img
          v-if="top.viewurl"
          :src="top.viewurl"
          alt=""
          @load="loading = false"
        />

        <Weather />
      </div>
    </template>

    <template #nav-bar-content-after>
      <div class="CustomSocialLink iconfont iconemail"></div>

      <div class="CustomSocialLink iconfont iconlink"></div>

      <a
        class="CustomSocialLink"
        :href="github"
        aria-label="string"
        target="_blank"
        rel="noopener"
        v-html="icons.github"
      >
      </a>

      <div class="CustomSocialLink" @click="toggleDarkMode">
        <VPIconSun v-if="isDark" />
        <VPIconMoon v-else />
      </div>
    </template>
  </Layout>
</template>

<style lang="scss">
.top-bg {
  width: 100%;
  height: 120px;
  overflow: hidden;
  position: relative;
  border-radius: 6px;
  margin-bottom: 36px;
  // background-color: #eee;
  cursor: pointer;

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}
.CustomSocialLink {
  height: 34px;
  width: 34px;
  border: 1px solid;
  border-color: #eeee;
  color: #eeee;
  border-radius: 10px;
  margin-left: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: color, border-color 0.3s;

  &.iconfont {
    font-weight: bolder;
    text-align: center;
    line-height: 34px;
  }

  &.iconemail {
    font-size: 22px;
  }

  &.iconlink {
    font-size: 20px;
  }

  svg {
    width: 20px;
    height: 20px;
    margin: 6px auto;
    fill: #e1e1e1;

    transition: fill 0.3s;
  }

  @media (any-hover: hover) {
    &:hover {
      color: var(--vp-c-brand-light);
      border-color: var(--vp-c-brand-light);

      svg {
        fill: var(--vp-c-brand-light);
      }
    }
  }
}
</style>
