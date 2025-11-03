export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    if (import.meta.env.PROD) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered:', registration.scope)
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error)
          })
      })
    } else {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister()
        })
      })
    }
  }
}
