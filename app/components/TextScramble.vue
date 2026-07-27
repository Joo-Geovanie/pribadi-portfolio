<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  duration: { type: Number, default: 1.0 }, // in seconds
  delay: { type: Number, default: 0 }, // in ms
  scrambleOnScroll: { type: Boolean, default: true } // Auto re-scramble on scroll re-entry
})

const rootRef = ref<HTMLElement | null>(null)
const displayedText = ref('')
const chars = '!@#$%^&*()_+{}|:<>?-=[]\\;\',./ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
let observer: IntersectionObserver | null = null
let currentInterval: any = null
let hasScrambled = false

const scramble = () => {
  const target = props.text
  if (!target) return
  if (currentInterval) clearInterval(currentInterval)

  let frame = 0
  const fps = 30
  const totalFrames = Math.floor(props.duration * fps)

  currentInterval = setInterval(() => {
    let result = ''
    for (let i = 0; i < target.length; i++) {
      if (target[i] === ' ' || target[i] === '\n') {
        result += target[i]
        continue
      }

      const progress = frame / totalFrames
      const threshold = i / target.length

      if (progress > threshold) {
        result += target[i]
      } else {
        result += chars[Math.floor(Math.random() * chars.length)]
      }
    }

    displayedText.value = result
    frame++

    if (frame > totalFrames) {
      displayedText.value = target
      clearInterval(currentInterval)
      currentInterval = null
    }
  }, 1000 / fps)
}

onMounted(() => {
  displayedText.value = props.text

  if (props.scrambleOnScroll && typeof IntersectionObserver !== 'undefined') {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            scramble()
          }, props.delay)
        } else {
          // Reset when scrolled out of view so it can scramble again on re-entry!
          if (currentInterval) {
            clearInterval(currentInterval)
            currentInterval = null
          }
        }
      })
    }, { threshold: 0.25 })

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
  if (currentInterval) clearInterval(currentInterval)
})

// Trigger scramble if text updates dynamically
watch(() => props.text, () => {
  scramble()
})
</script>

<template>
  <span ref="rootRef" class="inline-block">{{ displayedText }}</span>
</template>
