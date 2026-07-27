<script setup lang="ts">
import { ref } from 'vue'

const rootRef = ref<HTMLElement | null>(null)
const rotateX = ref(0)
const rotateY = ref(0)
const shine = ref({ x: 50, y: 50 })

const onMouseMove = (e: MouseEvent) => {
  if (!rootRef.value) return
  const rect = rootRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  // Max tilt = 8 degrees
  rotateY.value = ((x - centerX) / centerX) * 8
  rotateX.value = -((y - centerY) / centerY) * 8

  // Shine position for reflective highlight
  shine.value = {
    x: (x / rect.width) * 100,
    y: (y / rect.height) * 100
  }
}

const onMouseLeave = () => {
  rotateX.value = 0
  rotateY.value = 0
  shine.value = { x: 50, y: 50 }
}
</script>

<template>
  <div
    ref="rootRef"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
    class="relative"
    :style="{
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: rotateX === 0 && rotateY === 0 ? 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)' : 'transform 0.1s ease-out'
    }"
  >
    <slot />
    
    <!-- Reflective shine overlay -->
    <div 
      class="absolute inset-0 pointer-events-none rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      :style="{
        background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(0,240,255,0.08) 0%, transparent 60%)`
      }"
    ></div>
  </div>
</template>
