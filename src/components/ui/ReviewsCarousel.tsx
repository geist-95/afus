'use client';

import { useEffect, useRef, useState } from 'react';

const reviews = [
  {
    name: 'Aspen Siphron',
    avatar: 'https://i.pravatar.cc/150?img=47',
    date: 'May 12, 2024',
    rating: 4.9,
    text: "The LuxeBar Eleganza exceeded my expectations in every way. Not only does it look stunning in my kitchen, but it's also incredibly comfortable to sit in, even for extended periods. The plush cushioning and supportive backrest make it the perfect spot for enjoying my morning coffee. Highly recommend.",
    product: 'Handcrafted Cedar Box',
    shop: 'Atlas Artisanat',
  },
  {
    name: 'Kierra Calzoni',
    avatar: 'https://i.pravatar.cc/150?img=32',
    date: 'May 11, 2024',
    rating: 5.0,
    text: "Absolutely love this product. It matches the description perfectly and the artisan was very communicative throughout the shipping process. The quality of the materials is top notch and you can really see the craftsmanship.",
    product: 'Berber Wool Rug',
    shop: 'Dar Zitoun',
  },
  {
    name: 'Youssef Alami',
    avatar: 'https://i.pravatar.cc/150?img=12',
    date: 'Apr 28, 2024',
    rating: 4.8,
    text: "Ordered a custom leather bag and it arrived beautifully packaged. The stitching is perfect and the smell of genuine leather is amazing. Will definitely order again — this is what authentic Moroccan craftsmanship looks like.",
    product: 'Leather Satchel',
    shop: 'Souk Cuir',
  },
  {
    name: 'Nadia Benchekroun',
    avatar: 'https://i.pravatar.cc/150?img=56',
    date: 'Apr 18, 2024',
    rating: 5.0,
    text: "I bought a zellige mirror for my living room and it's absolutely stunning. The colors are vivid, the delivery was fast, and the packaging protected everything perfectly. Everyone who visits asks where I got it — truly a conversation piece.",
    product: 'Zellige Wall Mirror',
    shop: 'Maison Berbère',
  },
  {
    name: 'Omar El Fassi',
    avatar: 'https://i.pravatar.cc/150?img=68',
    date: 'Apr 5, 2024',
    rating: 4.9,
    text: "The argan oil I received is 100% pure — you can tell just from the smell and texture. Came with a handwritten note from the cooperative. A rare find online. Highly recommended for anyone looking for authentic Moroccan beauty products.",
    product: 'Pure Argan Oil',
    shop: 'Coopérative Tidzi',
  },
  {
    name: 'Sara Lamrani',
    avatar: 'https://i.pravatar.cc/150?img=23',
    date: 'Mar 22, 2024',
    rating: 5.0,
    text: "Beautiful handpainted pottery set — the colors are exactly as shown, the glaze is smooth, and the shapes are perfectly balanced. This is quality you simply can't find in mass-market shops. Thrilled with my purchase.",
    product: 'Painted Pottery Set',
    shop: 'Fès El Bali Crafts',
  },
];

// Duplicate for seamless loop
const ITEMS = [...reviews, ...reviews];

interface ReviewsCarouselProps {
  lang?: string;
}

export default function ReviewsCarousel({ lang = 'en' }: ReviewsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const posRef = useRef(0);
  const rafRef = useRef<number>(0);
  const speedPx = 0.6; // px per frame

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const step = () => {
      if (!paused) {
        posRef.current += speedPx;
        // Reset when we've scrolled one full set
        const halfWidth = track.scrollWidth / 2;
        if (posRef.current >= halfWidth) {
          posRef.current = 0;
        }
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused]);


  const headingMap: Record<string, string> = {
    en: 'What buyers are saying',
    fr: 'Ce que disent les acheteurs',
    ar: 'ما يقوله المشترون',
  };

  const subMap: Record<string, string> = {
    en: 'Trusted by artisan lovers across Morocco',
    fr: 'La confiance de passionnés d\'artisanat à travers le Maroc',
    ar: 'يثق به عشاق الحرف اليدوية في جميع أنحاء المغرب',
  };

  return (
    <section className="py-4 overflow-hidden">
      {/* Section header */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Verified Reviews</p>
          <h2 className="text-2xl md:text-3xl font-bold text-black leading-tight">
            {headingMap[lang] ?? headingMap.en}
          </h2>
          <p className="text-sm text-neutral-500 mt-1">{subMap[lang] ?? subMap.en}</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-neutral-700 bg-neutral-50 border border-neutral-200 px-4 py-2 rounded-full">
          <span className="text-yellow-400 text-base">★</span>
          <span>4.9</span>
          <span className="text-neutral-400 font-normal">· 2,400+ reviews</span>
        </div>
      </div>

      {/* Carousel track */}
      <div
        className="relative select-none"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-white to-transparent" />

        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-5 will-change-transform"
            style={{ width: 'max-content' }}
          >
            {ITEMS.map((review, idx) => (
              <div
                key={idx}
                className="w-[320px] md:w-[360px] flex-shrink-0"
              >
                {/* Card — matching onboarding modal review design */}
                <div className="arabic-frame bg-neutral-200 p-[1px] h-full">
                  <div className="arabic-frame bg-white p-6 space-y-4 h-full flex flex-col">

                    {/* Stars + rating */}
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg
                          key={i}
                          viewBox="0 0 20 20"
                          fill={i < Math.floor(review.rating) ? '#FBBF24' : 'none'}
                          stroke="#FBBF24"
                          strokeWidth={i < Math.floor(review.rating) ? 0 : 1.5}
                          className="w-4 h-4"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-xs font-bold text-black">{review.rating.toFixed(1)}</span>
                    </div>

                    {/* Italic quote */}
                    <p className="text-base text-neutral-700 leading-relaxed flex-1 line-clamp-4">
                      &ldquo;{review.text}&rdquo;
                    </p>

                    {/* Divider + avatar + name + product */}
                    <div className="flex items-center gap-2.5 pt-3 border-t border-neutral-100">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-black truncate">{review.name}</p>
                        <p className="text-[10px] text-neutral-500 truncate">
                          {review.product} · {review.shop}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
