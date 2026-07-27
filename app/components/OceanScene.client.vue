<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as THREE from 'three'
import { useTelemetry } from '~/composables/useTelemetry'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { scrollProgress } = useTelemetry()

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let particles: THREE.Points
let subGroup: THREE.Group
let propellerGroup: THREE.Group
let animationId: number
let particleVelocities: Float32Array

const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }

function createSubmarineMesh(): THREE.Group {
  const group = new THREE.Group()

  const hullMat = new THREE.MeshStandardMaterial({
    color: 0x0f2b46,
    metalness: 0.8,
    roughness: 0.2,
  })

  const yellowDeckMat = new THREE.MeshStandardMaterial({
    color: 0xffb703,
    metalness: 0.6,
    roughness: 0.3,
  })

  const cyanGlowMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
  })

  const headlightGlowMat = new THREE.MeshBasicMaterial({
    color: 0xfff59d,
  })

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x00ff66,
    transmission: 0.85,
    transparent: true,
    opacity: 0.9,
    roughness: 0.1,
  })

  const propMat = new THREE.MeshStandardMaterial({
    color: 0xff5e00,
    metalness: 0.9,
    roughness: 0.1,
  })

  // Main Hull Cylinder
  const hullGeo = new THREE.CylinderGeometry(1.5, 1.5, 6.5, 32)
  hullGeo.rotateZ(Math.PI / 2)
  const hull = new THREE.Mesh(hullGeo, hullMat)
  group.add(hull)

  // Top Deck Plate
  const deckGeo = new THREE.BoxGeometry(6.3, 0.25, 2.0)
  const deck = new THREE.Mesh(deckGeo, yellowDeckMat)
  deck.position.y = 1.4
  group.add(deck)

  // Front Nose
  const noseGeo = new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2)
  noseGeo.rotateZ(-Math.PI / 2)
  const nose = new THREE.Mesh(noseGeo, hullMat)
  nose.position.x = 3.25
  group.add(nose)

  // Rear Tail Cone
  const tailGeo = new THREE.ConeGeometry(1.5, 2.2, 32)
  tailGeo.rotateZ(Math.PI / 2)
  const tail = new THREE.Mesh(tailGeo, hullMat)
  tail.position.x = -4.35
  group.add(tail)

  // Conning Tower / Bridge
  const towerGeo = new THREE.BoxGeometry(1.8, 1.6, 1.1)
  const tower = new THREE.Mesh(towerGeo, yellowDeckMat)
  tower.position.set(0.5, 2.2, 0)
  group.add(tower)

  // Tower Cap
  const capGeo = new THREE.CylinderGeometry(0.5, 0.8, 1.8, 16)
  capGeo.rotateZ(Math.PI / 2)
  const cap = new THREE.Mesh(capGeo, hullMat)
  cap.position.set(0.5, 3.1, 0)
  group.add(cap)

  // Dual Periscopes
  const peri1Stem = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.4, 16), cyanGlowMat)
  peri1Stem.position.set(0.8, 3.8, 0.2)
  group.add(peri1Stem)

  const peri1Head = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.35, 16), cyanGlowMat)
  peri1Head.rotateZ(Math.PI / 2)
  peri1Head.position.set(0.95, 4.4, 0.2)
  group.add(peri1Head)

  // Portholes
  const windowTorus = new THREE.TorusGeometry(0.32, 0.07, 16, 32)
  const windowCircle = new THREE.CircleGeometry(0.3, 32)

  for (let i = 0; i < 4; i++) {
    const xPos = 2.0 - i * 1.3
    const ringL = new THREE.Mesh(windowTorus, cyanGlowMat)
    ringL.position.set(xPos, 0.25, 1.51)
    group.add(ringL)

    const glassL = new THREE.Mesh(windowCircle, glassMat)
    glassL.position.set(xPos, 0.25, 1.52)
    group.add(glassL)

    const ringR = new THREE.Mesh(windowTorus, cyanGlowMat)
    ringR.position.set(xPos, 0.25, -1.51)
    ringR.rotation.y = Math.PI
    group.add(ringR)

    const glassR = new THREE.Mesh(windowCircle, glassMat)
    glassR.position.set(xPos, 0.25, -1.52)
    glassR.rotation.y = Math.PI
    group.add(glassR)
  }

  // Headlight Searchlight
  const headlightGeo = new THREE.SphereGeometry(0.75, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2)
  headlightGeo.rotateZ(-Math.PI / 2)
  const headlight = new THREE.Mesh(headlightGeo, headlightGlowMat)
  headlight.position.x = 3.26
  group.add(headlight)

  // Spot Light Cone
  const spotLight = new THREE.SpotLight(0xfff59d, 7, 28, Math.PI / 4, 0.4)
  spotLight.position.set(3.5, 0, 0)
  spotLight.target.position.set(18, -2, 0)
  group.add(spotLight)
  group.add(spotLight.target)

  // Tail Fins & Propeller
  const vFin = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.6, 0.1), yellowDeckMat)
  vFin.position.set(-5.1, 1.1, 0)
  group.add(vFin)

  const hFin = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.1, 2.0), yellowDeckMat)
  hFin.position.set(-4.7, 0, 0)
  group.add(hFin)

  propellerGroup = new THREE.Group()
  const propHub = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.5, 16), propMat)
  propHub.rotateZ(Math.PI / 2)
  propellerGroup.add(propHub)

  const bladeGeo = new THREE.BoxGeometry(0.1, 1.4, 0.28)
  for (let i = 0; i < 4; i++) {
    const blade = new THREE.Mesh(bladeGeo, propMat)
    blade.rotation.x = (i * Math.PI) / 2
    propellerGroup.add(blade)
  }
  propellerGroup.position.set(-5.6, 0, 0)
  group.add(propellerGroup)

  return group
}

