import { MetadataRoute } from 'next';
import { fetchProducts, fetchShops } from '@/lib/supabase';
import { taxonomy } from '@/lib/categories';

const locales = ['en', 'fr', 'ar', 'tz'];
const baseUrl = 'https://afus.ma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemaps: MetadataRoute.Sitemap = [];

  // 1. Static Pages
  const staticPaths = ['', '/search', '/about', '/blog'];
  
  for (const locale of locales) {
    for (const path of staticPaths) {
      sitemaps.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1.0 : 0.8,
      });
    }
  }

  // 2. Categories from Taxonomy
  for (const locale of locales) {
    for (const category of taxonomy) {
      sitemaps.push({
        url: `${baseUrl}/${locale}/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  // 3. Blog Posts (static slugs matching the application's blog entries)
  const blogSlugs = [
    'art-of-moroccan-zellige',
    'weaving-stories-berber-rugs',
    'scent-of-the-medina-spices',
    'leather-tanneries-fes',
    'andalusian-echoes-tetouan',
    'ultimate-gift-guide-artisanal-moroccan-finds',
    'behind-the-brand-magic-in-medina',
    'refresh-home-spring-handcrafted-decor',
  ];
  
  for (const locale of locales) {
    for (const slug of blogSlugs) {
      sitemaps.push({
        url: `${baseUrl}/${locale}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  // 4. Products (loaded dynamically from Supabase / offline fallback)
  try {
    const products = await fetchProducts();
    if (products && Array.isArray(products)) {
      for (const locale of locales) {
        for (const product of products) {
          const id = product.numeric_id || product.id;
          if (id) {
            sitemaps.push({
              url: `${baseUrl}/${locale}/listing/${id}`,
              lastModified: product.created_at ? new Date(product.created_at) : new Date(),
              changeFrequency: 'daily',
              priority: 0.9,
            });
          }
        }
      }
    }
  } catch (e) {
    console.error('Sitemap generator error fetching products:', e);
  }

  // 5. Shops (loaded dynamically from Supabase / offline fallback)
  try {
    const shops = await fetchShops();
    if (shops && Array.isArray(shops)) {
      for (const locale of locales) {
        for (const shop of shops) {
          if (shop.slug) {
            sitemaps.push({
              url: `${baseUrl}/${locale}/shop/${shop.slug}`,
              lastModified: new Date(),
              changeFrequency: 'weekly',
              priority: 0.8,
            });
          }
        }
      }
    }
  } catch (e) {
    console.error('Sitemap generator error fetching shops:', e);
  }

  return sitemaps;
}
