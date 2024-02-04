import { defineNuxtRouteMiddleware } from '#app'

export default defineNuxtRouteMiddleware(() => {
  if (location.href.includes('settings')) {
    return navigateTo('/settings', { replace: true })
  }
})
