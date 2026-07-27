<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTelemetry } from '~/composables/useTelemetry'
import { useSupabaseClient } from '#imports'

gsap.registerPlugin(ScrollTrigger)

const { updateScroll } = useTelemetry()
const supabase = useSupabaseClient()

// ====== DATA STATES (GEN-Z / CASUAL / HUMBLE & COOL COPYWRITING) ======
const companyProfile = ref({
  name: 'YOSEP GEOVANIE ARITONANG',
  hero_title: 'FULL-STACK DEVELOPER',
  hero_subtitle: 'A full-stack dev from Indonesia — navigating the space between clean interfaces, smooth 3D visuals, and reliable backend systems.',
  about_text: 'Building web applications with Vue 3, Nuxt 3, Next.js, TypeScript, Python, and modern cloud databases.'
})

// Official Brand SVGs (CRISP & ACCURATE, NO EMOJIS!)
const skillCategories = ref([
  {
    title: 'WEB FRAMEWORKS',
    count: '06',
    skills: [
      { name: 'Vue.js', svg: `<svg class="w-4 h-4 text-[#42b883]" viewBox="0 0 24 24" fill="currentColor"><path d="M2 3h3.5L12 15 20.5 3H24L12 22 2 3z"/></svg>` },
      { name: 'Nuxt.js', svg: `<svg class="w-4 h-4 text-[#00dc82]" viewBox="0 0 24 24" fill="currentColor"><path d="M7.7 20.5H.5L11 2.3l4.8 8.3-2.6 4.5-2.2-3.8-3.3 5.7L12 20.5zM13.5 20.5l4.8-8.3 5.2 8.3h-10z"/></svg>` },
      { name: 'React.js', svg: `<svg class="w-4 h-4 text-[#61dafb]" viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" stroke-width="1.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" stroke-width="1.5" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="1.8"/></svg>` },
      { name: 'Next.js', svg: `<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S17.63 0 12 0zm4.52 17.66l-5.91-8.31V16.8H9.13V7.2h1.47l5.96 8.35V7.2h1.48v10.46h-1.52z"/></svg>` },
      { name: 'Astro', svg: `<svg class="w-4 h-4 text-[#ff5d01]" viewBox="0 0 24 24" fill="currentColor"><path d="M8.358 20.162c-.186.44-.012.955.394 1.185.405.23.93.078 1.157-.333l1.83-3.262h2.522l1.83 3.262c.227.411.752.563 1.157.333.406-.23.58-.745.394-1.185l-4.103-9.743H12.46l-4.102 9.743zm4.542-4.137h-1.8l.9-1.6 2.05-3.642.95 2.257-2.1 2.985zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S17.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>` },
      { name: 'Tailwind CSS', svg: `<svg class="w-4 h-4 text-[#38bdf8]" viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19.2 12.001 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"/></svg>` }
    ]
  },
  {
    title: 'LANGUAGES',
    count: '04',
    skills: [
      { name: 'TypeScript', svg: `<svg class="w-4 h-4 text-[#3178c6]" viewBox="0 0 24 24" fill="currentColor"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.74-.241 4.896 4.896 0 0 0-.776-.12 4.225 4.225 0 0 0-.75 0c-.397 0-.728.084-.99.251a.846.846 0 0 0-.395.736c0 .248.08.455.24.62.16.166.386.309.678.428.291.12.63.23 1.016.331.385.101.787.214 1.205.339.418.125.823.279 1.215.461.392.182.729.421 1.01.717.28.297.493.66.638 1.091.144.43.216.945.216 1.543 0 .762-.128 1.428-.383 1.999a3.864 3.864 0 0 1-1.077 1.45 4.966 4.966 0 0 1-1.688.922c-.672.213-1.427.32-2.264.32-.733 0-1.42-.058-2.062-.174a7.994 7.994 0 0 1-1.785-.503v-2.58a5.216 5.216 0 0 0 1.83.673c.66.136 1.298.204 1.914.204.464 0 .848-.094 1.152-.283.303-.189.455-.487.455-.894 0-.256-.076-.467-.228-.633-.152-.166-.367-.309-.646-.428a9.42 9.42 0 0 0-.962-.33 13.9 13.9 0 0 1-1.183-.34 5.342 5.342 0 0 1-1.226-.46 2.7 2.7 0 0 1-1.004-.73c-.273-.306-.48-.68-.621-1.121-.141-.442-.211-.97-.211-1.585 0-.712.128-1.344.383-1.896.256-.552.616-1.01 1.08-1.374a4.873 4.873 0 0 1 1.67-.841c.662-.196 1.401-.294 2.217-.294zm-8.835.219v2.247h-2.9v10.364H4.075V12.216H1.175V9.969h7.478z"/></svg>` },
      { name: 'PHP', svg: `<svg class="w-4 h-4 text-[#777bb4]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S17.627 0 12 0zm-5.75 6.75h3.5a2.75 2.75 0 1 1 0 5.5H8v3H6.25v-8.5zm1.75 1.5v2.5h1.75a1.25 1.25 0 1 0 0-2.5H8zm5 0h1.75v3H16.5v-3H18v8.5h-1.5v-4H14.75v4H13v-8.5zm5.75 0h3.5a2.75 2.75 0 1 1 0 5.5H20.25v3H18.75v-8.5zm1.75 1.5v2.5h1.75a1.25 1.25 0 1 0 0-2.5H20.5z"/></svg>` },
      { name: 'Python', svg: `<svg class="w-4 h-4 text-[#3776ab]" viewBox="0 0 24 24" fill="currentColor"><path d="M11.87 2c-3.1 0-2.9 1.34-2.9 1.34V5.7h5.9v.84H6.48S3.5 6.22 3.5 9.35c0 3.12 2.6 3.02 2.6 3.02h1.56v-2.18s-.08-2.6 2.55-2.6h4.38s2.46.04 2.46-2.42V4.46S17.43 2 11.87 2zm-1.63 1.08a.74.74 0 1 1 0 1.48.74.74 0 0 1 0-1.48zm1.89 18.92c3.1 0 2.9-1.34 2.9-1.34v-2.36h-5.9v-.84h8.39s2.98.32 2.98-2.81c0-3.12-2.6-3.02-2.6-3.02h-1.56v2.18s.08 2.6-2.55 2.6h-4.38s-2.46-.04-2.46 2.42v3.71s-.38 2.46 5.18 2.46zm1.63-1.08a.74.74 0 1 1 0-1.48.74.74 0 0 1 0 1.48z"/></svg>` },
      { name: 'JavaScript', svg: `<svg class="w-4 h-4 text-[#f7df1e]" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0v24h24V0H0zm11.5 16.5c0 2.3-1.4 3.5-3.5 3.5-2 0-3.3-1.1-3.8-2.2l1.6-1c.3.6 1 1.2 2.1 1.2 1.2 0 1.9-.6 1.9-1.7V8.5h1.7v8zm7.3-.4c0 2.5-1.7 3.9-4.2 3.9-2.3 0-3.8-1.3-4.2-2.6l1.6-1c.4.9 1.2 1.6 2.6 1.6 1.2 0 2.2-.6 2.2-1.7 0-1.1-.6-1.5-2.2-2.1l-.8-.3c-2.3-.9-3.4-2.1-3.4-4 0-2.3 1.8-3.7 4-3.7 2 0 3.3.9 3.9 2l-1.5 1c-.4-.7-1-1.1-2.3-1.1-1.2 0-2.1.6-2.1 1.6 0 .9.6 1.4 2.1 1.9l.8.3c2.5 1 3.5 2 3.5 4.2z"/></svg>` }
    ]
  },
  {
    title: 'BACKEND & DATA',
    count: '05',
    skills: [
      { name: 'Node · Express', svg: `<svg class="w-4 h-4 text-[#539e43]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.85L2.1 7.57v11.43L12 24.71l9.9-5.71V7.57L12 1.85zm.5 2.16l7.4 4.27v4.4l-7.4-4.27V4.01zM11 4.01v4.4L3.6 12.68v-4.4L11 4.01zm-7.4 9.97l7.4 4.27v4.39L3.6 18.37v-4.39zm8.9 8.66v-4.39l7.4-4.27v4.39l-7.4 4.27z"/></svg>` },
      { name: 'PostgreSQL', svg: `<svg class="w-4 h-4 text-[#4169e1]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>` },
      { name: 'MySQL', svg: `<svg class="w-4 h-4 text-[#4479a1]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9zm0 16c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7z"/></svg>` },
      { name: 'Prisma', svg: `<svg class="w-4 h-4 text-[#2d3748]" viewBox="0 0 24 24" fill="currentColor"><path d="M18.4 18.2L12.5 3.5c-.2-.4-.7-.6-1.1-.4-.2.1-.3.2-.4.4L3.6 18.2c-.2.5.1 1.1.6 1.2.1 0 .3 0 .4 0h13.2c.5 0 1-.4 1-.9 0-.1 0-.2-.2-.3z"/></svg>` },
      { name: 'Supabase', svg: `<svg class="w-4 h-4 text-[#3ecf8e]" viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 2L3 13.5h7L9 22l12-12.5h-7.5L15 2z"/></svg>` }
    ]
  },
  {
    title: 'MOTION & 3D',
    count: '03',
    skills: [
      { name: 'GSAP', svg: `<svg class="w-4 h-4 text-[#88ce02]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 19h20L12 2zm0 4l6.5 11h-13L12 6z"/></svg>` },
      { name: 'Three.js · Tres.js', svg: `<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9L2 6v11l10 5 10-5V6l-10 5z"/></svg>` }
    ]
  },
  {
    title: 'TOOLS & DEPLOY',
    count: '06',
    skills: [
      { name: 'Figma', svg: `<svg class="w-4 h-4 text-[#f24e1e]" viewBox="0 0 24 24" fill="currentColor"><path d="M8 2h4a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4zm0 8h4a4 4 0 1 1 0 8H8a4 4 0 0 1-4-4v-4zm0 8a4 4 0 1 0 4 4v-4H8z"/></svg>` },
      { name: 'Postman', svg: `<svg class="w-4 h-4 text-[#ff6c37]" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 12l3 3 5-5"/></svg>` },
      { name: 'Docker', svg: `<svg class="w-4 h-4 text-[#2496ed]" viewBox="0 0 24 24" fill="currentColor"><path d="M13.98 11.07h2.12v2.12h-2.12zm-3.18 0h2.12v2.12h-2.12zm-3.18 0h2.12v2.12H7.62zm-3.18 0h2.12v2.12H4.44zm6.36-3.18h2.12v2.12h-2.12zm-3.18 0h2.12v2.12H7.62zm-3.18 0h2.12v2.12H4.44zm6.36-3.18h2.12v2.12h-2.12zM23.97 13.5c-.22-.38-1.16-.76-2.58-.76-.32 0-.67.02-1.02.08-.41-1.3-1.63-2.17-3.03-2.17H16.1v-2.12h-2.12v2.12h-1.06V8.53H10.8V6.41H8.68v2.12H7.62V6.41H5.5v2.12H1.27v5.3c0 2.92 2.37 5.3 5.3 5.3h10.9c2.92 0 5.3-2.38 5.3-5.3 0-.08 0-.16-.01-.23z"/></svg>` },
      { name: 'Cloudflare', svg: `<svg class="w-4 h-4 text-[#f38020]" viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>` },
      { name: 'Vercel', svg: `<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L24 22H0L12 1z"/></svg>` },
      { name: 'Railway', svg: `<svg class="w-4 h-4 text-[#0b0d0e]" viewBox="0 0 24 24" fill="currentColor"><path d="M2 4h20v16H2V4zm2 2v12h16V6H4z"/></svg>` }
    ]
  }
])

