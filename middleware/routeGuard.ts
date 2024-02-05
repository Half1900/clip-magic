import { defineNuxtRouteMiddleware } from '#app'

export default defineNuxtRouteMiddleware(() => {
  const path = location.href
  if (path.includes('settings')) {
    return navigateTo('/settings', { replace: true })
  } else if (path.includes('edit')) {
    return navigateTo('/edit', { replace: true })
  }
})
