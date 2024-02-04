import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

const isProd = process.env.NODE_ENV === 'production'

export default defineNuxtConfig({
  ssr: false,
  router: {
    options: {
      hashMode: true
    }
  },
  app: {
    baseURL: isProd ? './' : '/'
  },
  css: [
    '@/assets/css/main.css',
    'primevue/resources/themes/aura-light-green/theme.css'
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-electron',
    'nuxt-primevue'
  ],
  piniaPersistedstate: {
    storage: 'localStorage'
  },
  electron: {
    build: [
      {
        entry: 'electron/main.ts'
      },
      {
        entry: 'electron/preload.ts'
      }
    ],
    renderer: {}
  },
  primevue: {
    components: {
      include: ['ContextMenu']
    }
  },
  vite: {
    server: {
      middlewareMode: false
    },
    plugins: [
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false
          })
        ]
      })
    ]
  }
})
