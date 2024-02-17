// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxtjs/tailwindcss', '@nuxtjs/color-mode', 'shadcn-nuxt', '@pinia/nuxt', 'nuxt-icon', '@nuxtjs/google-fonts', '@nuxtjs/strapi'],
  app: {
    baseURL: process.env.BASE_URL || ''
  },
  nitro: {
    prerender: {
      crawlLinks: true,
    },
    compressPublicAssets: true,
  },
  strapi: {
    url: process.env.NUXT_STRAPI_URL || ''
  },
  content: {
    markdown: {
      anchorLinks: false,
    }
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
  googleFonts: {
    families: {
      Inter: [100, 200, 300, 400, 500, 600, 700, 800, 900]
    }
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