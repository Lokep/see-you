import { defineConfig } from "vitepress";

const fs = require('fs');
const path = require('path');

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "in 129,600 years",
  description: "in 129,600 years",
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "../images/ico.svg",
      },
    ],
    [
      "link",
      { rel: "preconnect", href: "https://lokep.github.io", crossorigin: "" },
    ],
  ],
  themeConfig: {
    logo:'/images/logo.svg.png',

    sidebar: [
      {
        text: "Letters",
        items: [
          { text: "2018年02月18日", link: "/letters/20180218" },
          { text: "2023年05月29日", link: "/letters/20230529" },
        ],
      },
    ],

    appearance: false,
  },
  markdown: {
    config: (md) => {
      md.use(require("./plugins/md-checkbox"));
    },
  },

  buildEnd:(siteConfig) => {
    console.log(siteConfig)

    copyAndMoveDir(path.resolve(__dirname, '../images'), path.resolve(siteConfig.outDir, './images'))
  }
});



function copyAndMoveDir(srcDir, destDir) {

  fs.mkdirSync(destDir, { recursive: true });

  // 读取源目录中的所有文件和子目录
  const items = fs.readdirSync(srcDir);

  // 针对每个文件和子目录进行操作
  items.forEach(item => {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);

    // 如果当前项是一个子目录，则递归调用自身
    if (fs.statSync(srcPath).isDirectory()) {
      copyAndMoveDir(srcPath, destPath);
    } else {
      // 否则，使用copyFileSync函数将其复制到目标目录中
      fs.copyFileSync(srcPath, destPath);
    }
  });
}