<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTelemetry } from '~/composables/useTelemetry'

const { scrollProgress, depth, pressure, temperature, battery, signalStrength, depthZone } = useTelemetry()

const currentTime = ref('')
const mobileMenuOpen = ref(false)
let timer: any

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toTimeString().split(' ')[0]
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="fixed inset-0 pointer-events-none z-30 font-mono text-white text-xs select-none">

    <!-- ================= TOP HEADER BAR ================= -->
    <header class="absolute top-0 left-0 right-0 h-14 px-4 sm:px-8 flex justify-between items-center border-b border-sonar-blue/20 bg-abyss-950/85 backdrop-blur-md pointer-events-auto shadow-lg">
      <!-- Left: Logo -->
      <div class="flex items-center gap-4 sm:gap-6">
        <a href="#" class="flex items-center gap-2.5 group">
          <div class="w-3.5 h-3.5 bg-sonar-orange transform rotate-45 group-hover:scale-110 transition-transform"></div>
          <div>
            <div class="font-black text-xs sm:text-sm tracking-widest text-white leading-none">GEOVANIE</div>
            <div class="text-[8px] sm:text-[9px] text-sonar-blue tracking-widest font-bold mt-0.5">FULL-STACK DEV</div>
          </div>
        </a>

        <!-- Mission Status Tag (Hidden on mobile) -->
        <div class="hidden md:flex items-center gap-2 text-[10px] text-gray-300 bg-white/5 border border-white/10 px-3 py-1 rounded">
          <span class="w-2 h-2 rounded-full bg-sonar-green animate-pulse"></span>
          <span>DIVING {{ currentTime }}</span>
          <span class="text-gray-600">|</span>
          <span class="text-sonar-blue font-bold">DEPTH {{ depth }}M</span>
        </div>
      </div>

      <!-- Center / Right: Nav Links -->
      <div class="flex items-center gap-4 sm:gap-6">
        <nav class="hidden lg:flex items-center gap-6 text-[11px] font-bold tracking-wider">
          <a href="#about" class="text-gray-300 hover:text-sonar-blue transition-colors"><span class="text-sonar-blue mr-1">01</span>ABOUT</a>
          <a href="#techstack" class="text-gray-300 hover:text-sonar-blue transition-colors"><span class="text-sonar-blue mr-1">02</span>SKILLS</a>
          <a href="#works" class="text-gray-300 hover:text-sonar-blue transition-colors"><span class="text-sonar-blue mr-1">03</span>WORKS</a>
          <a href="#contact" class="text-gray-300 hover:text-sonar-blue transition-colors"><span class="text-sonar-blue mr-1">04</span>CONTACT</a>
        </nav>

        <a href="#contact" class="border border-sonar-orange/50 text-sonar-orange hover:bg-sonar-orange/15 px-4 py-1.5 rounded text-[10px] font-bold tracking-widest uppercase transition-all flex items-center gap-1.5 shadow-md">
          <span>// TRANSMIT</span>
        </a>

        <!-- Mobile Hamburger Toggle Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="lg:hidden p-2 text-sonar-blue hover:text-white pointer-events-auto text-lg focus:outline-none"
        >
          {{ mobileMenuOpen ? '✕' : '☰' }}
        </button>
      </div>
    </header>

    <!-- ================= MOBILE MENU DRAWER ================= -->
    <div
      v-if="mobileMenuOpen"
      class="lg:hidden fixed top-14 left-0 right-0 bg-abyss-950/95 backdrop-blur-xl border-b border-sonar-blue/30 p-6 flex flex-col gap-4 pointer-events-auto shadow-2xl z-50 text-sm font-mono font-bold"
    >
      <a @click="mobileMenuOpen = false" href="#about" class="text-gray-200 hover:text-sonar-blue flex justify-between py-2 border-b border-white/5">
        <span>01 // ABOUT</span>
        <span class="text-sonar-blue">→</span>
      </a>
      <a @click="mobileMenuOpen = false" href="#techstack" class="text-gray-200 hover:text-sonar-blue flex justify-between py-2 border-b border-white/5">
        <span>02 // SKILLS</span>
        <span class="text-sonar-blue">→</span>
      </a>
      <a @click="mobileMenuOpen = false" href="#works" class="text-gray-200 hover:text-sonar-blue flex justify-between py-2 border-b border-white/5">
        <span>03 // WORKS</span>
        <span class="text-sonar-blue">→</span>
      </a>
      <a @click="mobileMenuOpen = false" href="#contact" class="text-gray-200 hover:text-sonar-blue flex justify-between py-2 border-b border-white/5">
        <span>04 // CONTACT</span>
        <span class="text-sonar-blue">→</span>
      </a>
    </div>

    <!-- ================= LEFT DEPTH & TRACKING BAR (Desktop) ================= -->
    <div class="hidden lg:flex fixed left-4 top-24 bottom-16 flex-col justify-between items-center text-[9px] text-gray-500 tracking-widest pointer-events-none">
      <div class="transform -rotate-90 origin-left text-sonar-blue font-bold tracking-[0.2em]">
        N° 0504 // DESKTOP-21
      </div>

      <!-- Vertical Progress Slider -->
      <div class="flex flex-col items-center gap-2 my-auto">
        <div class="text-[10px] font-bold text-sonar-blue tabular-nums">
          {{ Math.floor(scrollProgress * 100) }}%
        </div>
        <div class="w-1.5 h-48 bg-sonar-blue/20 rounded-full overflow-hidden relative border border-sonar-blue/30">
          <div
            class="w-full bg-sonar-blue transition-all duration-150 absolute top-0 left-0 shadow-[0_0_8px_#00f0ff]"
            :style="{ height: (scrollProgress * 100) + '%' }"
          ></div>
        </div>
        <div class="text-[8px] text-gray-400 uppercase tracking-widest font-bold">SCROLL</div>
      </div>

      <div class="text-[8px] text-gray-400 font-mono text-center">
        {{ (depth / 1000).toFixed(2) }} KM<br />ALT
      </div>
    </div>

    <!-- ================= SUBMARINE TELEMETRY VITALS BOX (Desktop only) ================= -->
    <div class="hidden xl:block absolute right-8 top-20 w-56 bg-abyss-950/85 backdrop-blur-md border border-sonar-blue/40 rounded-lg p-3.5 text-[10px] shadow-2xl pointer-events-auto">
      <div class="flex justify-between items-center border-b border-sonar-blue/20 pb-1.5 mb-2">
        <span class="text-sonar-green font-bold flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-sonar-green animate-ping"></span>
          DSV-TRITON STATUS
        </span>
        <span class="text-sonar-green font-bold text-[9px] px-1.5 py-0.5 bg-sonar-green/10 rounded">NOMINAL</span>
      </div>

      <div class="text-[8px] text-gray-400 tracking-wider mb-2 uppercase font-bold">SUBMARINE VITALS</div>

      <div class="space-y-1.5 font-mono text-[10px]">
        <div class="flex justify-between">
          <span class="text-gray-400">PULSE / SONAR</span>
          <span class="text-sonar-blue font-bold">72 BPM</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-400">O2 SATURATION</span>
          <span class="text-sonar-green font-bold">98.1%</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-400">CABIN TEMP</span>
          <span class="text-sonar-blue font-bold">{{ temperature }}°C</span>
        </div>
        <div class="flex justify-between pt-1 border-t border-sonar-blue/15">
          <span class="text-gray-400">O2 LEVEL</span>
          <span class="text-sonar-green font-bold">97.8%</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-400">HULL PRESS</span>
          <span class="text-sonar-orange font-bold">{{ pressure }} ATM</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-400">DEPTH ZONE</span>
          <span class="text-sonar-blue font-bold text-[9px] uppercase">{{ depthZone }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-400">BATTERY</span>
          <span class="text-sonar-green font-bold">{{ battery }}%</span>
        </div>
      </div>
    </div>

    <!-- ================= BOTTOM TELEMETRY FOOTER BAR ================= -->
    <footer class="absolute bottom-0 left-0 right-0 h-10 px-4 sm:px-8 flex justify-between items-center border-t border-sonar-blue/20 bg-abyss-950/90 backdrop-blur-md text-[9px] sm:text-[10px]">
      <div class="flex items-center gap-4 sm:gap-6">
        <div class="flex items-center gap-1.5 text-sonar-green">
          <span class="w-2 h-2 rounded-full bg-sonar-green animate-pulse"></span>
          <span class="font-bold">SYSTEMS NOMINAL</span>
        </div>
        <div class="hidden sm:block text-gray-400 font-mono">
          LAT -6.2088 · LON 106.8456
        </div>
      </div>

      <div class="flex items-center gap-4 sm:gap-6 font-mono text-gray-300">
        <div>DEPTH: <span class="text-sonar-blue font-bold">{{ depth }}M</span></div>
        <div class="hidden sm:block">PRESS: <span class="text-sonar-green font-bold">{{ pressure }} ATM</span></div>
        <div class="hidden md:block">SIG: <span class="text-sonar-orange font-bold">{{ signalStrength }}</span></div>
        <div class="hidden xs:block">JAKARTA {{ currentTime }}</div>
      </div>
    </footer>

    <!-- ================= VIEWPORT CORNER CROSSHAIR BRACKETS ================= -->
    <div class="absolute top-16 left-3 text-sonar-blue/60 text-sm font-mono">+</div>
    <div class="absolute top-16 right-3 text-sonar-blue/60 text-sm font-mono">+</div>
    <div class="absolute bottom-12 left-3 text-sonar-blue/60 text-sm font-mono">+</div>
    <div class="absolute bottom-12 right-3 text-sonar-blue/60 text-sm font-mono">+</div>

  </div>
</template>
