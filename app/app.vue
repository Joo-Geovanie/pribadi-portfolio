<template>
  <div class="min-h-screen text-white font-mono selection:bg-sonar-blue selection:text-black bg-transparent">
    <NuxtPage />

    <!-- Global Custom Sonar Crosshair Cursor (Desktop Only, All Pages) -->
    <ClientOnly>
      <CustomCursor />
    </ClientOnly>
  </div>
</template>
