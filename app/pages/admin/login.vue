<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabaseClient } from '#imports'

const supabase = useSupabaseClient()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'ERR // INCOMPLETE LOGIN SEGMENT'
    return
  }
  
  loading.value = true
  errorMessage.value = ''
  
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
    
    if (error) throw error
    
    // Redirect to admin panel on success
    router.push('/admin')
  } catch (err: any) {
    errorMessage.value = `ERR // ${err.message?.toUpperCase() || 'ACCESS DENIED'}`
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#020514] flex items-center justify-center font-mono text-white p-6 relative overflow-hidden">
    <!-- Grid overlay background effect -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff08_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

    <div class="relative w-full max-w-md border border-sonar-blue/30 bg-black/60 p-8 rounded-lg backdrop-blur-md shadow-2xl">
      <!-- Title -->
      <div class="flex flex-col gap-1 border-b border-sonar-blue/20 pb-4 mb-6">
        <div class="text-[10px] text-sonar-blue font-bold tracking-widest">// SECURE GATEWAY</div>
        <h1 class="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          DSV CONTROL DECK
        </h1>
      </div>

      <!-- Error log box -->
      <div v-if="errorMessage" class="mb-4 bg-red-950/40 border border-red-500/30 text-red-500 text-xs p-3 rounded font-bold">
        {{ errorMessage }}
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-[10px] text-gray-400">OPERATIVE ID (EMAIL)</label>
          <input 
            v-model="email"
            type="email" 
            required
            class="bg-black/40 border border-sonar-blue/20 p-3 text-sm focus:border-sonar-blue focus:outline-none rounded text-white font-mono"
            placeholder="operative@deepocean.com" 
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[10px] text-gray-400">CRYPTO KEY (PASSWORD)</label>
          <input 
            v-model="password"
            type="password" 
            required
            class="bg-black/40 border border-sonar-blue/20 p-3 text-sm focus:border-sonar-blue focus:outline-none rounded text-white font-mono"
            placeholder="••••••••••••" 
          />
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="bg-sonar-blue text-black font-bold p-3 text-sm hover:bg-sonar-blue/80 transition uppercase tracking-wider rounded font-mono disabled:opacity-50 mt-2"
        >
          {{ loading ? 'INITIALIZING DECK...' : 'VERIFY AUTHORIZATION' }}
        </button>
      </form>

      <!-- Bottom security disclaimer -->
      <div class="mt-6 text-[9px] text-gray-500 leading-relaxed text-center">
        WARNING: AUTHORIZED ACCESS ONLY. THIS IS A PRIVATE TELEMETRY NODE. UNAUTHORIZED CONNECTIONS WILL BE LOGGED.
      </div>
    </div>
  </div>
</template>
