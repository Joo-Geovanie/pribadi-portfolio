<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  duration: { type: Number, default: 0.8 }, // in seconds
  delay: { type: Number, default: 0 }, // in ms
  once: { type: Boolean, default: true } // Scramble once on enter, avoiding scroll lag!
})

const rootRef = ref<HTMLElement | null>(null)
const displayedText = ref('')
const chars = '!@#$%^&*()_+{}|:<>?-=[]\\;\',./ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
let observer: IntersectionObserver | null = null
let rafId: number | null = null
let hasScrambled = false

const scramble = () => {
  const target = props.text
  if (!target) return
  if (rafId) cancelAnimationFrame(rafId)

  let startTime: number | null = null
  const durationMs = props.duration * 1000

  const update = (timestamp: number) => {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / durationMs, 1)

    let result = ''
    for (let i = 0; i < target.length; i++) {
      if (target[i] === ' ' || target[i] === '\n') {
        result += target[i]
        continue
      }

      const threshold = i / target.length
      if (progress > threshold) {
        result += target[i]
      } else {
        result += chars[Math.floor(Math.random() * chars.length)]
      }
    }

    displayedText.value = result

    if (progress < 1) {
      rafId = requestAnimationFrame(update)
    } else {
      displayedText.value = target
      rafId = null
    }
  }

  rafId = requestAnimationFrame(update)
}

onMounted(() => {
  displayedText.value = props.text

  if (typeof IntersectionObserver !== 'undefined') {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && (!hasScrambled || !props.once)) {
          hasScrambled = true
          setTimeout(() => {
            scramble()
          }, props.delay)

          // Disconnect observer if once = true so scroll remains 100% smooth without CPU overhead!
          if (props.once && observer && rootRef.value) {
            observer.unobserve(rootRef.value)
          }
        }
      })
    }, { threshold: 0.15 })

    if (rootRef.value) {
      observer.observe(rootRef.value)
    }
  } else {
    setTimeout(() => {
      scramble()
    }, props.delay)
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  if (rafId) cancelAnimationFrame(rafId)
})

watch(() => props.text, () => {
  scramble()
})
</script>

<template>
  <span ref="rootRef" class="inline-block">{{ displayedText }}</span>
</template>
