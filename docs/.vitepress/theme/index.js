// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'
import Layout from './Layout.vue'
import Audio from '../components/audio.vue'
import Receiver from '../components/receiver.vue'
import Topbar from '../components/topbar.vue'
import Timeline from '../components/timeline.vue'


import './style.css'

export default {
  ...Theme,
  Layout: () => {
    return h(Layout)
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component('Audio', Audio)
    app.component('Receiver', Receiver)
    app.component('Timeline', Timeline)
  }
}
