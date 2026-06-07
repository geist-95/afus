import { searchProducts } from '@/lib/supabase';
import { SimpleProductCard } from '@/components/ui/ProductGrid';
import Link from 'next/link';

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { lang } = await params;
  const sp = await searchParams;

  const q = typeof sp.q === 'string' ? sp.q : '';
  const minPrice = typeof sp.minPrice === 'string' ? parseFloat(sp.minPrice) : undefined;
  const maxPrice = typeof sp.maxPrice === 'string' ? parseFloat(sp.maxPrice) : undefined;
  const location = typeof sp.location === 'string' ? sp.location : undefined;
  const sortBy = (typeof sp.sortBy === 'string' ? sp.sortBy : 'relevant') as 'relevant' | 'newest' | 'price_asc' | 'price_desc';

  const results = await searchProducts(q, {
    minPrice,
    maxPrice,
    location,
    sortBy,
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">
          {q ? `Search results for "${q}"` : 'All Products'}
        </h1>
        <p className="text-neutral-500 text-sm mt-1">{results.length} results found</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <form
            className="p-6 sticky top-24 space-y-6"
            style={{
              background: `
                radial-gradient(circle at top left, transparent 12px, #ffffff 13px) top left,
                radial-gradient(circle at top right, transparent 12px, #ffffff 13px) top right,
                radial-gradient(circle at bottom left, transparent 12px, #ffffff 13px) bottom left,
                radial-gradient(circle at bottom right, transparent 12px, #ffffff 13px) bottom right
              `,
              backgroundSize: '51% 51%',
              backgroundRepeat: 'no-repeat',
              filter: 'drop-shadow(0px 0px 1px rgba(0,0,0,0.15)) drop-shadow(0px 4px 12px rgba(0,0,0,0.05))'
            }}
          >
            <input type="hidden" name="q" value={q} />

            {/* Sort By */}
            <div>
              <h3 className="font-bold text-sm mb-3">Sort By</h3>
              <select
                name="sortBy"
                defaultValue={sortBy}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              >
                <option value="relevant">Most Relevant</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            <hr className="border-neutral-100" />

            {/* Location */}
            <div>
              <h3 className="font-bold text-sm mb-3">Location</h3>
              <select
                name="location"
                defaultValue={location || ''}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              >
                <option value="">Anywhere</option>
                <option value="Marrakech">Marrakech</option>
                <option value="Fes">Fes</option>
                <option value="Casablanca">Casablanca</option>
                <option value="Rabat">Rabat</option>
                <option value="Tangier">Tangier</option>
              </select>
            </div>

            <hr className="border-neutral-100" />

            {/* Price */}
            <div>
              <h3 className="font-bold text-sm mb-3">Price Range (MAD)</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  defaultValue={minPrice || ''}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <span className="text-neutral-500">-</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  defaultValue={maxPrice || ''}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm font-semibold py-2 rounded-lg transition-colors"
              >
                Apply Filters
              </button>
            </div>

            {(minPrice || maxPrice || location || sortBy !== 'relevant') && (
              <div className="pt-2">
                <Link
                  href={`/${lang}/search?q=${encodeURIComponent(q)}`}
                  className="text-primary text-xs font-semibold hover:underline block text-center"
                >
                  Clear Filters
                </Link>
              </div>
            )}
          </form>
        </aside>

        {/* Results Grid */}
        <div className="flex-1">
          {results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {results.map((product: any) => (
                <SimpleProductCard
                  key={product.id}
                  product={product}
                  lang={lang}
                  shop={product.shops || product.shop}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-neutral-100">
              <div className="w-16 h-16 bg-neutral-200 text-neutral-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-black mb-2">No results found</h2>
              <p className="text-neutral-500 text-sm max-w-md mx-auto">
                We couldn't find any items matching your search. Try checking your spelling or using less specific keywords.
              </p>
              <Link
                href={`/${lang}`}
                className="inline-block mt-6 px-6 py-2.5 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-colors text-sm"
              >
                Return to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
