import { ref, computed } from 'vue'

// ====================================================
// MODULE-LEVEL STATE (Singleton / Shared across all components)
// This ensures TelemetryHUD and index.vue share the same data
// ====================================================
const scrollProgress = ref(0)
const battery = ref(98)

export const useTelemetry = () => {
  const depth = computed(() => Math.floor(scrollProgress.value * 3000))

  const pressure = computed(() => {
    const atm = 1 + (depth.value / 10)
    return atm.toFixed(1)
  })

  const temperature = computed(() => {
    const temp = 28 - (scrollProgress.value * 24)
    return temp.toFixed(1)
  })

  const signalStrength = computed(() => {
    if (depth.value < 500) return 'NOMINAL'
    if (depth.value < 1800) return 'WEAK'
    return 'NO_SIGNAL'
  })

  // Depth zone label
  const depthZone = computed(() => {
    if (depth.value < 200) return 'EPIPELAGIC'
    if (depth.value < 1000) return 'MESOPELAGIC'
    if (depth.value < 2000) return 'BATHYPELAGIC'
    return 'ABYSSOPELAGIC'
  })

  const updateScroll = (progress: number) => {
    scrollProgress.value = Math.max(0, Math.min(1, progress))
  }

  return {
    scrollProgress,
    depth,
    pressure,
    temperature,
    battery,
    signalStrength,
    depthZone,
    updateScroll
  }
}
