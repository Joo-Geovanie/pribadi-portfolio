<script setup lang="ts">
import { ref, onMounted } from 'vue'

const visible = ref(true)
const fadeOut = ref(false)
const lines = ref<{ text: string; status: string }[]>([])

const bootSequence = [
  { text: 'FLOODING BALLAST TANKS', status: 'OK' },
  { text: 'STARTING ACTIVE SONAR SWEEP', status: 'OK' },
  { text: 'HYDROPHONE CALIBRATION', status: 'OK' },
  { text: 'PRESSURE HULL INTEGRITY CHECK', status: 'NOMINAL' },
  { text: 'TELEMETRY SYSTEMS ONLINE', status: 'OK' },
  { text: 'DEPTH SENSOR ARRAY', status: 'OK' },
  { text: 'ESTABLISHING UPLINK', status: 'CONNECTED' },
]

const progress = ref(0)

onMounted(() => {
  let i = 0
  const interval = setInterval(() => {
    if (i < bootSequence.length) {
      lines.value.push(bootSequence[i])
      progress.value = Math.floor(((i + 1) / bootSequence.length) * 100)
      i++
    } else {
      clearInterval(interval)
      setTimeout(() => {
        fadeOut.value = true
        setTimeout(() => {
          visible.value = false
        }, 800)
      }, 600)
    }
  }, 280)
})
</script>

<template>
  <div
    v-if="visible"
    :class="[
      'fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700',
      fadeOut ? 'opacity-0' : 'opacity-100'
    ]"
    style="background: #020514"
  >
    <!-- Scanline overlay -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,240,255,0.1)_2px,rgba(0,240,255,0.1)_4px)]"></div>

    <div class="font-mono max-w-lg w-full px-8 relative">
      <!-- Header -->
      <div class="text-[10px] text-sonar-blue/60 tracking-[0.3em] mb-6">///  MISSION DEEP-DIVE INIT  ///</div>

      <!-- Boot lines -->
      <div class="flex flex-col gap-1.5 mb-8">
        <div
          v-for="(line, idx) in lines"
          :key="idx"
          class="flex items-center justify-between text-xs"
        >
          <span class="text-gray-300">
            <span class="text-sonar-blue/50 mr-2">&gt;</span>
            {{ line.text }}
          </span>
          <span
            :class="[
              'font-bold text-[10px] tracking-wider',
              line.status === 'NOMINAL' ? 'text-sonar-green' :
              line.status === 'CONNECTED' ? 'text-sonar-blue' : 'text-sonar-green'
            ]"
          >
            [ {{ line.status }} ]
          </span>
        </div>

        <!-- Cursor blink -->
        <div v-if="lines.length < bootSequence.length" class="text-sonar-blue animate-pulse text-xs">
          <span class="text-sonar-blue/50 mr-2">&gt;</span>█
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="mb-4">
        <div class="flex justify-between text-[9px] text-gray-500 mb-1.5">
          <span>SYSTEM INITIALIZATION</span>
          <span class="text-sonar-blue font-bold">{{ progress }}%</span>
        </div>
        <div class="w-full h-[2px] bg-sonar-blue/10 rounded overflow-hidden">
          <div
            class="h-full bg-sonar-blue transition-all duration-300"
            :style="{ width: progress + '%' }"
          ></div>
        </div>
      </div>

      <!-- Welcome message -->
      <div
        v-if="lines.length >= bootSequence.length"
        class="text-sonar-green text-xs font-bold tracking-wider animate-pulse mt-6"
      >
        WELCOME ABOARD, CAPTAIN.
      </div>
    </div>
  </div>
</template>