const services = ref<any[]>([
  { title: 'Full-Stack Web Architecture', description: 'Building scalable web applications using Vue/Nuxt 3, Next.js, and TypeScript with clean code design.' },
  { title: '3D WebGL Graphics & Motion', description: 'Creating interactive 3D WebGL scenes, particles, and smooth GSAP scroll interactions.' },
  { title: 'Cloud Backend & Data Pipelines', description: 'Architecting secure PostgreSQL databases, Supabase RLS security, and real-time APIs.' }
])

const projects = ref<any[]>([])

const cName = ref('')
const cEmail = ref('')
const cMessage = ref('')
const sendStatus = ref('')

const formatDesc = (text: string) => {
  if (!text) return ''
  return text.replace(/\*\*/g, '')
}

const fetchContent = async () => {
  try {
    const { data: profile } = await supabase.from('company_profile').select('*').limit(1).maybeSingle()
    if (profile) companyProfile.value = profile

    const { data: srvs } = await supabase.from('services').select('*').order('sort_order', { ascending: true })
    if (srvs && srvs.length > 0) services.value = srvs

    const { data: projs } = await supabase.from('projects').select('*').order('sort_order', { ascending: true })
    if (projs) projects.value = projs
  } catch (err) {
    console.error('Supabase fetch error:', err)
  }
}

