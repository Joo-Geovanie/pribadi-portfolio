// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'YOSEP GEOVANIE ARITONANG // Full-Stack Developer',
      meta: [
        { name: 'description', content: 'Full-Stack Developer portfolio of Yosep Geovanie Aritonang featuring Nuxt 3, Vue 3, Three.js 3D visuals, and Supabase.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },
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
