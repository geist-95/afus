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
    // Load collections from localStorage for this shop
    const localColRaw = localStorage.getItem('local_collections');
    if (localColRaw) {
      try {
        const parsed = JSON.parse(localColRaw);
        if (Array.isArray(parsed)) {
          const shopCols = parsed.filter((c: any) => c.shop_id === shop.id);
          setCollections(shopCols);
        }
      } catch (e) {
        console.error('Failed to parse local collections:', e);
      }
    }

    // Load local products to make sure we filter accurately if a new product is uploaded
    const localRaw = localStorage.getItem('local_products');
    if (localRaw) {
      try {
        const localProducts = JSON.parse(localRaw);
        if (Array.isArray(localProducts)) {
          const shopLocals = localProducts.filter((p) => p && p.shop_id === shop.id);
          const mergedMap = new Map();
          [...shopLocals, ...initialProducts].forEach((p) => {
            const key = p.id || p.numeric_id?.toString();
            if (key) mergedMap.set(key, p);
          });
          setProducts(Array.from(mergedMap.values()));
        }
      } catch (e) {
        console.error('Failed to parse local products:', e);
      }
    }
  }, [initialProducts, shop.id]);

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
    <div className="space-y-6">
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
            const name = c.name_translations[lang] || c.name_translations.en || c.name;
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
      <ProductGrid 
        initialProducts={filteredProducts} 
        shops={[shop]} 
        lang={lang} 
        shopFilterId={shop.id}
      />
    </div>
  );
}
