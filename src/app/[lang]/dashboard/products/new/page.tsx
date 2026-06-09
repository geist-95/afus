'use client';

import { useState, useEffect, use } from 'react';
import MediaUploader from '@/components/ui/media-uploader';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getActiveSession } from '@/lib/auth';
import { createProductListing } from '@/lib/supabase';
import { taxonomy, suggestCategories } from '@/lib/categories';
import { DashboardPageSkeleton } from '@/components/ui/Skeleton';
import { X, Search, Package, FileText, ChevronLeft, Info, HelpCircle, Plus, ExternalLink, Copy, MoreHorizontal } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default function NewListingPage({ params }: PageProps) {
  const { lang } = use(params);
  const router = useRouter();

  // Auth States
  const [authLoading, setAuthLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Form State
  const [titleEn, setTitleEn] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [enableAltLangs, setEnableAltLangs] = useState(false);

  const [suggestionQuery, setSuggestionQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedCatId, setSelectedCatId] = useState('');
  const [selectedSubcatId, setSelectedSubcatId] = useState('');

  const [itemType, setItemType] = useState('physical');
  const [whoMadeIt, setWhoMadeIt] = useState('i_did');
  const [whenMade, setWhenMade] = useState('recently');

  const [descEn, setDescEn] = useState('');
  const [descFr, setDescFr] = useState('');
  const [descAr, setDescAr] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);

  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [sku, setSku] = useState('');

  // New Fields from Etsy screenshots
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [materials, setMaterials] = useState('');
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [personalizationInstructions, setPersonalizationInstructions] = useState('');
  const [charLimit, setCharLimit] = useState('256');
  const [personalizationOptional, setPersonalizationOptional] = useState(false);

  // Variations State
  const [hasVariations, setHasVariations] = useState(false);
  const [isVariationsModalOpen, setIsVariationsModalOpen] = useState(false);
  const [variationStep, setVariationStep] = useState(1);
  const [variations, setVariations] = useState<any[]>([]);
  const [currentVariationName, setCurrentVariationName] = useState('');
  const [currentVariationOptions, setCurrentVariationOptions] = useState<any[]>([{ value: '', price: '' }]);
  const [currentVariationOptionInput, setCurrentVariationOptionInput] = useState('');
  const [linkPhotosToVariation, setLinkPhotosToVariation] = useState(false);

  const [pricesVary, setPricesVary] = useState(false);
  const [quantitiesVary, setQuantitiesVary] = useState(false);
  const [skusVary, setSkusVary] = useState(false);

  // Computed combinations for the matrix
  const [variationMatrix, setVariationMatrix] = useState<Record<string, any>>({});

  // Shipping State
  const [shippingProfile, setShippingProfile] = useState({ name: 'Letters', type: 'Fixed', processingTime: '1-3 days processing time, from 91786', activeListings: 21 });
  const [hasItemWeightAndSize, setHasItemWeightAndSize] = useState(true);
  const [itemWeightLb, setItemWeightLb] = useState('');
  const [itemWeightOz, setItemWeightOz] = useState('');
  const [itemSizeLength, setItemSizeLength] = useState('');
  const [itemSizeWidth, setItemSizeWidth] = useState('');
  const [itemSizeHeight, setItemSizeHeight] = useState('');

  // Shipping Modal State
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [shippingPricesType, setShippingPricesType] = useState('Calculate them for me (Recommended)');
  const [originZip, setOriginZip] = useState('12345');
  const [processingTime, setProcessingTime] = useState('Select your processing time...');
  const [shippingService, setShippingService] = useState('Select shipping service');
  const [shippingCharge, setShippingCharge] = useState('Free shipping');

  // Settings State
  const [shopSection, setShopSection] = useState('');
  const [featureListing, setFeatureListing] = useState(false);
  const [returnsPolicy, setReturnsPolicy] = useState('No returns or exchanges');

  const [activeTab, setActiveTab] = useState('about');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const activeUser = await getActiveSession();
      if (!activeUser) {
        router.push(`/${lang}/login?redirect=dashboard/upload/new`);
        return;
      }
      setSession(activeUser);
      setAuthLoading(false);
    }

    checkAuth();
  }, [lang, router]);

  const handleUploadComplete = (urls: string[]) => {
    setMediaUrls(urls);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = tagsInput.trim();
      if (val && tags.length < 13 && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagsInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleCreateListing = async () => {
    setIsSubmitting(true);

    const reverseCategoryMapping: Record<string, string> = {
      'cat_jewelry': '1a111111-1111-1111-1111-111111111111',
      'cat_art_collectibles': '2b222222-2222-2222-2222-222222222222',
      'cat_bath_beauty': '3c333333-3333-3333-3333-333333333333',
      'cat_clothing': '4d444444-4444-4444-4444-444444444444',
      'cat_bags_purses': '5e555555-5555-5555-5555-555555555555',
      'cat_home_living': '6f666666-6666-6666-6666-666666666666',
    };
    const dbCategoryId = reverseCategoryMapping[selectedCatId] || selectedCatId || '1a111111-1111-1111-1111-111111111111';

    const payload = {
      shop_id: session?.shop?.id || (session?.id === 's1_owner' ? 's1' : 's2'),
      category_id: dbCategoryId,
      subcategory_id: selectedSubcatId,
      base_price_mad: parseFloat(price) || 0,
      title_translations: {
        en: titleEn,
        fr: titleFr,
        ar: titleAr,
      },
      description_translations: {
        en: descEn,
        fr: descFr,
        ar: descAr,
      },
      media_gallery: mediaUrls,
      stock_quantity: 1,
      metadata: {
        itemType,
        whoMadeIt,
        whenMade,
        tags,
        materials,
        personalization: showPersonalization ? {
          instructions: personalizationInstructions,
          charLimit: parseInt(charLimit) || 256,
          optional: personalizationOptional
        } : null,
        variations: {
          items: variations,
          pricesVary,
          quantitiesVary,
          skusVary,
          matrix: variationMatrix
        },
        shipping: {
          profile: shippingProfile.name,
          modalData: {
            pricesType: shippingPricesType,
            originZip,
            processingTime,
            service: shippingService,
            charge: shippingCharge
          },
          weight: hasItemWeightAndSize ? { lb: itemWeightLb, oz: itemWeightOz } : null,
          size: hasItemWeightAndSize ? { length: itemSizeLength, width: itemSizeWidth, height: itemSizeHeight } : null
        },
        settings: {
          returnsPolicy,
          shopSection,
          featureListing
        }
      }
    };

    const result = await createProductListing(payload);
    if (result) {
      const localProducts = JSON.parse(localStorage.getItem('local_products') || '[]');
      localProducts.unshift(result);
      localStorage.setItem('local_products', JSON.stringify(localProducts));

      router.push(`/${lang}/dashboard/products`);
    }
    setIsSubmitting(false);
  };

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Generate combinations for Variations Matrix
  const getVariationCombinations = () => {
    if (variations.length === 0) return [];
    if (variations.length === 1) return variations[0].options.map((opt: string) => [opt]);

    const combos: string[][] = [];
    for (const opt1 of variations[0].options) {
      for (const opt2 of variations[1].options) {
        combos.push([opt1, opt2]);
      }
    }
    return combos;
  };

  // Variations Handlers
  const handleVariationPreset = (presetName: string) => {
    setCurrentVariationName(presetName);
    setCurrentVariationOptions([{ value: '', price: '' }]);
    setCurrentVariationOptionInput('');
    setLinkPhotosToVariation(false);
    setVariationStep(2);
  };

  const handleAddVariationOptionRow = () => {
    setCurrentVariationOptions([...currentVariationOptions, { value: '', price: '' }]);
  };

  const handleSaveVariation = () => {
    const validOptions = currentVariationOptions.filter(opt => opt.value.trim() !== '');
    if (currentVariationName && validOptions.length > 0) {
      setVariations([...variations, {
        name: currentVariationName,
        options: validOptions,
        linkPhotos: linkPhotosToVariation
      }]);
      setVariationStep(3);
    }
  };

  const handleDeleteVariation = (indexToRemove: number) => {
    setVariations(variations.filter((_, i) => i !== indexToRemove));
  };

  const openVariationsModal = () => {
    setVariationStep(variations.length > 0 ? 3 : 1);
    setIsVariationsModalOpen(true);
  };

  const closeVariationsModal = () => {
    setIsVariationsModalOpen(false);
  };

  if (authLoading) {
    return <DashboardPageSkeleton />;
  }

  const TABS = [
    { id: 'about', label: 'About' },
    { id: 'price', label: 'Price & Inventory' },
    { id: 'variations', label: 'Variations' },
    { id: 'details', label: 'Details' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-neutral-50 pb-24">
      {/* Top Header (Not Sticky) */}
      <div className="bg-white px-6 py-6 border-b border-neutral-200 flex flex-col justify-center w-full relative z-10">
        <Link href={`/${lang}/dashboard/products`} className="inline-flex items-center text-sm font-bold text-neutral-600 hover:text-black transition-colors mb-4 w-fit">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to listings
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-800 max-w-3xl line-clamp-2">
              {titleEn || 'New listing'}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-2 py-0.5 bg-neutral-200 text-neutral-700 text-xs font-bold rounded-md">Draft</span>
              <span className="text-xs text-neutral-500">Not listed yet</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm font-bold rounded-full transition-colors flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> View on Afus
            </button>
            <button className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm font-bold rounded-full transition-colors flex items-center gap-2">
              <Copy className="w-4 h-4" /> Copy
            </button>
            <button className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation (Sticky) */}
      <div className="sticky top-0 z-20 bg-white border-b border-neutral-200 px-6 py-2 w-full">
        <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`py-2 px-4 text-sm font-bold whitespace-nowrap transition-colors rounded-full ${activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-12">

        {/* ABOUT SECTION */}
        <div id="about" className="space-y-8 bg-white p-8 rounded-xl border border-neutral-200">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">About</h2>
            <p className="text-sm text-neutral-500 mt-1">Tell the world all about your item and why they'll love it.</p>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2 pt-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="block text-neutral-800 font-bold text-sm">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-neutral-500">Include keywords that buyers would use to search for this item.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-500">Translate to other languages</span>
                  <label className="flex items-center cursor-pointer">
                    <div className={`w-10 h-5 rounded-full transition-colors relative ${enableAltLangs ? 'bg-black' : 'bg-neutral-300'}`}>
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${enableAltLangs ? 'translate-x-5' : ''}`} />
                      <input type="checkbox" checked={enableAltLangs} onChange={(e) => setEnableAltLangs(e.target.checked)} className="hidden" />
                    </div>
                  </label>
                </div>
              </div>

              {/* Primary Language */}
              {lang === 'en' && (
                <textarea
                  required
                  rows={2}
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                  placeholder="e.g. Storyteller's Notebook, Personalized Journal..."
                />
              )}
              {lang === 'fr' && (
                <textarea
                  required
                  rows={2}
                  value={titleFr}
                  onChange={(e) => setTitleFr(e.target.value)}
                  className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                  placeholder="ex: Carnet de conteur, Journal personnalisé..."
                />
              )}
              {lang === 'ar' && (
                <textarea
                  required
                  rows={2}
                  value={titleAr}
                  dir="rtl"
                  onChange={(e) => setTitleAr(e.target.value)}
                  className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm text-right"
                  placeholder="مثال: دفتر ملاحظات، مذكرات شخصية..."
                />
              )}
              <div className="text-right text-xs text-neutral-400">
                {(lang === 'en' ? titleEn.length : lang === 'fr' ? titleFr.length : titleAr.length)}/140
              </div>
            </div>

            {enableAltLangs && (
              <div className="grid grid-cols-2 gap-4">
                {lang !== 'en' && (
                  <div className="space-y-2">
                    <label className="block text-neutral-800 font-bold text-sm text-neutral-600">English Title</label>
                    <textarea
                      rows={2}
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm"
                    />
                  </div>
                )}
                {lang !== 'fr' && (
                  <div className="space-y-2">
                    <label className="block text-neutral-800 font-bold text-sm text-neutral-600">French Title</label>
                    <textarea
                      rows={2}
                      value={titleFr}
                      onChange={(e) => setTitleFr(e.target.value)}
                      className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm"
                    />
                  </div>
                )}
                {lang !== 'ar' && (
                  <div className="space-y-2" dir="rtl">
                    <label className="block font-bold text-sm text-neutral-600 text-right">العنوان بالعربية</label>
                    <textarea
                      rows={2}
                      value={titleAr}
                      onChange={(e) => setTitleAr(e.target.value)}
                      className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm text-right"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Category Search */}
            <div className="space-y-2 pt-4 border-t border-neutral-100">
              <label className="block text-neutral-800 font-bold text-sm">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search for a category, e.g. Hats, Rings, Pillows..."
                  value={suggestionQuery}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSuggestionQuery(val);
                    setSuggestions(val.trim() ? suggestCategories(val) : []);
                  }}
                  className="w-full border border-neutral-300 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                />
              </div>

              {suggestions.length > 0 && (
                <div className="border border-neutral-200 rounded-lg mt-2 overflow-hidden bg-white">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedCatId(s.categoryId);
                        setSelectedSubcatId(s.subcategoryId);
                        setSuggestionQuery(`${s.categoryName} > ${s.subcategoryName}`);
                        setSuggestions([]);
                      }}
                      className="w-full text-left p-3 hover:bg-neutral-50 transition-colors flex flex-col border-b border-neutral-100 last:border-0"
                    >
                      <span className="font-bold text-sm text-neutral-800">{s.subcategoryName}</span>
                      <span className="text-xs text-neutral-500">{s.categoryName} &gt; {s.subcategoryName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Core Properties (Advanced Details) */}
            <Accordion type="single" collapsible className="w-full border-t border-neutral-100 pt-4">
              <AccordionItem value="advanced-details" className="border-none">
                <AccordionTrigger className="py-3 hover:no-underline hover:text-black text-neutral-600 font-bold text-sm bg-neutral-50 px-4 rounded-lg">
                  Advanced details (Optional)
                </AccordionTrigger>
                <AccordionContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <label className="block text-neutral-800 font-bold text-sm">Type <span className="text-red-500">*</span></label>
                      <select
                        value={itemType}
                        onChange={(e) => setItemType(e.target.value)}
                        className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm bg-white"
                      >
                        <option value="physical">Physical Item</option>
                        <option value="digital">Digital File</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-neutral-800 font-bold text-sm">Who made it? <span className="text-red-500">*</span></label>
                      <select
                        value={whoMadeIt}
                        onChange={(e) => setWhoMadeIt(e.target.value)}
                        className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm bg-white"
                      >
                        <option value="i_did">I did</option>
                        <option value="member">A member of my shop</option>
                        <option value="another">Another company</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-neutral-800 font-bold text-sm">When was it made? <span className="text-red-500">*</span></label>
                      <select
                        value={whenMade}
                        onChange={(e) => setWhenMade(e.target.value)}
                        className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm bg-white"
                      >
                        <option value="made_to_order">Made To Order</option>
                        <option value="recently">Recently (2020 - 2025)</option>
                        <option value="vintage">Vintage (Before 2005)</option>
                      </select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Photos */}
            <div className="space-y-2 pt-4 border-t border-neutral-100">
              <label className="flex items-center gap-2 text-neutral-800 font-bold text-sm">
                Photos and video <span className="text-red-500">*</span>
                <HelpCircle className="w-4 h-4 text-neutral-400" />
              </label>
              <p className="text-xs text-neutral-500 mb-2">Add up to 10 photos and 1 video.</p>
              <div className="bg-neutral-50 p-6 rounded-xl border-2 border-dashed border-neutral-300 text-center flex flex-col items-center justify-center">
                <MediaUploader onUploadComplete={handleUploadComplete} maxFiles={10} />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 pt-4 border-t border-neutral-100">
              <label className="block text-neutral-800 font-bold text-sm">
                Description <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-neutral-500 mb-2">What makes your item special? Buyers will only see the first few lines unless they expand the description.</p>

              {/* Primary Language */}
              {lang === 'en' && (
                <textarea
                  required
                  rows={5}
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                />
              )}
              {lang === 'fr' && (
                <textarea
                  required
                  rows={5}
                  value={descFr}
                  onChange={(e) => setDescFr(e.target.value)}
                  className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                />
              )}
              {lang === 'ar' && (
                <textarea
                  required
                  rows={5}
                  value={descAr}
                  dir="rtl"
                  onChange={(e) => setDescAr(e.target.value)}
                  className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm text-right"
                />
              )}
            </div>

            {enableAltLangs && (
              <div className="grid grid-cols-2 gap-4">
                {lang !== 'en' && (
                  <div className="space-y-2">
                    <label className="block text-neutral-800 font-bold text-sm text-neutral-600">English Description</label>
                    <textarea
                      rows={3}
                      value={descEn}
                      onChange={(e) => setDescEn(e.target.value)}
                      className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm"
                    />
                  </div>
                )}
                {lang !== 'fr' && (
                  <div className="space-y-2">
                    <label className="block text-neutral-800 font-bold text-sm text-neutral-600">French Description</label>
                    <textarea
                      rows={3}
                      value={descFr}
                      onChange={(e) => setDescFr(e.target.value)}
                      className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm"
                    />
                  </div>
                )}
                {lang !== 'ar' && (
                  <div className="space-y-2" dir="rtl">
                    <label className="block font-bold text-sm text-neutral-600 text-right">الوصف بالعربية</label>
                    <textarea
                      rows={3}
                      value={descAr}
                      onChange={(e) => setDescAr(e.target.value)}
                      className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm text-right"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Personalization */}
            <div className="pt-4 border-t border-neutral-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-neutral-800">Allow buyers to personalize this item</h3>
                  <p className="text-xs text-neutral-500 mt-1">Collect personalized information for this listing.</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <div className={`w-10 h-5 rounded-full transition-colors relative ${showPersonalization ? 'bg-black' : 'bg-neutral-300'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${showPersonalization ? 'translate-x-5' : ''}`} />
                    <input type="checkbox" checked={showPersonalization} onChange={(e) => setShowPersonalization(e.target.checked)} className="hidden" />
                  </div>
                </label>
              </div>

              {showPersonalization && (
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <label className="block text-neutral-800 font-bold text-sm">Instructions for buyers</label>
                    <p className="text-xs text-neutral-500 mb-2">Enter the personalization instructions you want buyers to see.</p>
                    <textarea
                      rows={4}
                      value={personalizationInstructions}
                      onChange={(e) => setPersonalizationInstructions(e.target.value)}
                      placeholder="Include the name you want to include at the bottom of the journal. If you don't want personalization, just leave blank."
                      className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                    />
                    <div className="text-right text-xs text-neutral-400">{personalizationInstructions.length}/256</div>
                  </div>
                  <div className="space-y-2 w-1/2">
                    <label className="block text-neutral-800 font-bold text-sm">Character limit for buyer response <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      value={charLimit}
                      onChange={(e) => setCharLimit(e.target.value)}
                      className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm"
                    />
                  </div>

                  <label className="flex items-center gap-3 pt-4 cursor-pointer">
                    <div className={`w-12 h-6 rounded-full transition-colors relative ${personalizationOptional ? 'bg-black' : 'bg-neutral-300'}`}>
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${personalizationOptional ? 'translate-x-6' : ''}`} />
                      <input type="checkbox" checked={personalizationOptional} onChange={(e) => setPersonalizationOptional(e.target.checked)} className="hidden" />
                    </div>
                    <span className="text-sm font-medium text-neutral-800">Make personalization optional for the buyer</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PRICE & INVENTORY SECTION */}
        <div id="price" className="space-y-8 bg-white p-8 rounded-xl border border-neutral-200">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">Price & Inventory</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-neutral-800 font-bold text-sm">
                Price (MAD) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">MAD</span>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-neutral-300 pl-14 pr-4 py-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-neutral-800 font-bold text-sm">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                placeholder="1"
              />
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full border-t border-neutral-100 pt-4">
            <AccordionItem value="advanced-inventory" className="border-none">
              <AccordionTrigger className="py-3 hover:no-underline hover:text-black text-neutral-600 font-bold text-sm bg-neutral-50 px-4 rounded-lg">
                Advanced inventory settings (Optional)
              </AccordionTrigger>
              <AccordionContent className="pt-6 px-2">
                <div className="space-y-2 max-w-sm">
                  <label className="block text-neutral-800 font-bold text-sm">SKU</label>
                  <p className="text-xs text-neutral-500 mb-2">SKUs are for your use only — buyers won't see them.</p>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm"
                    placeholder="e.g. 123-ABC"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* VARIATIONS */}
        <div id="variations" className="space-y-6 bg-white p-8 rounded-xl border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-800">Variations</h2>
              <p className="text-sm text-neutral-500 mt-1">This item has different options (like sizes or colors).</p>
            </div>
            <label className="flex items-center cursor-pointer">
              <div className={`w-10 h-5 rounded-full transition-colors relative ${hasVariations ? 'bg-black' : 'bg-neutral-300'}`}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${hasVariations ? 'translate-x-5' : ''}`} />
                <input type="checkbox" checked={hasVariations} onChange={(e) => setHasVariations(e.target.checked)} className="hidden" />
              </div>
            </label>
          </div>

          {hasVariations && (
            <div className="pt-4 border-t border-neutral-100 space-y-6">
              {variations.length === 0 && (
                <button
                  onClick={openVariationsModal}
                  className="px-6 py-2.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-bold text-sm rounded-full transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add variations
                </button>
              )}

              {variations.length > 0 && (
                <div className="space-y-4">
                  <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-200">
                    {variations.map((v, idx) => (
                      <div key={idx} className="p-4 flex justify-between items-center bg-white">
                        <div>
                          <h4 className="font-bold text-sm text-neutral-800">{v.name}</h4>
                          <p className="text-xs text-neutral-500 mt-1">{v.options.length} option{v.options.length > 1 ? 's' : ''}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {v.options.map((opt: any, i: number) => (
                              <span key={i} className="px-3 py-1 bg-neutral-100 border border-neutral-200 rounded-full text-xs font-medium text-neutral-700">{opt.value} {opt.price ? `(${opt.price} MAD)` : ''}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    {variations.length < 2 && (
                      <div className="p-4 bg-white">
                        <button
                          onClick={openVariationsModal}
                          className="px-6 py-2.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-bold text-sm rounded-full transition-colors flex items-center gap-2 shadow-sm"
                        >
                          <Plus className="w-4 h-4" /> Add a variation
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-12 h-6 rounded-full transition-colors relative ${pricesVary ? 'bg-black' : 'bg-neutral-300'}`}>
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${pricesVary ? 'translate-x-6' : ''}`} />
                        <input type="checkbox" checked={pricesVary} onChange={(e) => setPricesVary(e.target.checked)} className="hidden" />
                      </div>
                      <span className="text-sm font-medium text-neutral-800">Prices vary</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-12 h-6 rounded-full transition-colors relative ${quantitiesVary ? 'bg-black' : 'bg-neutral-300'}`}>
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${quantitiesVary ? 'translate-x-6' : ''}`} />
                        <input type="checkbox" checked={quantitiesVary} onChange={(e) => setQuantitiesVary(e.target.checked)} className="hidden" />
                      </div>
                      <span className="text-sm font-medium text-neutral-800">Quantities vary</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-12 h-6 rounded-full transition-colors relative ${skusVary ? 'bg-black' : 'bg-neutral-300'}`}>
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${skusVary ? 'translate-x-6' : ''}`} />
                        <input type="checkbox" checked={skusVary} onChange={(e) => setSkusVary(e.target.checked)} className="hidden" />
                      </div>
                      <span className="text-sm font-medium text-neutral-800">SKUs vary</span>
                    </label>
                  </div>

                  {(pricesVary || quantitiesVary || skusVary) && variations.length > 0 && (
                    <div className="pt-6 border-t border-neutral-100">
                      <h3 className="font-bold text-neutral-800 mb-1">Quantity</h3>
                      <p className="text-xs text-neutral-500 mb-4">{getVariationCombinations().length} variants</p>

                      <div className="border border-neutral-200 rounded-xl overflow-hidden">
                        <div className="flex px-4 py-3 text-xs font-bold text-neutral-500 border-b border-neutral-200 bg-neutral-50">
                          <div className="w-12"></div>
                          <div className="flex-1">Variant</div>
                          {pricesVary && <div className="w-32">Price</div>}
                          {quantitiesVary && <div className="w-24">Quantity</div>}
                          {skusVary && <div className="w-32">SKU</div>}
                          <div className="w-16 text-center">Visible</div>
                        </div>
                        <div className="divide-y divide-neutral-200">
                          {getVariationCombinations().map((combo: string[], idx: number) => {
                            const key = combo.join('-');
                            const data = variationMatrix[key] || { price: '', quantity: '', sku: '', visible: true };
                            return (
                              <div key={key} className="flex items-center px-4 py-4 bg-white hover:bg-neutral-50 transition-colors">
                                <div className="w-12">
                                  <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black cursor-pointer" />
                                </div>
                                <div className="flex-1 text-sm text-neutral-700">
                                  {combo.join(' / ')}
                                </div>
                                {pricesVary && (
                                  <div className="w-32 pr-4">
                                    <div className="relative">
                                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">$</span>
                                      <input
                                        type="number"
                                        value={data.price}
                                        onChange={(e) => setVariationMatrix({ ...variationMatrix, [key]: { ...data, price: e.target.value } })}
                                        className="w-full border border-neutral-300 pl-7 pr-3 py-2 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                                      />
                                    </div>
                                  </div>
                                )}
                                {quantitiesVary && (
                                  <div className="w-24 pr-4">
                                    <input
                                      type="number"
                                      value={data.quantity}
                                      onChange={(e) => setVariationMatrix({ ...variationMatrix, [key]: { ...data, quantity: e.target.value } })}
                                      className="w-full border border-neutral-300 px-3 py-2 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                                    />
                                  </div>
                                )}
                                {skusVary && (
                                  <div className="w-32 pr-4">
                                    <input
                                      type="text"
                                      value={data.sku}
                                      onChange={(e) => setVariationMatrix({ ...variationMatrix, [key]: { ...data, sku: e.target.value } })}
                                      className="w-full border border-neutral-300 px-3 py-2 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                                    />
                                  </div>
                                )}
                                <div className="w-16 flex justify-center">
                                  <label className="flex items-center cursor-pointer">
                                    <div className={`w-11 h-6 rounded-full transition-colors relative ${data.visible !== false ? 'bg-black' : 'bg-neutral-300'}`}>
                                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${data.visible !== false ? 'translate-x-5' : ''}`}>
                                        {data.visible !== false && <span className="absolute inset-0 flex items-center justify-center text-[10px] text-black">✓</span>}
                                      </div>
                                      <input
                                        type="checkbox"
                                        checked={data.visible !== false}
                                        onChange={(e) => setVariationMatrix({ ...variationMatrix, [key]: { ...data, visible: e.target.checked } })}
                                        className="hidden"
                                      />
                                    </div>
                                  </label>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* DETAILS SECTION */}
        <div id="details" className="space-y-4 bg-white p-8 rounded-xl border border-neutral-200">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">Details</h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="optional-details" className="border-none">
              <AccordionTrigger className="py-3 hover:no-underline hover:text-black text-neutral-600 font-bold text-sm bg-neutral-50 px-4 rounded-lg">
                Add optional details (helps buyers find your item)
              </AccordionTrigger>
              <AccordionContent className="pt-6 px-2">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-neutral-800 font-bold text-sm">Tags</label>
                    <p className="text-xs text-neutral-500 mb-2">Add up to 13 tags to help people search for your listings.</p>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        disabled={tags.length >= 13}
                        className="flex-1 border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                        placeholder="e.g. Storyteller's Notebook"
                      />
                      <button
                        onClick={() => handleAddTag({ key: 'Enter', preventDefault: () => { } } as any)}
                        className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-sm rounded-lg transition-colors"
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {tags.map((tag, i) => (
                        <span key={i} className="flex items-center gap-1 bg-neutral-100 border border-neutral-200 text-neutral-700 px-3 py-1.5 rounded-full text-sm font-medium">
                          {tag}
                          <button onClick={() => removeTag(tag)} className="text-neutral-400 hover:text-black ml-1"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                      {tags.length > 0 && (
                        <span className="text-xs text-neutral-400 py-1.5 px-2">{13 - tags.length} left</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-neutral-100">
                    <label className="block text-neutral-800 font-bold text-sm">Materials</label>
                    <p className="text-xs text-neutral-500 mb-2">Buyers value transparency—tell them what's used to make your item.</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={materials}
                        onChange={(e) => setMaterials(e.target.value)}
                        className="flex-1 border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                        placeholder="Ingredients, components, etc."
                      />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* SHIPPING SECTION */}
        <div id="shipping" className="space-y-8 bg-white p-8 rounded-xl border border-neutral-200">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">Shipping</h2>
            <p className="text-sm text-neutral-500 mt-1">Give shoppers clear expectations about delivery time and cost by making sure your shipping info is accurate, including the shipping profile and your order processing schedule. You can make updates any time in <Link href={`/${lang}/dashboard/settings`} className="underline hover:text-black">Shipping settings</Link>.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-neutral-800 font-bold text-sm">Shipping option <span className="text-red-500">*</span></label>

              <div className="p-5 border border-neutral-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-800">{shippingProfile.name}</span>
                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] font-bold rounded-md uppercase tracking-wider">{shippingProfile.type}</span>
                  </div>
                  <p className="text-sm text-neutral-500 mt-1">{shippingProfile.processingTime}</p>
                  <p className="text-sm text-neutral-500">{shippingProfile.activeListings} active listings</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setIsShippingModalOpen(true)} className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm font-semibold rounded-full transition-colors">
                    Change
                  </button>
                  <button onClick={() => setIsShippingModalOpen(true)} className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm font-semibold rounded-full transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Edit
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-100 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-neutral-800">Item weight and size</h3>
                <button
                  onClick={() => setHasItemWeightAndSize(!hasItemWeightAndSize)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm font-semibold rounded-full transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> {hasItemWeightAndSize ? 'Remove item weight and size' : 'Add item weight and size'}
                </button>
              </div>

              {hasItemWeightAndSize && (
                <>
                  <div className="space-y-2 max-w-md">
                    <label className="block text-neutral-800 font-bold text-sm">Item weight <span className="text-neutral-500 font-normal">(optional)</span></label>
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={itemWeightLb}
                          onChange={(e) => setItemWeightLb(e.target.value)}
                          className="w-full border border-neutral-300 pr-8 pl-3 py-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">lb</span>
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={itemWeightOz}
                          onChange={(e) => setItemWeightOz(e.target.value)}
                          className="w-full border border-neutral-300 pr-8 pl-3 py-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">oz</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-neutral-800 font-bold text-sm">Item size (when packed) <span className="text-neutral-500 font-normal">(optional)</span></label>
                      <p className="text-xs text-neutral-500 mt-1">Enter the size of the item after it's been prepared for packaging but not yet packaged (for example: folded, but not boxed)</p>
                    </div>
                    <div className="flex gap-4 max-w-2xl mt-2">
                      <div className="space-y-1 flex-1">
                        <label className="block text-xs font-semibold text-neutral-700">Length</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={itemSizeLength}
                            onChange={(e) => setItemSizeLength(e.target.value)}
                            className="w-full border border-neutral-300 pr-8 pl-3 py-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">in</span>
                        </div>
                      </div>
                      <div className="space-y-1 flex-1">
                        <label className="block text-xs font-semibold text-neutral-700">Width</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={itemSizeWidth}
                            onChange={(e) => setItemSizeWidth(e.target.value)}
                            className="w-full border border-neutral-300 pr-8 pl-3 py-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">in</span>
                        </div>
                      </div>
                      <div className="space-y-1 flex-1">
                        <label className="block text-xs font-semibold text-neutral-700">Height</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={itemSizeHeight}
                            onChange={(e) => setItemSizeHeight(e.target.value)}
                            className="w-full border border-neutral-300 pr-8 pl-3 py-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">in</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-neutral-800">Tariff information</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-xl">This information is used to prefill a customs form when you purchase an international Shipping Label on Afus.</p>
              </div>
              <button className="px-5 py-2.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-sm font-semibold rounded-full transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add tariff number
              </button>
            </div>
          </div>
        </div>

        {/* SETTINGS SECTION */}
        <div id="settings" className="space-y-4 bg-white p-8 rounded-xl border border-neutral-200">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">Settings</h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="shop-preferences" className="border-none">
              <AccordionTrigger className="py-3 hover:no-underline hover:text-black text-neutral-600 font-bold text-sm bg-neutral-50 px-4 rounded-lg">
                Shop Preferences (Optional)
              </AccordionTrigger>
              <AccordionContent className="pt-6 px-2">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-neutral-800">Returns and exchanges</h3>

                    <div className="p-5 border border-neutral-200 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-neutral-800 text-sm">{returnsPolicy}</h4>
                          <p className="text-sm text-neutral-500 mt-1">Buyer can contact seller about any issues with an order.</p>
                        </div>
                        <button className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm font-semibold rounded-full transition-colors">
                          Change policy
                        </button>
                      </div>
                      <div className="pt-4 border-t border-neutral-100">
                        <p className="text-xs text-neutral-500">Selling to buyers in the EU? Consider modifying your policy to comply with <span className="border-neutral-400 border-dashed border-b cursor-pointer hover:text-black">EU law</span>.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-neutral-100 grid grid-cols-[200px_1fr] gap-8">
                    <div>
                      <label className="font-bold text-sm text-neutral-800 block">Shop section <span className="text-neutral-500 font-normal">(optional)</span></label>
                      <p className="text-xs text-neutral-500 mt-1">Group related listings into Sections to help shoppers browse (e.g., Bracelets, Father's Day Gifts, Yarn).</p>
                    </div>
                    <div>
                      <select
                        value={shopSection}
                        onChange={(e) => setShopSection(e.target.value)}
                        className="w-full max-w-md border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm bg-white"
                      >
                        <option value="" disabled>Add a section</option>
                        <option value="bracelets">Bracelets</option>
                        <option value="gifts">Gifts</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-neutral-100 grid grid-cols-[200px_1fr] gap-8">
                    <div>
                      <label className="font-bold text-sm text-neutral-800 block">Feature this listing <span className="text-neutral-500 font-normal">(optional)</span></label>
                      <p className="text-xs text-neutral-500 mt-1">Display this listing at the top of your shop's homepage. You can feature up to 4 listings.</p>
                    </div>
                    <div>
                      <div className="inline-flex bg-neutral-100 rounded-full p-1 border border-neutral-200">
                        <button
                          onClick={() => setFeatureListing(true)}
                          className={`px-6 py-1.5 rounded-full text-sm font-bold transition-colors ${featureListing ? 'bg-white shadow-sm text-neutral-800' : 'text-neutral-500 hover:text-neutral-700'}`}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setFeatureListing(false)}
                          className={`px-6 py-1.5 rounded-full text-sm font-bold transition-colors ${!featureListing ? 'bg-white shadow-sm text-neutral-800' : 'text-neutral-500 hover:text-neutral-700'}`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 md:px-8 z-30 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Link href={`/${lang}/dashboard/products`}>
          <button className="px-6 py-3 font-semibold text-sm text-neutral-600 hover:text-black transition-colors rounded-full hover:bg-neutral-100">
            Cancel
          </button>
        </Link>
        <button
          onClick={handleCreateListing}
          disabled={isSubmitting || !titleEn || !price || !selectedCatId}
          className="px-8 py-3 bg-black hover:bg-neutral-800 text-white font-bold text-sm rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isSubmitting ? 'Publishing...' : 'Save and continue'}
        </button>
      </div>

      {/* VARIATIONS MODAL */}
      {isVariationsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeVariationsModal} />

          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {variationStep === 1 && (
              <>
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-neutral-800 mb-2">What type of variation is it?</h2>
                  <p className="text-sm text-neutral-500 mb-8">You can add up to 2 variations. Use the variation types listed here for peak discoverability. You can add a custom variation, but buyers won't see the option in filters.</p>

                  <div className="flex flex-wrap gap-3 mb-8">
                    {['Primary color', 'Secondary color', 'Primary fabric type', 'Secondary fabric type'].map(preset => (
                      <button
                        key={preset}
                        onClick={() => handleVariationPreset(preset)}
                        className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-sm rounded-full transition-colors"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleVariationPreset('')}
                    className="flex items-center gap-2 text-neutral-800 font-bold hover:text-black transition-colors"
                  >
                    <Plus className="w-5 h-5" /> Create your own
                  </button>
                </div>
                <div className="px-8 py-4 bg-neutral-50 rounded-b-2xl border-t border-neutral-100 flex justify-between">
                  <button onClick={closeVariationsModal} className="font-bold text-neutral-600 hover:text-black">Cancel</button>
                </div>
              </>
            )}

            {variationStep === 2 && (
              <>
                <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-neutral-800">
                    {currentVariationName ? currentVariationName : 'Custom variation'}
                  </h2>
                </div>
                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                  <div className="space-y-2">
                    <label className="block text-neutral-800 font-bold text-sm">Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={currentVariationName}
                      onChange={(e) => setCurrentVariationName(e.target.value)}
                      className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm"
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer py-2">
                    <div className={`w-12 h-6 rounded-full transition-colors relative ${linkPhotosToVariation ? 'bg-black' : 'bg-neutral-300'}`}>
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${linkPhotosToVariation ? 'translate-x-6' : ''}`} />
                      <input type="checkbox" checked={linkPhotosToVariation} onChange={(e) => setLinkPhotosToVariation(e.target.checked)} className="hidden" />
                    </div>
                    <span className="text-sm font-medium text-neutral-800">Link photos to this variation</span>
                  </label>

                  <div className="space-y-2 border-t border-neutral-100 pt-6">
                    <label className="flex items-center gap-2 text-neutral-800 font-bold text-sm">
                      Options <HelpCircle className="w-4 h-4 text-neutral-400" />
                    </label>
                    <p className="text-xs text-neutral-500 mb-4">Buyers can choose from the following options. Use the options listed here for peak discoverability. Buyers won't see custom options in filters.</p>

                    {currentVariationOptions.length > 0 && (
                      <div className="space-y-3 mt-4 mb-4">
                        <div className="flex px-1 text-xs font-bold text-neutral-800">
                          <div className="flex-1">Option Name</div>
                          <div className="w-32">Price (MAD)</div>
                          <div className="w-10"></div>
                        </div>
                        {currentVariationOptions.map((opt, i) => (
                          <div key={i} className="flex gap-4 items-center">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={opt.value}
                                onChange={(e) => {
                                  const newOpts = [...currentVariationOptions];
                                  newOpts[i].value = e.target.value;
                                  setCurrentVariationOptions(newOpts);
                                }}
                                className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm bg-neutral-50"
                                placeholder="e.g. Style 1"
                              />
                            </div>
                            <div className="w-32">
                              <input
                                type="number"
                                value={opt.price}
                                onChange={(e) => {
                                  const newOpts = [...currentVariationOptions];
                                  newOpts[i].price = e.target.value;
                                  setCurrentVariationOptions(newOpts);
                                }}
                                className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm bg-neutral-50"
                                placeholder="0"
                              />
                            </div>
                            <button onClick={() => setCurrentVariationOptions(prev => prev.filter((_, idx) => idx !== i))} className="w-10 flex justify-center text-neutral-400 hover:text-black">
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={handleAddVariationOptionRow}
                      className="px-6 py-2.5 border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-sm rounded-full transition-colors"
                    >
                      Add Option
                    </button>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 rounded-b-2xl flex justify-between items-center">
                  <button onClick={() => setVariationStep(variations.length > 0 ? 3 : 1)} className="px-4 py-2 font-bold text-neutral-600 hover:text-black">Cancel</button>
                  <div className="flex items-center gap-4">
                    {currentVariationOptions.length === 0 && <span className="text-sm text-neutral-500">Add at least 1 option</span>}
                    <button
                      onClick={handleSaveVariation}
                      disabled={!currentVariationName || currentVariationOptions.length === 0}
                      className="px-6 py-2.5 bg-black text-white font-bold rounded-full disabled:opacity-50"
                    >
                      Save and continue
                    </button>
                  </div>
                </div>
              </>
            )}

            {variationStep === 3 && (
              <>
                <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-neutral-800">Manage variations</h2>
                  <button onClick={closeVariationsModal} className="p-2 hover:bg-neutral-100 rounded-full text-neutral-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto space-y-6">
                  {variations.map((v, idx) => (
                    <div key={idx} className="border border-neutral-200 rounded-xl p-4 flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-neutral-800">{v.name}</h4>
                        <p className="text-xs text-neutral-500 mb-2">{v.options.length} options</p>
                        <div className="flex flex-wrap gap-2">
                          {v.options.map((opt: any, i: number) => (
                            <span key={i} className="px-3 py-1 bg-white border border-neutral-200 rounded-full text-xs font-medium">{opt.value} {opt.price ? `(${opt.price} MAD)` : ''}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleDeleteVariation(idx)} className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-600"><X className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}

                  {variations.length < 2 && (
                    <button
                      onClick={() => setVariationStep(1)}
                      className="px-6 py-2.5 border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-bold text-sm rounded-full flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add a variation
                    </button>
                  )}

                  <div className="border-t border-neutral-100 pt-6 space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-12 h-6 rounded-full transition-colors relative ${pricesVary ? 'bg-black' : 'bg-neutral-300'}`}>
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${pricesVary ? 'translate-x-6' : ''}`} />
                        <input type="checkbox" checked={pricesVary} onChange={(e) => setPricesVary(e.target.checked)} className="hidden" />
                      </div>
                      <span className="font-bold text-sm text-neutral-800">Prices vary</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-12 h-6 rounded-full transition-colors relative ${quantitiesVary ? 'bg-black' : 'bg-neutral-300'}`}>
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${quantitiesVary ? 'translate-x-6' : ''}`} />
                        <input type="checkbox" checked={quantitiesVary} onChange={(e) => setQuantitiesVary(e.target.checked)} className="hidden" />
                      </div>
                      <span className="font-bold text-sm text-neutral-800">Quantities vary</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-12 h-6 rounded-full transition-colors relative ${skusVary ? 'bg-black' : 'bg-neutral-300'}`}>
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${skusVary ? 'translate-x-6' : ''}`} />
                        <input type="checkbox" checked={skusVary} onChange={(e) => setSkusVary(e.target.checked)} className="hidden" />
                      </div>
                      <span className="font-bold text-sm text-neutral-800">SKUs vary</span>
                    </label>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 rounded-b-2xl flex justify-between">
                  <button onClick={closeVariationsModal} className="font-bold text-neutral-600 hover:text-black">Cancel</button>
                  <button onClick={closeVariationsModal} className="px-6 py-2 bg-black text-white font-bold rounded-full">Save and continue</button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* SHIPPING MODAL */}
      {isShippingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsShippingModalOpen(false)} />

          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-800">Create shipping option</h2>
                <p className="text-sm text-neutral-500 mt-2">We use these settings to calculate shipping costs and estimated delivery dates for buyers. Learn about shipping settings and estimated delivery dates.</p>
              </div>
              <button onClick={() => setIsShippingModalOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full text-neutral-500 self-start shrink-0 ml-4">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8 flex-1">
              <div className="grid grid-cols-[200px_1fr] gap-8">
                <div>
                  <label className="font-bold text-sm text-neutral-800 block">Shipping prices <span className="text-red-500">*</span></label>
                  <p className="text-xs text-neutral-500 mt-1">Let us calculate them or enter fixed prices yourself</p>
                </div>
                <div className="space-y-2">
                  <select
                    value={shippingPricesType}
                    onChange={(e) => setShippingPricesType(e.target.value)}
                    className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm bg-white"
                  >
                    <option value="Calculate them for me (Recommended)">Calculate them for me (Recommended)</option>
                    <option value="I'll enter fixed prices manually">I'll enter fixed prices manually</option>
                  </select>
                  <div className="bg-neutral-100 p-4 rounded-lg text-sm text-neutral-600">
                    Shoppers will see prices based on their location and the weight and dimensions of the listing. <span className="underline cursor-pointer">How it works</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[200px_1fr] gap-8 border-t border-neutral-100 pt-8">
                <div>
                  <label className="font-bold text-sm text-neutral-800 block">Origin ZIP code <span className="text-red-500">*</span></label>
                  <p className="text-xs text-neutral-500 mt-1">Where will your orders ship from—home, the post office, or another location?</p>
                </div>
                <div>
                  <input
                    type="text"
                    value={originZip}
                    onChange={(e) => setOriginZip(e.target.value)}
                    className="w-32 border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-[200px_1fr] gap-8 border-t border-neutral-100 pt-8">
                <div>
                  <label className="font-bold text-sm text-neutral-800 block">Processing time <span className="text-red-500">*</span></label>
                  <p className="text-xs text-neutral-500 mt-1">How much time do you need to prepare an order and put it in the mail? Keep in mind, shoppers have shown they're more likely to buy items that ship quickly.</p>
                </div>
                <div className="space-y-2">
                  <select
                    value={processingTime}
                    onChange={(e) => setProcessingTime(e.target.value)}
                    className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm bg-white"
                  >
                    <option value="Select your processing time..." disabled>Select your processing time...</option>
                    <option value="1 day">1 day</option>
                    <option value="1-2 days">1-2 days</option>
                    <option value="1-3 days">1-3 days</option>
                    <option value="3-5 days">3-5 days</option>
                    <option value="5-7 days">5-7 days</option>
                    <option value="Custom range">Custom range</option>
                  </select>
                  <p className="text-sm text-neutral-600">Your shop's order processing schedule is set to include: Monday–Friday.</p>
                </div>
              </div>

              <div className="grid grid-cols-[200px_1fr] gap-8 border-t border-neutral-100 pt-8">
                <div>
                  <label className="font-bold text-sm text-neutral-800 block">Standard shipping <span className="text-red-500">*</span></label>
                  <p className="text-xs text-neutral-500 mt-1">Where will you ship to? We'll show your listings to shoppers in the countries you add here. <span className="underline cursor-pointer">Estimate your shipping costs</span></p>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-neutral-200 pb-2">
                    <span className="font-bold text-neutral-800 text-sm">United States</span>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-700">Shipping service</label>
                      <select
                        value={shippingService}
                        onChange={(e) => setShippingService(e.target.value)}
                        className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm bg-white"
                      >
                        <option value="Select shipping service" disabled>Select shipping service</option>
                        <optgroup label="Frequently used">
                          <option value="Standard Delivery (3-5 business days)">Standard Delivery (3-5 business days)</option>
                          <option value="Express Delivery (1-2 business days)">Express Delivery (1-2 business days)</option>
                        </optgroup>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-700">What you'll charge</label>
                      <select
                        value={shippingCharge}
                        onChange={(e) => setShippingCharge(e.target.value)}
                        className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm bg-white"
                      >
                        <option value="Free shipping">Free shipping</option>
                        <option value="Fixed price">Fixed price</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="px-8 py-4 border-t border-neutral-200 bg-neutral-50 rounded-b-2xl flex justify-between items-center">
              <button onClick={() => setIsShippingModalOpen(false)} className="font-bold text-neutral-600 hover:text-black transition-colors">Cancel</button>
              <button onClick={() => setIsShippingModalOpen(false)} className="px-6 py-2 bg-black text-white font-bold rounded-full hover:bg-neutral-800 transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
