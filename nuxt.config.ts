// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@tresjs/nuxt'
  ],
  supabase: {
    redirect: false // We will handle redirects manually in middleware
  },
  css: [
    '~/assets/css/main.css'
  ]
})
