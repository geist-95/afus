'use client';

import { useState, useEffect } from 'react';
import ProductGrid from "@/components/ui/ProductGrid";

interface ShopCatalogClientProps {
  initialProducts: any[];
  shop: any;
  lang: string;
}

export default function ShopCatalogClient({ initialProducts, shop, lang }: ShopCatalogClientProps) {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('all');
  const [collections, setCollections] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>(initialProducts);

  useEffect(() => {
    async function loadData() {
      const { fetchCollections } = await import('@/lib/supabase');
      try {
        const shopCols = await fetchCollections(shop.id);
        setCollections(shopCols);
      } catch (e) {
        console.error('Failed to load collections:', e);
      }
    }
    loadData();
  }, [initialProducts, shop.id]);

  // Determine featured products
  const featuredProducts = products.filter(p => p.featured === true || p.metadata?.settings?.featureListing === true);

  // Determine filtered list of products
  let filteredProducts = products;
  if (selectedCollectionId !== 'all') {
    const activeCollection = collections.find(c => c.id === selectedCollectionId);
    if (activeCollection) {
      filteredProducts = products.filter(p => {
        const prodId = p.id?.toString();
        const prodNumId = p.numeric_id?.toString();
        return activeCollection.product_ids.includes(prodId) || activeCollection.product_ids.includes(prodNumId);
      });
    }
  }

  const allLabel = lang === 'fr' ? 'tous' : lang === 'ar' ? 'الكل' : 'all';

  return (
    <div className="space-y-8">
      {/* Featured Items Section */}
      {featuredProducts.length > 0 && selectedCollectionId === 'all' && (
        <div className="space-y-4 pb-6 border-b border-neutral-150">
          <h3 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neutral-900 animate-pulse"></span>
            {lang === 'fr' ? 'Articles en vedette' : lang === 'ar' ? 'المنتجات المميزة' : 'Featured items'}
          </h3>
          <ProductGrid 
            initialProducts={featuredProducts} 
            shops={[shop]} 
            lang={lang} 
            shopFilterId={shop.id}
          />
        </div>
      )}

      {/* Collections Tabs Navigation */}
      {collections.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-2">
          <button
            onClick={() => setSelectedCollectionId('all')}
            className={`px-5 py-2 text-sm font-medium transition-all rounded-full border ${
              selectedCollectionId === 'all' 
                ? 'bg-black text-white border-black shadow-sm' 
                : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300'
            }`}
          >
            {allLabel}
          </button>
          {collections.map(c => {
            const name = c.name_translations?.[lang] || c.name_translations?.en || c.name;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCollectionId(c.id)}
                className={`px-5 py-2 text-sm font-medium transition-all rounded-full border ${
                  selectedCollectionId === c.id 
                    ? 'bg-black text-white border-black shadow-sm' 
                    : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300'
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      )}

      {/* Products Grid */}
      <div className="space-y-4">
        {collections.length > 0 && selectedCollectionId === 'all' && (
          <h3 className="text-lg font-bold text-neutral-800">
            {lang === 'fr' ? 'Tous les produits' : lang === 'ar' ? 'جميع المنتجات' : 'All products'}
          </h3>
        )}
        <ProductGrid 
          initialProducts={filteredProducts} 
          shops={[shop]} 
          lang={lang} 
          shopFilterId={shop.id}
        />
      </div>
    </div>
  );
}
