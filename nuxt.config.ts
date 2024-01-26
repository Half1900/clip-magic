export default defineNuxtConfig({
  ssr: false,
  router: {
    options: {
      hashMode: true
    }
  },
  app: {
    baseURL: './'
  },
  css: ['@/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-electron'
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
  vite: {
    server: {
      middlewareMode: false
    }
  }
})