const sendPing = async () => {
  if (!cName.value || !cEmail.value || !cMessage.value) {
    sendStatus.value = 'ERR // INCOMPLETE TRANSMISSION HEADER'
    return
  }
  sendStatus.value = 'TRANSMITTING...'
  try {
    const { error } = await supabase.from('messages').insert([
      { name: cName.value, email: cEmail.value, message: cMessage.value }
    ])
    if (error) throw error
    sendStatus.value = 'TRANSMISSION RECEIVED // NOMINAL'
    cName.value = ''
    cEmail.value = ''
    cMessage.value = ''
    setTimeout(() => { sendStatus.value = '' }, 5000)
  } catch (err: any) {
    sendStatus.value = `ERR // ${err.message || 'TRANSMISSION FAILED'}`
  }
}

onMounted(async () => {
  await fetchContent()
  await nextTick()

  // GSAP ScrollTrigger Background Gradient Interpolation
  ScrollTrigger.create({
    trigger: document.documentElement,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.3,
    onUpdate: (self) => {
      updateScroll(self.progress)

      let color = '#020514'
      if (self.progress < 0.25) {
        color = gsap.utils.interpolate('#071a26', '#091526', self.progress / 0.25) as string
      } else if (self.progress < 0.6) {
        color = gsap.utils.interpolate('#091526', '#020514', (self.progress - 0.25) / 0.35) as string
      } else {
        color = '#020514'
      }
      document.body.style.backgroundColor = color
    }
  })

  // Premium Section Reveal & Re-entry Animations (Triggers on scroll down AND scroll back up!)
  gsap.utils.toArray('.reveal-section').forEach((el: any) => {
    gsap.fromTo(el,
      { opacity: 0, y: 60, scale: 0.98 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play reverse play reverse'
        }
      }
    )
  })

  // Stagger reveal for skill badge items on scroll
  gsap.utils.toArray('.skill-category-block').forEach((block: any) => {
    const badges = block.querySelectorAll('.skill-badge-item')
    if (badges.length > 0) {
      gsap.fromTo(badges,
        { opacity: 0, y: 25, scale: 0.92 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.4)', stagger: 0.05,
          scrollTrigger: {
            trigger: block,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      )
    }
  })

  // Stagger reveal for project cards on scroll
  gsap.utils.toArray('.project-card-item').forEach((card: any, idx) => {
    gsap.fromTo(card,
      { opacity: 0, y: 50, scale: 0.96 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.8, delay: idx * 0.15, ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play reverse play reverse'
        }
      }
    )
  })
})
</script>

