import Vue from 'vue'
import VueI18n from 'vue-i18n'
import 'normalize.css'
import './style/basic.styl'
import StartLoading from '@/components/StartLoading.vue'
import { createI18n } from './locales/start'

Vue.config.productionTip = false

Vue.use(VueI18n)

export const i18n = createI18n()

const startApp = async failHandler => {
  const MIN_LOADING_TIME = process.env.VUE_APP_MIN_LOADING_TIME || 800

  if (process.env.VUE_APP_START_LOADING_DEBUG === 'on') {
    // eslint-disable-next-line no-console
    console.warn('VUE_APP_START_LOADING_DEBUG is turn on')
    return
  }

  const startTime = new Date().getTime()
  const module = await import(/* webpackChunkName: "main" */ './main')
  const start = () => !(module.default || module).start(failHandler)
  const loadingTime = new Date().getTime() - startTime
  loadingTime < MIN_LOADING_TIME
    ? setTimeout(start, MIN_LOADING_TIME - loadingTime)
    : start()
}

document.getElementById('app').appendChild(
  new Vue({
    i18n,
    data: { error: null },
    render(h) {
      return h(StartLoading, { props: { error: this.error } })
    },
    async mounted() {
      try {
        await startApp(this)
      } catch (error) {
        this.fail(error)
      }
    },
    methods: {
      fail(error) {
        this.error = error
        // eslint-disable-next-line no-console
        console.error(error)
      }
    }
  }).$mount().$el
)
