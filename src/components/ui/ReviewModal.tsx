'use client';

import { useState } from 'react';
import { submitReview } from '@/lib/supabase';
import { X, Star } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopId: string;
  productId: string;
  orderId: string;
  reviewerId: string;
  productTitle: string;
  onReviewSubmitted: () => void;
  lang?: string;
}

export default function ReviewModal({
  isOpen,
  onClose,
  shopId,
  productId,
  orderId,
  reviewerId,
  productTitle,
  onReviewSubmitted,
  lang = 'en'
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError(lang === 'fr' ? 'Veuillez sélectionner une note.' : lang === 'ar' ? 'الرجاء تحديد تقييم.' : 'Please select a rating.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await submitReview({
        shop_id: shopId,
        product_id: productId,
        reviewer_id: reviewerId,
        order_id: orderId,
        rating,
        comment
      });
      onReviewSubmitted();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const invertedCornerMask = `
    radial-gradient(circle at top left, transparent 12px, black 13px) top left / 51% 51% no-repeat,
    radial-gradient(circle at top right, transparent 12px, black 13px) top right / 51% 51% no-repeat,
    radial-gradient(circle at bottom left, transparent 12px, black 13px) bottom left / 51% 51% no-repeat,
    radial-gradient(circle at bottom right, transparent 12px, black 13px) bottom right / 51% 51% no-repeat
  `;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-md bg-white p-8 relative"
        style={{
          mask: invertedCornerMask,
          WebkitMask: invertedCornerMask
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-400 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-black mb-2">
          {lang === 'fr' ? 'Laisser un avis' : lang === 'ar' ? 'اترك تقييماً' : 'Leave a Review'}
        </h2>
        <p className="text-sm text-neutral-500 mb-6 line-clamp-2">
          {productTitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-neutral-200 text-neutral-200'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            {error && <p className="text-red-500 text-sm mt-3 font-medium">{error}</p>}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-black">
              {lang === 'fr' ? 'Votre commentaire' : lang === 'ar' ? 'تعليقك' : 'Your comment'}
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={lang === 'fr' ? 'Qu\'avez-vous pensé de cet article ?' : lang === 'ar' ? 'ما رأيك في هذا المنتج؟' : 'What did you think of this item?'}
              className="w-full border border-neutral-200 rounded-xl p-4 bg-neutral-50 focus:bg-white focus:border-black focus:outline-none transition-colors min-h-[120px] resize-none text-sm"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white hover:bg-neutral-800 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                lang === 'fr' ? 'Soumettre l\'avis' : lang === 'ar' ? 'إرسال التقييم' : 'Submit Review'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