function init() {
  if (!canvasRef.value) return

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 14)

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x00f0ff, 1.8)
  scene.add(ambientLight)

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.2)
  keyLight.position.set(8, 12, 10)
  scene.add(keyLight)

  const fillLight = new THREE.DirectionalLight(0x00ff66, 2.0)
  fillLight.position.set(-10, -5, 5)
  scene.add(fillLight)

  // Particles
  const particleCount = 1600
  const positions = new Float32Array(particleCount * 3)
  particleVelocities = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 50
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50
    particleVelocities[i] = 0.008 + Math.random() * 0.03
  }

  const pGeo = new THREE.BufferGeometry()
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const pMat = new THREE.PointsMaterial({
    size: 0.08,
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  particles = new THREE.Points(pGeo, pMat)
  scene.add(particles)

  // Submarine creation
  subGroup = createSubmarineMesh()
  const isMobile = window.innerWidth < 768
  subGroup.scale.set(isMobile ? 0.45 : 0.95, isMobile ? 0.45 : 0.95, isMobile ? 0.45 : 0.95)
  subGroup.position.set(isMobile ? 0 : 3.4, isMobile ? -1.2 : 0.2, 0)
  subGroup.rotation.y = -Math.PI / 6
  subGroup.rotation.z = -Math.PI / 30
  scene.add(subGroup)

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize', onResize)

  animate()
}

function onMouseMove(e: MouseEvent) {
  mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2
  mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2
}

function onResize() {
  if (!renderer || !camera || !subGroup) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)

  const isMobile = window.innerWidth < 768
  subGroup.scale.set(isMobile ? 0.45 : 0.95, isMobile ? 0.45 : 0.95, isMobile ? 0.45 : 0.95)
}

function animate() {
  animationId = requestAnimationFrame(animate)

  mouse.x += (mouse.targetX - mouse.x) * 0.05
  mouse.y += (mouse.targetY - mouse.y) * 0.05

  if (particles) {
    const posAttr = particles.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < posAttr.count; i++) {
      let y = posAttr.getY(i)
      y += particleVelocities[i]
      if (y > 25) y = -25
      posAttr.setY(i, y)
    }
    posAttr.needsUpdate = true
    particles.rotation.y += 0.0004
  }

  // Dynamic Scroll Reaction: Submarine sinks deeper & drifts right on scroll
  if (subGroup) {
    const time = Date.now() * 0.001
    const isMobile = window.innerWidth < 768
    const scrollOffset = scrollProgress.value

    const baseX = isMobile ? 0 : 3.4 + scrollOffset * 1.5
    const baseY = isMobile ? -1.2 - scrollOffset * 4.0 : 0.2 - scrollOffset * 4.5

    subGroup.position.y = baseY + Math.sin(time * 1.2) * 0.25
    subGroup.position.x = baseX + Math.cos(time * 0.8) * 0.15 + mouse.x * 0.4

    subGroup.rotation.y = -Math.PI / 6 + Math.sin(time * 0.6) * 0.08 + mouse.x * 0.25
    subGroup.rotation.z = -Math.PI / 30 + Math.sin(time * 1.0) * 0.05 + mouse.y * 0.15
  }

  if (propellerGroup) {
    propellerGroup.rotation.x += 0.35
  }

  renderer.render(scene, camera)
}

onMounted(() => {
  nextTick(() => {
    init()
  })
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('resize', onResize)
  renderer?.dispose()
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="fixed inset-0 w-full h-full pointer-events-none z-10"
  />
</template>
