import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'afus - Moroccan Artisan Marketplace',
    short_name: 'afus',
    description: 'Discover, buy, and track authentic Moroccan artisan crafts directly from the makers with national Cash on Delivery tracking.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#E8583F',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ]
  }
}
