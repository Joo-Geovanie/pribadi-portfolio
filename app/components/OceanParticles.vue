<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useLoop } from '@tresjs/core'

const pointsRef = ref<any>(null)
const mouse = { x: 0, y: 0 }

// Generate random floating particles (marine snow / bubbles)
const particleCount = 1200
const positions = new Float32Array(particleCount * 3)
const speeds = new Float32Array(particleCount)

for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 30     // X
  positions[i * 3 + 1] = (Math.random() - 0.5) * 30 // Y
  positions[i * 3 + 2] = (Math.random() - 0.5) * 30 // Z
  speeds[i] = 0.01 + Math.random() * 0.03           // Upward speed
}

const handleMouseMove = (event: MouseEvent) => {
  mouse.x = (event.clientX / window.innerWidth) - 0.5
  mouse.y = -(event.clientY / window.innerHeight) + 0.5
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})

const { onBeforeRender } = useLoop()

onBeforeRender(() => {
  if (pointsRef.value) {
    const geo = pointsRef.value.geometry
    const posAttr = geo.attributes.position
    
    for (let i = 0; i < particleCount; i++) {
      // Move particles upwards
      let y = posAttr.getY(i)
      y += speeds[i]
      
      // Reset if out of bounds
      if (y > 15) {
        y = -15
      }
      posAttr.setY(i, y)

      // Subtly push particles dynamically based on mouse parallax
      let x = posAttr.getX(i)
      x += (mouse.x * 0.2 - x) * 0.01
      posAttr.setX(i, x)
    }
    posAttr.needsUpdate = true
  }
})
</script>

<template>
  <TresPoints ref="pointsRef">
    <TresBufferGeometry>
      <TresBufferAttribute
        name="position"
        :args="[positions, 3]"
      />
    </TresBufferGeometry>
    <TresPointsMaterial
      :size="0.08"
      color="#00f0ff"
      :transparent="true"
      :opacity="0.6"
      :sizeAttenuation="true"
    />
  </TresPoints>
</template>
