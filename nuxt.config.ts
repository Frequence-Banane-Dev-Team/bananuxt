// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode', 'shadcn-nuxt', '@pinia/nuxt'],
  app: {
    baseURL: process.env.BASE_URL || ''
  },
  ssr: true,
  runtimeConfig: {
    public: {
      STRAPI_URL: process.env.NUXT_STRAPI_URL || '',
      BASE_URL: process.env.BASE_URL || ''
    }
  },
  colorMode: {
    classSuffix: ''
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  }
})