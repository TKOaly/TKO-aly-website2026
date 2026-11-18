/* Minimal service worker: offline fallback + cached static assets.
 * Pages, API calls, auth, and admin/member areas are never served from cache. */
const VERSION = "v1"
const STATIC_CACHE = `static-${VERSION}`
const OFFLINE_URL = "/offline.html"

self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache => cache.addAll([OFFLINE_URL, "/icons/icon-192.png"]))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys.filter(k => k !== STATIC_CACHE).map(k => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener("fetch", event => {
  const req = event.request
  if (req.method !== "GET") return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith("/api/")) return

  // Page navigations: network first, offline page if the network is gone.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() =>
        caches.match(OFFLINE_URL).then(r => r ?? Response.error()),
      ),
    )
    return
  }

  // Immutable build assets and icons: cache first.
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/")
  ) {
    event.respondWith(
      caches.match(req).then(
        hit =>
          hit ??
          fetch(req).then(res => {
            if (res.ok) {
              const copy = res.clone()
              caches.open(STATIC_CACHE).then(c => c.put(req, copy))
            }
            return res
          }),
      ),
    )
  }
})
