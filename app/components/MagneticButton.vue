<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps({
  tag: { type: String, default: 'a' },
  strength: { type: Number, default: 0.3 } // 0 = no effect, 1 = full magnetic pull
})

const rootRef = ref<HTMLElement | null>(null)
const offsetX = ref(0)
const offsetY = ref(0)

const onMouseMove = (e: MouseEvent) => {
  if (!rootRef.value) return
  const rect = rootRef.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const dx = e.clientX - centerX
  const dy = e.clientY - centerY
  offsetX.value = dx * props.strength
  offsetY.value = dy * props.strength
}

const onMouseLeave = () => {
  offsetX.value = 0
  offsetY.value = 0
}
</script>

<template>
  <component
    :is="tag"
    ref="rootRef"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
    :style="{
      transform: `translate(${offsetX}px, ${offsetY}px)`,
      transition: offsetX === 0 && offsetY === 0 ? 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)' : 'transform 0.15s ease-out'
    }"
    class="inline-block"
  >
    <slot />
  </component>
</template>
