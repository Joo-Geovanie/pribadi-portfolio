// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'YOSEP GEOVANIE ARITONANG // Full-Stack Developer',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: 'Full-Stack Developer portfolio — Vue 3, Nuxt 3, Next.js, Three.js 3D visuals, TypeScript, and Supabase. Available for new missions.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'author', content: 'Yosep Geovanie Aritonang' },
        { name: 'theme-color', content: '#020514' },
        // Open Graph (WhatsApp, Discord, Facebook share preview)
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'YOSEP GEOVANIE ARITONANG // Full-Stack Developer' },
        { property: 'og:description', content: 'A full-stack dev from Indonesia — navigating the space between clean interfaces, smooth 3D visuals, and reliable backend systems.' },
        { property: 'og:url', content: 'https://geovanie.dev' },
        { property: 'og:site_name', content: 'geovanie.dev' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'YOSEP GEOVANIE ARITONANG // Full-Stack Developer' },
        { name: 'twitter:description', content: 'A full-stack dev from Indonesia — navigating the space between clean interfaces, smooth 3D visuals, and reliable backend systems.' }
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