<template>
  <div class="relative text-white min-h-[100dvh] scanlines overflow-x-hidden">

    <!-- ULTRA MASSIVE FULL-SCREEN VIEWPORT STROKE WATERMARK (FULL-STACK DEVELOPER) -->
    <div class="fixed inset-0 w-screen h-screen flex flex-col justify-center items-center pointer-events-none opacity-40 select-none z-0 overflow-hidden">
      <div class="text-[16vw] lg:text-[17vw] font-black leading-[0.78] tracking-tighter stroke-text uppercase whitespace-nowrap">
        FULL-STACK
      </div>
      <div class="text-[16vw] lg:text-[17vw] font-black leading-[0.78] tracking-tighter stroke-text uppercase whitespace-nowrap">
        DEVELOPER
      </div>
    </div>

    <!-- Cyber Grid Pattern in Background (Z-Index 0) -->
    <div class="fixed inset-0 pointer-events-none z-0 opacity-[0.08] bg-[linear-gradient(to_right,#00f0ff20_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff20_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

    <!-- Terminal Boot Sequence Overlay -->
    <ClientOnly>
      <BootSequence />
    </ClientOnly>

    <!-- 3D Submarine Background Scene (Z-Index 10) -->
    <ClientOnly>
      <OceanScene />
    </ClientOnly>

    <!-- Fullscreen Telemetry HUD UI Frame (Z-Index 30) -->
    <TelemetryHUD />

    <!-- Custom Sonar Crosshair Cursor (Desktop Only) -->
    <ClientOnly>
      <CustomCursor />
    </ClientOnly>

    <!-- ====== MAIN CONTENT (Z-Index 20) ====== -->
    <main class="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 md:px-16 pt-16 sm:pt-20">

      <!-- ==================== SECTION 1: HERO (ABOUT) ==================== -->
      <section class="min-h-[100dvh] flex flex-col justify-center relative py-12 reveal-section" id="about">

        <div class="relative z-10 max-w-2xl">
          <!-- Mission badge -->
          <div class="inline-flex items-center gap-2 text-[9px] sm:text-[10px] text-sonar-orange tracking-[0.3em] font-bold mb-4 bg-abyss-950/80 border border-sonar-orange/30 px-3 py-1 rounded font-mono">
            <span class="w-1.5 h-1.5 bg-sonar-orange transform rotate-45"></span>
            <span>◆ HELLO THERE // WELCOME</span>
          </div>

          <!-- Hero Name Heading with Dynamic Scroll Re-scramble -->
          <h1 class="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6 text-white uppercase break-words">
            <TextScramble :text="companyProfile.name" :duration="1.0" :scrambleOnScroll="true" />
          </h1>

          <!-- Real Gen-Z / Chill & Cool Bio -->
          <p class="text-gray-200 text-xs sm:text-base leading-relaxed mb-8 font-mono bg-abyss-950/85 backdrop-blur-md p-4 sm:p-5 rounded-lg border border-sonar-blue/30 shadow-2xl text-justify">
            <TextScramble :text="companyProfile.hero_subtitle" :delay="400" :duration="1.8" :scrambleOnScroll="true" />
          </p>

          <!-- Magnetic Hover Buttons -->
          <div class="flex flex-wrap gap-3 sm:gap-4 mb-10 pointer-events-auto font-mono">
            <MagneticButton tag="a" :strength="0.3">
              <a href="#contact" class="bg-sonar-orange hover:bg-sonar-orange/80 text-black font-bold px-5 sm:px-7 py-3 sm:py-3.5 text-xs uppercase tracking-[0.2em] rounded transition-all shadow-lg flex items-center gap-2">
                <span>[+]</span>
                <span>GET IN TOUCH</span>
              </a>
            </MagneticButton>
            <MagneticButton tag="a" :strength="0.3">
              <a href="#works" class="border border-sonar-blue/40 text-sonar-blue hover:bg-sonar-blue/15 font-bold px-5 sm:px-7 py-3 sm:py-3.5 text-xs uppercase tracking-[0.2em] rounded transition-all backdrop-blur-md flex items-center gap-2">
                <span>[>]</span>
                <span>SEE MY WORKS</span>
              </a>
            </MagneticButton>
          </div>
        </div>

      </section>

      <!-- MASSIVE FULL-BLEED RUNNING MARQUEE TEXT -->
      <div class="w-screen -ml-[calc((100vw-100%)/2)] overflow-hidden py-4 sm:py-6 border-y-2 border-sonar-blue/30 my-8 bg-abyss-950/90 backdrop-blur-md shadow-2xl">
        <div class="flex gap-8 sm:gap-12 animate-marquee whitespace-nowrap text-2xl sm:text-4xl md:text-5xl font-black tracking-[0.2em] text-white">
          <span v-for="n in 6" :key="n" class="flex items-center gap-8 sm:gap-12">
            <span class="gradient-text">FULL-STACK DEVELOPER</span>
            <span class="text-sonar-orange">//</span>
            <span>NUXT 3 & NEXT.JS</span>
            <span class="text-sonar-green">//</span>
            <span class="text-sonar-blue">THREE.JS 3D GRAPHICS</span>
            <span class="text-sonar-orange">//</span>
            <span>TYPESCRIPT & PYTHON</span>
            <span class="text-sonar-blue">//</span>
          </span>
        </div>
      </div>

      <!-- ==================== SECTION 2: SKILLS ==================== -->
      <section class="py-16 sm:py-24 reveal-section min-h-[100dvh] flex flex-col justify-center" id="techstack">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 sm:mb-12">
          <div>
            <div class="text-[10px] text-sonar-blue tracking-[0.3em] font-bold mb-2 flex items-center gap-2 font-mono">
              <span class="text-sonar-blue">02 / 04</span>
              <span class="uppercase">Tech Stack</span>
            </div>
            <h2 class="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight">
              <TextScramble text="SKILLS" :duration="0.8" :scrambleOnScroll="true" />
            </h2>
            <p class="text-gray-300 text-xs sm:text-sm mt-2 sm:mt-3 max-w-md font-mono">
              The tools and tech stack I use to build cool stuff and keep things running smoothly.
            </p>
          </div>

          <a href="#contact" class="mt-4 sm:mt-0 inline-flex items-center gap-2 border border-sonar-blue/30 px-4 py-2 rounded text-[10px] font-bold text-gray-300 hover:text-sonar-blue hover:border-sonar-blue/60 transition pointer-events-auto bg-abyss-950/60 backdrop-blur-md font-mono w-fit">
            <span>// HAVE A CUSTOM STACK? LET'S TALK</span>
          </a>
        </div>

        <!-- Categorized Skill Groups -->
        <div class="space-y-8 sm:space-y-10">
          <div
            v-for="cat in skillCategories"
            :key="cat.title"
            class="border-b border-sonar-blue/20 pb-6 sm:pb-8 skill-category-block"
          >
            <div class="flex justify-between items-center text-[10px] sm:text-[11px] text-gray-400 font-bold tracking-widest uppercase mb-4 font-mono">
              <span>{{ cat.title }}</span>
              <span class="text-sonar-blue">{{ cat.count }}</span>
            </div>

            <!-- Spacious Skill Badges Grid with Stagger Entrance Animation -->
            <div class="flex flex-wrap gap-3 sm:gap-4 pointer-events-auto">
              <div
                v-for="skill in cat.skills"
                :key="skill.name"
                class="skill-badge-item flex items-center gap-3 sm:gap-3.5 bg-abyss-950/90 border border-sonar-blue/30 hover:border-sonar-blue/70 hover:bg-sonar-blue/15 px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg text-xs sm:text-sm font-mono text-gray-100 transition-all cursor-default shadow-lg group hover:scale-105"
              >
                <span class="flex items-center justify-center group-hover:scale-110 transition-transform" v-html="skill.svg"></span>
                <span class="font-bold tracking-wider text-white">{{ skill.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================== SECTION 3: SERVICES ==================== -->
      <section class="py-16 sm:py-24 reveal-section min-h-[100dvh] flex flex-col justify-center" id="services">
        <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          <div class="flex-1">
            <div class="text-[10px] text-sonar-green tracking-[0.3em] font-bold mb-3 flex items-center gap-2 font-mono">
              <span class="w-2 h-2 bg-sonar-green rounded-full"></span>
              03 / WHAT I DO
            </div>
            <h2 class="text-3xl sm:text-5xl font-black mb-4">
              <TextScramble text="SERVICES" :duration="0.8" :scrambleOnScroll="true" />
            </h2>
            <p class="text-gray-300 text-xs sm:text-sm mb-8 font-mono max-w-lg">
              What I can help you build — from interactive web apps to 3D visualizers and backend APIs.
            </p>

            <div class="flex flex-col gap-4">
              <div
                v-for="(service, idx) in services"
                :key="service.title"
                class="card-glow border border-sonar-green/20 bg-abyss-950/80 backdrop-blur-md p-5 sm:p-6 rounded-lg hover:border-sonar-green/60 transition-all pointer-events-auto shadow-xl hover:-translate-y-1"
              >
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-sonar-green font-mono font-bold text-xs bg-sonar-green/10 border border-sonar-green/30 px-2 py-0.5 rounded">0{{ idx + 1 }}</span>
                  <div class="text-white font-bold text-sm sm:text-base">{{ service.title }}</div>
                </div>
                <div class="text-xs text-gray-300 leading-relaxed pl-8 sm:pl-10 font-mono text-justify">{{ service.description }}</div>
              </div>
            </div>
          </div>

          <div class="flex-shrink-0 flex items-center justify-center p-4 sm:p-6 bg-abyss-950/70 rounded-full border border-sonar-green/30 backdrop-blur-md shadow-2xl">
            <SonarSweep />
          </div>
        </div>
      </section>

      <!-- ==================== SECTION 4: WORKS ==================== -->
      <section class="py-16 sm:py-24 reveal-section min-h-[100dvh] flex flex-col justify-center" id="works">
        <div class="text-[10px] text-sonar-orange tracking-[0.3em] font-bold mb-3 flex items-center gap-2 font-mono">
          <span class="w-2 h-2 bg-sonar-orange rounded-full"></span>
          04 / MY WORKS
        </div>
        <h2 class="text-3xl sm:text-5xl font-black mb-3">
          <TextScramble text="FEATURED PROJECTS" :duration="1.0" :scrambleOnScroll="true" />
        </h2>
        <p class="text-gray-300 text-xs sm:text-sm mb-8 sm:mb-10 font-mono">Selected web applications and projects I have worked on.</p>

        <!-- Empty state -->
        <div v-if="projects.length === 0" class="text-center py-16 sm:py-20 border border-dashed border-sonar-blue/30 rounded-lg bg-abyss-950/70 backdrop-blur-md">
          <div class="text-base font-bold text-sonar-blue mb-1 font-mono">NO PROJECTS PUBLISHED YET</div>
          <div class="text-[11px] text-gray-400 font-mono">Use your Supabase Admin CMS (`/admin`) to register portfolio projects.</div>
        </div>

        <!-- Project grid with Stagger Entrance and Lazy Loading Image -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TiltCard
            v-for="project in projects"
            :key="project.id"
          >
            <div
              class="project-card-item card-glow border border-sonar-blue/20 bg-abyss-950/80 backdrop-blur-md rounded-lg overflow-hidden hover:border-sonar-blue/60 transition-all group pointer-events-auto shadow-2xl flex flex-col hover:-translate-y-1.5"
            >
              <div v-if="project.image_url" class="w-full h-48 sm:h-56 overflow-hidden bg-black/60 relative border-b border-sonar-blue/20">
                <img
                  :src="project.image_url"
                  :alt="project.title"
                  loading="lazy"
                  class="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                />
              </div>

              <div class="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div class="text-[9px] text-sonar-blue font-bold tracking-wider mb-2 font-mono flex flex-wrap items-center gap-1.5">
                    <span>PROJECT</span>
                    <span>//</span>
                    <span>{{ project.year }}</span>
                    <span>//</span>
                    <span>{{ project.category?.toUpperCase() }}</span>
                    <template v-if="project.location">
                      <span class="text-sonar-orange">//</span>
                      <span class="text-sonar-orange uppercase font-bold px-1.5 py-0.5 bg-sonar-orange/10 border border-sonar-orange/30 rounded">{{ project.location }}</span>
                    </template>
                  </div>
                  <div class="text-lg sm:text-xl font-bold mb-3 text-white">{{ project.title }}</div>
                  
                  <!-- Justified clean project description -->
                  <p class="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6 font-mono text-justify">
                    {{ formatDesc(project.description) }}
                  </p>
                </div>

                <a
                  v-if="project.link"
                  :href="project.link"
                  target="_blank"
                  class="inline-flex items-center gap-1.5 text-[10px] text-sonar-blue hover:underline font-bold tracking-wider pointer-events-auto font-mono mt-auto"
                >
                  VIEW LIVE PROJECT ↗
                </a>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      <!-- ==================== SECTION 5: CONTACT ==================== -->
      <section class="py-16 sm:py-24 reveal-section min-h-[100dvh] flex flex-col justify-between" id="contact">
        <div>
          <div class="text-[10px] text-sonar-blue tracking-[0.3em] font-bold mb-3 flex items-center gap-2 font-mono">
            <span class="w-2 h-2 bg-sonar-blue rounded-full"></span>
            05 / CONTACT & CHANNELS
          </div>
          <h2 class="text-3xl sm:text-5xl font-black mb-3">
            <TextScramble text="GET IN TOUCH" :duration="0.8" :scrambleOnScroll="true" />
          </h2>
          <p class="text-gray-300 text-xs sm:text-sm mb-10 leading-relaxed font-mono">
            Interested in working together or just want to talk? Transmit a message below or connect through any open channel.
          </p>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- Left Column: Compose Transmission Form (7 cols) -->
            <div class="lg:col-span-7 bg-abyss-950/85 p-6 sm:p-8 border border-sonar-blue/30 rounded-lg backdrop-blur-md shadow-2xl relative">
              <div class="text-[10px] text-sonar-blue tracking-widest font-bold mb-6 font-mono">// COMPOSE TRANSMISSION</div>

              <form @submit.prevent="sendPing" class="flex flex-col gap-5">
                <div class="flex flex-col gap-1.5">
                  <label class="text-[9px] text-gray-400 tracking-wider font-bold font-mono">YOUR NAME</label>
                  <input
                    v-model="cName"
                    type="text"
                    required
                    class="bg-black/60 border border-sonar-blue/25 p-3.5 text-xs focus:border-sonar-blue focus:outline-none rounded text-white font-mono transition-colors pointer-events-auto"
                    placeholder="John Doe"
                  />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[9px] text-gray-400 tracking-wider font-bold font-mono">YOUR EMAIL</label>
                  <input
                    v-model="cEmail"
                    type="email"
                    required
                    class="bg-black/60 border border-sonar-blue/25 p-3.5 text-xs focus:border-sonar-blue focus:outline-none rounded text-white font-mono transition-colors pointer-events-auto"
                    placeholder="john.doe@gmail.com"
                  />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[9px] text-gray-400 tracking-wider font-bold font-mono">MESSAGE</label>
                  <textarea
                    v-model="cMessage"
                    required
                    class="bg-black/60 border border-sonar-blue/25 p-3.5 text-xs focus:border-sonar-blue focus:outline-none rounded h-32 text-white font-mono resize-none transition-colors pointer-events-auto"
                    placeholder="Hi Yosep, I'd like to talk about..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  class="bg-sonar-orange hover:bg-sonar-orange/80 text-black font-bold p-3.5 text-xs uppercase tracking-[0.2em] rounded transition-all pointer-events-auto shadow-lg font-mono flex items-center justify-center gap-2 mt-2"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                  <span>TRANSMIT MESSAGE</span>
                </button>

                <div
                  v-if="sendStatus"
                  class="text-[10px] font-bold text-center mt-2 font-mono"
                  :class="sendStatus.includes('ERR') ? 'text-red-400' : 'text-sonar-green'"
                >
                  {{ sendStatus }}
                </div>
              </form>
            </div>

            <!-- Right Column: Direct Channels & Status Box (5 cols) -->
            <div class="lg:col-span-5 flex flex-col gap-6">
              
              <!-- Direct Channels Box -->
              <div class="bg-abyss-950/85 border border-sonar-blue/30 rounded-lg p-6 backdrop-blur-md shadow-2xl flex flex-col gap-4">
                <div class="text-[10px] text-sonar-blue tracking-widest font-bold font-mono border-b border-sonar-blue/20 pb-3">// DIRECT CHANNELS</div>

                <div class="flex flex-col gap-4 font-mono">
                  
                  <!-- Email -->
                  <a href="mailto:yosephprojects@gmail.com" class="flex items-center justify-between p-3 rounded bg-black/40 border border-sonar-blue/15 hover:border-sonar-blue/60 transition group pointer-events-auto">
                    <div class="flex items-center gap-3">
                      <svg class="w-4 h-4 text-sonar-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      <div>
                        <div class="text-[9px] text-gray-400 font-bold">EMAIL</div>
                        <div class="text-xs text-white group-hover:text-sonar-blue transition font-bold">yosephprojects@gmail.com</div>
                      </div>
                    </div>
                    <span class="text-xs text-gray-500 group-hover:text-sonar-blue transition">↗</span>
                  </a>

                  <!-- GitHub -->
                  <a href="https://github.com/Joo-Geovanie" target="_blank" class="flex items-center justify-between p-3 rounded bg-black/40 border border-sonar-blue/15 hover:border-sonar-blue/60 transition group pointer-events-auto">
                    <div class="flex items-center gap-3">
                      <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                      <div>
                        <div class="text-[9px] text-gray-400 font-bold">GITHUB</div>
                        <div class="text-xs text-white group-hover:text-sonar-blue transition font-bold">github.com/Joo-Geovanie</div>
                      </div>
                    </div>
                    <span class="text-xs text-gray-500 group-hover:text-sonar-blue transition">↗</span>
                  </a>

                  <!-- LinkedIn -->
                  <a href="https://www.linkedin.com/in/yosep-geovanie-aritonang-062a58285/" target="_blank" class="flex items-center justify-between p-3 rounded bg-black/40 border border-sonar-blue/15 hover:border-sonar-blue/60 transition group pointer-events-auto">
                    <div class="flex items-center gap-3">
                      <svg class="w-4 h-4 text-[#0a66c2]" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/></svg>
                      <div>
                        <div class="text-[9px] text-gray-400 font-bold">LINKEDIN</div>
                        <div class="text-xs text-white group-hover:text-sonar-blue transition font-bold">in/yosep-geovanie-aritonang</div>
                      </div>
                    </div>
                    <span class="text-xs text-gray-500 group-hover:text-sonar-blue transition">↗</span>
                  </a>

                  <!-- Instagram -->
                  <a href="https://instagram.com/yoseph.geovanie" target="_blank" class="flex items-center justify-between p-3 rounded bg-black/40 border border-sonar-blue/15 hover:border-sonar-blue/60 transition group pointer-events-auto">
                    <div class="flex items-center gap-3">
                      <svg class="w-4 h-4 text-[#e4405f]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                      <div>
                        <div class="text-[9px] text-gray-400 font-bold">INSTAGRAM</div>
                        <div class="text-xs text-white group-hover:text-sonar-blue transition font-bold">@yoseph.geovanie</div>
                      </div>
                    </div>
                    <span class="text-xs text-gray-500 group-hover:text-sonar-blue transition">↗</span>
                  </a>

                </div>
              </div>

              <!-- Uplink Available Status Box -->
              <div class="bg-abyss-950/85 border border-sonar-green/30 rounded-lg p-5 backdrop-blur-md shadow-2xl flex items-center justify-between font-mono">
                <div>
                  <div class="text-[9px] text-gray-400 font-bold tracking-widest">// UPLINK STATUS</div>
                  <div class="text-sm font-bold text-white mt-0.5">Available for new missions</div>
                </div>

                <div class="flex items-center gap-2 bg-sonar-green/10 border border-sonar-green/30 px-3 py-1.5 rounded">
                  <span class="relative flex h-2.5 w-2.5">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sonar-green opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-sonar-green"></span>
                  </span>
                  <span class="text-[10px] font-bold text-sonar-green tracking-wider">LIVE</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        <!-- Footer Bar with Copyright & Return to Surface Button -->
        <div class="mt-16 pt-6 border-t border-sonar-blue/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-gray-400">
          <div class="flex items-center gap-2">
            <span class="text-sonar-orange">◆</span>
            <span>© 2026 YOSEP GEOVANIE ARITONANG – TRANSMITTING FROM THE DEEP SEA</span>
          </div>

          <a href="#about" class="border border-sonar-blue/30 text-sonar-blue hover:bg-sonar-blue/15 hover:border-sonar-blue/60 px-4 py-2 rounded transition flex items-center gap-2 font-bold uppercase tracking-wider pointer-events-auto">
            <span>[▲]</span>
            <span>RETURN TO SURFACE</span>
          </a>
        </div>

      </section>
    </main>
  </div>
</template>

<style scoped>
.stroke-text {
  -webkit-text-stroke: 2px rgba(0, 240, 255, 0.45);
  color: transparent;
}
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 20s linear infinite;
}
</style>
