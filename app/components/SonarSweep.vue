<template>
  <div class="relative w-64 h-64 border border-sonar-green/30 rounded-full flex items-center justify-center overflow-hidden bg-black/40">
    <!-- Concentric radar rings -->
    <div class="absolute w-48 h-48 border border-sonar-green/20 rounded-full"></div>
    <div class="absolute w-32 h-32 border border-sonar-green/10 rounded-full"></div>
    <div class="absolute w-16 h-16 border border-sonar-green/5 rounded-full"></div>
    
    <!-- Crosshairs -->
    <div class="absolute top-0 bottom-0 left-1/2 w-[1px] bg-sonar-green/20"></div>
    <div class="absolute left-0 right-0 top-1/2 h-[1px] bg-sonar-green/20"></div>
    
    <!-- Sonar active sweeping arm -->
    <div class="absolute inset-0 origin-center animate-sonar-spin rounded-full">
      <div class="w-1/2 h-full bg-gradient-to-r from-transparent to-sonar-green/20 border-r border-sonar-green/50"></div>
    </div>
    
    <!-- Target blips -->
    <div class="absolute top-12 left-16 w-2.5 h-2.5 bg-sonar-green rounded-full animate-ping opacity-75"></div>
    <div class="absolute bottom-20 right-10 w-2.5 h-2.5 bg-sonar-blue rounded-full animate-ping opacity-50"></div>
  </div>
</template>

<style scoped>
@keyframes sonar-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.animate-sonar-spin {
  animation: sonar-spin 4s linear infinite;
}
</style>
