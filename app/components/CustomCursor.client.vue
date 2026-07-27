<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const cursorX = ref(0)
const cursorY = ref(0)
const trailX = ref(0)
const trailY = ref(0)
const isHovering = ref(false)
const isClicking = ref(false)
const isVisible = ref(false)
let rafId: number | null = null

const onMouseMove = (e: MouseEvent) => {
  cursorX.value = e.clientX
  cursorY.value = e.clientY
  if (!isVisible.value) isVisible.value = true
}

const onMouseDown = () => { isClicking.value = true }
const onMouseUp = () => { isClicking.value = false }

const onMouseOver = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.closest('a, button, [role="button"], input, textarea, select, .pointer-events-auto')) {
    isHovering.value = true
  }
}
const onMouseOut = () => { isHovering.value = false }

const animate = () => {
  // Smooth trailing with lerp
  trailX.value += (cursorX.value - trailX.value) * 0.15
  trailY.value += (cursorY.value - trailY.value) * 0.15
  rafId = requestAnimationFrame(animate)
}

onMounted(() => {
  // Only show custom cursor on non-touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)
    rafId = requestAnimationFrame(animate)
  }
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mousedown', onMouseDown)
  document.removeEventListener('mouseup', onMouseUp)
  document.removeEventListener('mouseover', onMouseOver)
  document.removeEventListener('mouseout', onMouseOut)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div v-if="isVisible" class="pointer-events-none fixed inset-0 z-[9999] hidden lg:block">
    
    <!-- Inner Dot (follows cursor exactly) -->
    <div 
      class="absolute w-1.5 h-1.5 rounded-full transition-transform duration-75"
      :class="isClicking ? 'bg-sonar-orange scale-50' : 'bg-sonar-blue'"
      :style="{ 
        left: cursorX + 'px', 
        top: cursorY + 'px',
        transform: 'translate(-50%, -50%)'
      }"
    ></div>

    <!-- Outer Sonar Ring (follows with smooth trail) -->
    <div 
      class="absolute rounded-full border transition-all duration-200"
      :class="[
        isHovering ? 'w-12 h-12 border-sonar-orange/60 bg-sonar-orange/5' : 'w-8 h-8 border-sonar-blue/40',
        isClicking ? 'scale-75' : 'scale-100'
      ]"
      :style="{ 
        left: trailX + 'px', 
        top: trailY + 'px',
        transform: 'translate(-50%, -50%)'
      }"
    ></div>

    <!-- Crosshair Lines (only visible when NOT hovering) -->
    <template v-if="!isHovering">
      <div 
        class="absolute w-px h-3 bg-sonar-blue/30"
        :style="{ left: trailX + 'px', top: (trailY - 20) + 'px', transform: 'translateX(-50%)' }"
      ></div>
      <div 
        class="absolute w-px h-3 bg-sonar-blue/30"
        :style="{ left: trailX + 'px', top: (trailY + 17) + 'px', transform: 'translateX(-50%)' }"
      ></div>
      <div 
        class="absolute w-3 h-px bg-sonar-blue/30"
        :style="{ left: (trailX - 20) + 'px', top: trailY + 'px', transform: 'translateY(-50%)' }"
      ></div>
      <div 
        class="absolute w-3 h-px bg-sonar-blue/30"
        :style="{ left: (trailX + 17) + 'px', top: trailY + 'px', transform: 'translateY(-50%)' }"
      ></div>
    </template>
  </div>
</template>
