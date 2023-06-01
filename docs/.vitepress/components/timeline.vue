<script setup>
import { ref, toRefs, watch, onMounted, unref, toRaw, nextTick } from "vue";
import { useData } from "vitepress";
const { theme } = useData();
const { sidebar } = toRefs(theme.value);

const records = ref([]);

const getContent = (link) => {
  return fetch(link + ".md")
    .then((res) => res.body)
    .then((rb) => {
      const reader = rb.getReader();
      return new ReadableStream({
        start(controller) {
          function push() {
            reader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              push();
            });
          }
          push();
        },
      });
    })
    .then((stream) =>
      new Response(stream, {
        headers: { "Content-Type": "text/html" },
      }).text()
    )
    .then((result) => {
      return result
        .replace(/<("[^"]*"|'[^']*'|[^'">])*>|#/g, "")
        .replace(/\n{1,}/, "\n")
        .trim()
        .slice(0, 100);
    });
};

watch(
  () => sidebar,
  async (v) => {
    if (!sidebar.value.length) {
      records.value = [];
    } else {
      records.value = sidebar.value
        .reduce((list, item) => {
          if (item.items && item.items.length > 0) {
            return [
              ...list,
              ...item.items.map((el) => {
                return {
                  node: el.text,
                  link: el.link,
                  content: "",
                };
              }),
            ];
          } else {
            return list;
          }
        }, [])
        .reverse();

      // const list = toRaw(unref(records));
      // for (let i = 0; i < list.length; i++) {
      //   list[i].content = await getContent(list[i].link);
      // }

      // nextTick(() => {
      //   records.value = list;
      // });
    }
  },
  {
    immediate: true,
  }
);

onMounted(() => {});
</script>

<template>
  <div class="timeline">
    <div class="timeline-title">更新</div>

    <div style="display:none">{{ records }}</div>

    <div class="timeline-item" v-for="(item, index) in records" :key="index">
      <div class="timeline-item--node">
        <div class="point"></div>
        <div class="node">{{ item.node }} 12:26</div>
      </div>

      <div class="timeline-item--content">
        {{ item.content }}
      </div>
    </div>

    <div class="timeline-end">若思念有声，则振聋发聩</div>
  </div>
</template>

<style lang="scss">
.timeline {
  max-width: 688px;
  margin: 0 auto 20px;

  &-title {
    margin-bottom: 20px;
    margin-top: 96px;
    color: var(--vp-c-text-1);
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
  }

  &-item {
    &--node {
      font-size: 14px;
      color: var(--vp-c-text-1);
      line-height: 22px;
      padding-right: 30px;

      .point {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--vp-c-text-3);
        margin-left: 4px;
        margin-bottom: 2px;
        display: inline-block;
        margin-right: 8px;
      }
      .node {
        display: inline-block;
        color: var(--vp-c-text-2);
        padding-left: 6px;
        font-size: 14px;
        line-height: 22px;
      }
    }
    &--content {
      position: relative;
      padding: 4px 0 12px 18px;
      border-left: 1px dashed rgba(190, 192, 191, 0.3);
      margin: 8px 0 8px 6px;
    }
  }

  &-end {
    display: flex;
    align-items: center;
    justify-content: center;

    color: var(--vp-c-text-2);
    font-size: 14px;
    line-height: 22px;

    &::before,
    &::after {
      content: "";
      height: 0.5px;
      background-color: rgba(190, 192, 191, 0.3);
      width: 120px;
      margin: 0 12px;
    }
  }
}
</style>
