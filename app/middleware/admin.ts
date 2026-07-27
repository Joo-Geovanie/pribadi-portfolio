import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useSupabaseUser } from '#imports'

export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()

  // Protect all /admin routes, but skip login page itself to prevent loop
  if (!user.value && to.path !== '/admin/login') {
    return navigateTo('/admin/login')
  }
})
