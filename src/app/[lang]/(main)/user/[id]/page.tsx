'use client';

import { use, useEffect, useState } from "react";
import { fetchProfile, fetchOrders, fetchUserReviews } from "@/lib/supabase";
import Link from "next/link";
import { IconMapPin, IconCalendar, IconUser, IconStar } from "@tabler/icons-react";
import ReviewModal from "@/components/ui/ReviewModal";

interface PageProps {
  params: Promise<{ lang: string; id: string }>;
}

export default function UserProfilePage({ params }: PageProps) {
  const { lang, id } = use(params);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'activity' | 'purchases' | 'favorites'>('activity');
  const [reviews, setReviews] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewContext, setReviewContext] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const tab = searchParams.get('tab');
      if (tab === 'purchases' || tab === 'activity') {
        setActiveTab(tab);
      }
    }
  }, [id]);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProfile(id);
        setProfile(data);

        // Fetch user reviews
        const userReviews = await fetchUserReviews(id);
        setReviews(userReviews);

        // Fetch user purchases (orders)
        const userOrders = await fetchOrders(undefined, id);
        // Flatten order items into purchases
        const items = userOrders.flatMap((order: any) => 
          order.items.map((item: any) => ({
            ...item,
            order_id: order.id,
            shop_id: order.shop_id,
            order_status: order.order_status,
            created_at: order.created_at
          }))
        );
        setPurchases(items);

      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-white"></div>;
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 max-w-[1440px] mx-auto min-h-[50vh]">
        <h1 className="text-2xl font-bold text-black mb-4">User not found</h1>
        <p className="text-neutral-500 mb-6">The profile you are looking for does not exist or has been removed.</p>
        <Link href={`/${lang}`} className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary/90 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  const joinDate = new Date(profile.created_at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : lang === 'ar' ? 'ar-MA' : 'en-US', {
    month: 'long',
    year: 'numeric'
  });

  const shortName = profile.full_name?.split(' ')[0] || 'User';

  return (
    <div className="w-full pb-12 bg-white min-h-screen">
      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
        
        {/* Left Sidebar Profile */}
        <div className="w-full lg:w-[300px] xl:w-[320px] flex-shrink-0 flex flex-col z-10">
          
          {/* Avatar (No overlapping banner) */}
          <div className="flex items-center gap-4 mb-4 relative z-20">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-neutral-200 bg-white overflow-hidden flex-shrink-0 shadow-sm">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
              ) : (
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(shortName)}&background=E8583F&color=fff&size=160&bold=true`} alt="avatar" className="w-full h-full object-cover" />
              )}
            </div>
          </div>
          
          {/* Name */}
          <div className="flex flex-col mt-2">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#111827] leading-tight tracking-tight">
              {profile.full_name || 'Anonymous User'}
            </h1>
          </div>
          
          {/* Badges / Meta Info */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-bold border border-neutral-200 capitalize">
              <IconUser className="w-3.5 h-3.5" />
              {profile.role || 'Member'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[#6b7280] text-sm md:text-base mt-4 mb-4 font-medium">
            <IconCalendar className="w-4 h-4 md:w-5 md:h-5" />
            <span>Joined {joinDate}</span>
          </div>

          {profile.bio ? (
            <p className="text-sm md:text-base text-[#4b5563] leading-relaxed mb-6 font-medium mt-1">
              {profile.bio}
            </p>
          ) : (
            <p className="text-sm md:text-base text-neutral-400 leading-relaxed mb-6 font-medium mt-1 italic">
              No bio provided yet.
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-2">
            <button className="w-full py-3 bg-[#E8583F] hover:bg-[#d44831] text-white font-bold text-sm rounded-full transition-colors flex items-center justify-center gap-2">
              Follow User
            </button>
            <button className="w-full py-3 bg-white border-2 border-black hover:bg-neutral-50 text-black font-bold text-sm rounded-full transition-colors flex items-center justify-center gap-2">
              Message
            </button>
          </div>
          
        </div>

        {/* Main Content: Right Side Tabs & Feed */}
        <div className="flex-1 w-full pt-10 lg:pt-0">
          {/* Behance Style Tab Headers */}
          <div className="flex items-center gap-8 border-b border-neutral-200 pb-3 mb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            <h2 
              onClick={() => setActiveTab('activity')}
              className={`text-sm font-bold pb-3 -mb-[14px] whitespace-nowrap cursor-pointer transition-colors ${activeTab === 'activity' ? 'text-black border-b-2 border-black' : 'text-neutral-400 hover:text-black'}`}
            >
              Activity
            </h2>
            <h2 
              onClick={() => setActiveTab('purchases')}
              className={`text-sm font-bold pb-3 -mb-[14px] whitespace-nowrap cursor-pointer transition-colors ${activeTab === 'purchases' ? 'text-black border-b-2 border-black' : 'text-neutral-400 hover:text-black'}`}
            >
              My Purchases
            </h2>
          </div>

          {activeTab === 'activity' && (
            reviews.length > 0 ? (
              <div className="space-y-6 mt-8">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-neutral-50 rounded-xl p-5 border border-neutral-100 flex flex-col sm:flex-row gap-4 items-start">
                    <div className="w-12 h-12 rounded-md bg-white border border-neutral-200 overflow-hidden flex-shrink-0">
                      <img src={review.product?.media_gallery?.[0] || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'} alt="Product" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-black text-sm">Reviewed <Link href={`/${lang}/shop/${review.shop?.slug || 'shop'}`} className="hover:underline">{review.product?.title_translations?.[lang] || review.product?.title_translations?.en || 'a product'}</Link></span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <IconStar key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-neutral-200 text-neutral-200'}`} />
                        ))}
                        <span className="text-xs text-neutral-400 ml-2">{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-neutral-600 line-clamp-3">"{review.comment}"</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full bg-neutral-50 rounded-2xl border border-neutral-100 p-8 md:p-16 flex flex-col items-center justify-center text-center mt-8">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <IconUser className="w-8 h-8 text-neutral-300" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">No public activity yet</h3>
                <p className="text-sm text-neutral-500 max-w-sm">
                  This user hasn't added any public favorites, collections, or left any reviews.
                </p>
              </div>
            )
          )}

          {activeTab === 'purchases' && (
            purchases.length > 0 ? (
              <div className="space-y-4 mt-8">
                {purchases.map((purchase, idx) => {
                  const hasReviewed = reviews.some(r => r.order_id === purchase.order_id && r.product_id === purchase.product_id);
                  return (
                    <div key={idx} className="bg-white rounded-xl p-5 border border-neutral-200 flex flex-col sm:flex-row gap-5 items-center justify-between">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-16 h-16 bg-neutral-100 rounded-md overflow-hidden flex-shrink-0">
                          <img src={'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'} alt="Product" className="w-full h-full object-cover opacity-50" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-black text-sm line-clamp-1">{purchase.title}</span>
                          <span className="text-xs text-neutral-500 mt-0.5">Purchased on {new Date(purchase.created_at).toLocaleDateString()}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider mt-1.5 w-max px-2 py-0.5 rounded ${purchase.order_status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>
                            {purchase.order_status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                        {purchase.order_status === 'delivered' && !hasReviewed ? (
                          <button
                            onClick={() => {
                              setReviewContext(purchase);
                              setIsReviewModalOpen(true);
                            }}
                            className="w-full sm:w-auto px-5 py-2.5 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition-colors"
                          >
                            Leave a Review
                          </button>
                        ) : hasReviewed ? (
                          <span className="text-xs font-bold text-green-600 flex items-center gap-1 justify-center sm:justify-start">
                            <IconStar className="w-4 h-4 fill-green-600" /> Reviewed
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-neutral-400 italic">Review available after delivery</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-full bg-neutral-50 rounded-2xl border border-neutral-100 p-8 md:p-16 flex flex-col items-center justify-center text-center mt-8">
                <h3 className="text-lg font-bold text-black mb-2">No purchases yet</h3>
                <p className="text-sm text-neutral-500 max-w-sm">
                  You haven't made any purchases on the platform yet.
                </p>
              </div>
            )
          )}
        </div>

      </div>

      {reviewContext && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          shopId={reviewContext.shop_id}
          productId={reviewContext.product_id}
          orderId={reviewContext.order_id}
          reviewerId={id}
          productTitle={reviewContext.title}
          lang={lang}
          onReviewSubmitted={async () => {
             const userReviews = await fetchUserReviews(id);
             setReviews(userReviews);
          }}
        />
      )}
    </div>
  );
}
