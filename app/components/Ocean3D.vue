<template>
  <div class="fixed inset-0 pointer-events-none z-0">
    <TresCanvas clear-color="#020514" alpha>
      <TresPerspectiveCamera :position="[0, 0, 10]" :fov="75" />
      <OceanParticles />
      <TresDirectionalLight :position="[5, 5, 5]" :intensity="1.5" />
      <TresAmbientLight :intensity="0.2" />
    </TresCanvas>
  </div>
</template>
