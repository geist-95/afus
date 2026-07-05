'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getActiveSession, loginUser, registerUser, createShopForExistingUser, UserSession } from '@/lib/auth';
import { checkShopSlugAvailable, uploadImage, createProductListing, staticCategories } from '@/lib/supabase';
import {
  IconX,
  IconBuildingStore,
  IconUser,
  IconMail,
  IconLock,
  IconPhone,
  IconMapPin,
  IconCheck,
  IconArrowRight,
  IconArrowLeft,
  IconSparkles,
  IconStar,
  IconPackage,
  IconTruck,
  IconShield,
  IconSelector,
  IconDiamond,
  IconShirt,
  IconHome,
  IconPalette,
  IconTool,
  IconDeviceMobile,
  IconGift,
  IconBook,
  IconShoe,
  IconDog,
  IconBabyCarriage,
  IconBath,
  IconShoppingBag,
  IconHeart,
  IconPuzzle,
  IconConfetti,
  IconChevronDown,
  IconPlus
} from '@tabler/icons-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

interface ProductFirstOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

type Step = 'step1' | 'step_category' | 'step2' | 'account' | 'success';

const STEPS: Step[] = ['step1', 'step_category', 'step2', 'account', 'success'];

const CATEGORY_ICONS: Record<string, any> = {
  'cat_jewelry': IconDiamond,
  'cat_clothing': IconShirt,
  'cat_home_living': IconHome,
  'cat_art_collectibles': IconPalette,
  'cat_craft_supplies': IconTool,
  'cat_electronics': IconDeviceMobile,
  'cat_gifts': IconGift,
  'cat_books_media': IconBook,
  'cat_shoes': IconShoe,
  'cat_pet_supplies': IconDog,
  'cat_kids_baby': IconBabyCarriage,
  'cat_bath_beauty': IconBath,
  'cat_bags_purses': IconShoppingBag,
  'cat_accessories': IconDiamond,
  'cat_weddings': IconHeart,
  'cat_toys_games': IconPuzzle,
  'cat_paper_party': IconConfetti,
};

const labels: Record<string, Record<string, string>> = {
  en: {
    // Welcome
    welcomeTitle: 'List your first product',
    welcomeSubtitle: 'Join hundreds of Moroccan artisans and connect directly with buyers across the country.',
    feat1: 'Free to list your products',
    feat2: 'Cash on delivery via Amana',
    feat3: 'Secure & verified platform',
    feat4: 'Reach buyers nationwide',
    getStarted: 'Get started',
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign in',
    // Account
    accountTitle: 'Finalization',
    accountSubtitle: 'Last step to create your shop.',
    fullName: 'Full name',
    email: 'Email address',
    password: 'Password',
    phone: 'Phone number',
    next: 'Continue',
    // Store
    storeTitle: 'Name your shop',
    storeSubtitle: 'This is what buyers will see when visiting your storefront.',
    shopName: 'Shop name',
    shopNamePlaceholder: 'e.g. Atlas Artisanat',
    shopDesc: 'Short description (optional)',
    shopDescPlaceholder: 'Tell buyers what makes your shop unique...',
    // Product
    productTitle: 'List your product',
    productSubtitle: 'Add your first craft so buyers can see what you sell immediately.',
    productName: 'Product title',
    productNamePlaceholder: 'e.g. Handwoven Berber Wool Rug',
    productPrice: 'Price (MAD)',
    productPricePlaceholder: 'e.g. 450',
    productImage: 'Product photo',
    productImageHelp: 'Upload a clear photo of your craft.',
    productCategory: 'Category',
    productCategoryPlaceholder: 'Select category...',
    skipStep: 'Skip this step',
    // Location
    locationTitle: 'Where are you based?',
    locationSubtitle: 'Help buyers discover your crafts and plan local pickups.',
    city: 'City',
    address: 'Pickup address',
    addressPlaceholder: 'e.g. 32 Derb Snan, Bab Doukkala',
    createShop: 'Open my shop',
    // Summary
    summaryTitle: 'Review details',
    summarySubtitle: 'Make sure everything looks good before launching your shop.',
    creating: 'Creating...',
    selectCity: 'Select your city...',
    defaultShopDesc: 'Your artisan shop on afus',
    // Success
    successTitle: 'Your shop is open!',
    successSubtitle: 'Congratulations! You are now a verified artisan on afus. Start adding your first products.',
    viewMyProduct: 'View my product listing',
    addProduct: 'Add first product',
    goToDashboard: 'Go to dashboard',
    // Misc
    back: 'Back',
    step: 'Step',
    of: 'of',
    or: 'or',
    loginEmail: 'Email',
    loginPassword: 'Password',
    signinBtn: 'Sign in',
    switchToRegister: 'Create account',
    errFillFields: 'Please fill all fields.',
    errLoginFailed: 'Login failed.',
    errFillRequired: 'Please fill all required fields.',
    errPasswordLength: 'Password must be at least 6 characters.',
    errShopNameEmpty: 'Please enter a shop name.',
    errShopNameLength: 'Shop name must be between 4 and 20 characters.',
    errShopNameFormat: 'Shop name can only contain letters, numbers, and spaces (no special characters or emojis).',
    errShopNameTaken: 'This shop name is already taken.',
    errVerifyingShop: 'Error verifying shop name.',
    errSelectCity: 'Please select your city.',
    errCreateShopFailed: 'Failed to create shop. Please try again.',
  },
  fr: {
    welcomeTitle: 'Ajoutez votre premier produit',
    welcomeSubtitle: 'Rejoignez des centaines d\'artisans marocains et connectez-vous directement aux acheteurs.',
    feat1: 'Publication gratuite',
    feat2: 'Paiement à la livraison via Amana',
    feat3: 'Plateforme sécurisée et vérifiée',
    feat4: 'Atteignez des acheteurs partout',
    getStarted: 'Commencer',
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    signIn: 'Se connecter',
    accountTitle: 'Finalisation',
    accountSubtitle: 'Dernière étape pour créer votre boutique.',
    fullName: 'Nom complet',
    email: 'Adresse e-mail',
    password: 'Mot de passe',
    phone: 'Numéro de téléphone',
    next: 'Continuer',
    storeTitle: 'Nommez votre boutique',
    storeSubtitle: 'C\'est ce que les acheteurs verront en visitant votre boutique.',
    shopName: 'Nom de la boutique',
    shopNamePlaceholder: 'ex. Maison Artisanale',
    shopDesc: 'Description courte (optionnel)',
    shopDescPlaceholder: 'Dites aux acheteurs ce qui rend votre boutique unique...',
    // Product
    productTitle: 'Ajoutez votre produit',
    productSubtitle: 'Ajoutez votre première création pour que les acheteurs voient immédiatement ce que vous vendez.',
    productName: 'Nom du produit',
    productNamePlaceholder: 'ex. Tapis berbère en laine fait main',
    productPrice: 'Prix (MAD)',
    productPricePlaceholder: 'ex. 450',
    productImage: 'Photo du produit',
    productImageHelp: 'Téléchargez une photo claire de votre produit.',
    productCategory: 'Catégorie',
    productCategoryPlaceholder: 'Sélectionnez une catégorie...',
    skipStep: 'Passer cette étape',
    locationTitle: 'Où êtes-vous basé ?',
    locationSubtitle: 'Aidez les acheteurs à découvrir vos artisanats.',
    city: 'Ville',
    address: 'Adresse de retrait',
    addressPlaceholder: 'ex. 15 Derb El Mitar, Fès El Bali',
    createShop: 'Ouvrir ma boutique',
    summaryTitle: 'Vérifier les détails',
    summarySubtitle: 'Assurez-vous que tout est correct avant de lancer votre boutique.',
    creating: 'Création...',
    selectCity: 'Sélectionnez votre ville...',
    defaultShopDesc: 'Votre boutique d\'artisan sur afus',
    successTitle: 'Votre boutique est ouverte !',
    successSubtitle: 'Félicitations ! Vous êtes maintenant un artisan certifié sur afus.',
    viewMyProduct: 'Voir mon produit',
    addProduct: 'Ajouter le premier produit',
    goToDashboard: 'Tableau de bord',
    back: 'Retour',
    step: 'Étape',
    of: 'sur',
    or: 'ou',
    loginEmail: 'E-mail',
    loginPassword: 'Mot de passe',
    signinBtn: 'Se connecter',
    switchToRegister: 'Créer un compte',
    errFillFields: 'Veuillez remplir tous les champs.',
    errLoginFailed: 'Échec de la connexion.',
    errFillRequired: 'Veuillez remplir tous les champs obligatoires.',
    errPasswordLength: 'Le mot de passe doit comporter au moins 6 caractères.',
    errShopNameEmpty: 'Veuillez entrer un nom de boutique.',
    errShopNameLength: 'Le nom de la boutique doit comporter entre 4 et 20 caractères.',
    errShopNameFormat: 'Le nom de la boutique ne peut contenir que des lettres, des chiffres et des espaces (pas de caractères spéciaux ni d\'émojis).',
    errShopNameTaken: 'Ce nom de boutique est déjà pris.',
    errVerifyingShop: 'Erreur lors de la vérification du nom de la boutique.',
    errSelectCity: 'Veuillez sélectionner votre ville.',
    errCreateShopFailed: 'Échec de la création de la boutique. Veuillez réessayer.',
  },
  ar: {
    welcomeTitle: 'أضف منتجك الأول',
    welcomeSubtitle: 'انضم إلى مئات الحرفيين المغاربة وتواصل مباشرة مع المشترين في جميع أنحاء البلاد.',
    feat1: 'إدراج المنتجات مجاناً',
    feat2: 'الدفع عند الاستلام عبر أمانة',
    feat3: 'منصة آمنة وموثقة',
    feat4: 'الوصول إلى المشترين في كل مكان',
    getStarted: 'ابدأ الآن',
    alreadyHaveAccount: 'هل لديك حساب بالفعل؟',
    signIn: 'تسجيل الدخول',
    accountTitle: 'إتمام',
    accountSubtitle: 'الخطوة الأخيرة لإنشاء متجرك.',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    phone: 'رقم الهاتف',
    next: 'متابعة',
    storeTitle: 'سمِّ متجرك',
    storeSubtitle: 'هذا ما سيراه المشترون عند زيارة متجرك.',
    shopName: 'اسم المتجر',
    shopNamePlaceholder: 'مثال: أطلس للحرف اليدوية',
    shopDesc: 'وصف قصير (اختياري)',
    shopDescPlaceholder: 'أخبر المشترين بما يميز متجرك...',
    // Product
    productTitle: 'أضف منتجك الأول',
    productSubtitle: 'أضف أول قطعة من إبداعك ليتمكن المشترون من رؤية ما تبيعه على الفور.',
    productName: 'اسم المنتج',
    productNamePlaceholder: 'مثال: سجادة بربرية من الصوف مغزولة يدويًا',
    productPrice: 'السعر (بالدرهم)',
    productPricePlaceholder: 'مثال: 450',
    productImage: 'صورة المنتج',
    productImageHelp: 'قم بتحميل صورة واضحة لمنتجك.',
    productCategory: 'التصنيف',
    productCategoryPlaceholder: 'اختر التصنيف...',
    skipStep: 'تخطي هذه الخطوة',
    locationTitle: 'أين أنت موجود؟',
    locationSubtitle: 'ساعد المشترين في اكتشاف حرفك.',
    city: 'المدينة',
    address: 'عنوان الاستلام',
    addressPlaceholder: 'مثال: درب سنان، باب دكالة',
    createShop: 'افتح متجري',
    summaryTitle: 'مراجعة التفاصيل',
    summarySubtitle: 'تأكد من صحة كل شيء قبل إطلاق متجرك.',
    creating: 'جاري الإنشاء...',
    selectCity: 'اختر مدينتك...',
    defaultShopDesc: 'متجرك الحرفي على أفوس',
    successTitle: 'متجرك مفتوح!',
    successSubtitle: 'تهانينا! أنت الآن حرفي موثق على أفوس.',
    viewMyProduct: 'عرض منتجي',
    addProduct: 'أضف أول منتج',
    goToDashboard: 'لوحة التحكم',
    back: 'رجوع',
    step: 'خطوة',
    of: 'من',
    or: 'أو',
    loginEmail: 'البريد الإلكتروني',
    loginPassword: 'كلمة المرور',
    signinBtn: 'تسجيل الدخول',
    switchToRegister: 'إنشاء حساب',
    errFillFields: 'يرجى ملء جميع الحقول.',
    errLoginFailed: 'فشل تسجيل الدخول.',
    errFillRequired: 'يرجى ملء جميع الحقول المطلوبة.',
    errPasswordLength: 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.',
    errShopNameEmpty: 'يرجى إدخال اسم المتجر.',
    errShopNameLength: 'يجب أن يتراوح طول اسم المتجر بين 4 و 20 حرفًا.',
    errShopNameFormat: 'يمكن أن يحتوي اسم المتجر على أحرف وأرقام فقط (بدون مسافات أو رموز خاصة أو رموز تعبيرية).',
    errShopNameTaken: 'اسم المتجر هذا مستخدم بالفعل.',
    errVerifyingShop: 'خطأ في التحقق من اسم المتجر.',
    errSelectCity: 'يرجى تحديد مدينتك.',
    errCreateShopFailed: 'فشل في إنشاء المتجر. يرجى المحاولة مرة أخرى.',
  },
  tz: {
    welcomeTitle: 'ⵔⵏⵓ ⴰⴼⴰⵔⵉⵙ ⵏⵏⴽ ⴰⵎⵣⵡⴰⵔⵓ',
    welcomeSubtitle: 'ⵎⵓⵏ ⴷ ⵜⵉⵎⴰⴹ ⵏ ⵉⵏⴰⵥⵓⵕⵏ ⵉⵎⵖⵔⵉⴱⵉⵢⵏ ⴷ ⵎⵙⴰⵡⴰⴹ ⵙ ⵓⵙⵔⵉⴷ ⴷ ⵉⵎⵙⵖⴰⵏ ⴳ ⵜⵎⵓⵔⵜ ⴰⴽⴽⵯ.',
    feat1: 'ⵙⵔⵙ ⵜⵉⴳⴰⵡⵉⵏ ⵏⵏⴽ ⴼⴰⴱⵓⵔ',
    feat2: 'ⴰⵙⵖⵏ ⴳ ⵓⵎⵣⴰⵖ ⵙ ⴰⵎⴰⵏⴰ',
    feat3: 'ⵜⴰⵙⵏⵙⵉⵜ ⵉⵜⵜⵓⴼⵔⴰⵏ',
    feat4: 'ⴰⵡⴹ ⵉⵎⵙⴰⵖⵏ ⴳ ⴽⵓ ⴰⴷⵖⴰาร',
    getStarted: 'ⵙⵏⵜⵉ',
    alreadyHaveAccount: 'ⵉⵍⵍⴰ ⵖⵓⵔⴽ ⴰⵎⵉⴹⴰⵏ?',
    signIn: 'ⴽⵛⵎ',
    accountTitle: 'Finalization',
    accountSubtitle: 'Last step to create your shop.',
    fullName: 'ⵉⵙⵎ ⴰⵎⵖראⴷ',
    email: 'ⴰⵏⵙⴰ ⵏ ⵓⵎⴰⵢⵍ',
    password: 'ⵜⴰⴳⵓⵔⵉ ⵏ ⵓⵣⵔⴰⵢ',
    phone: 'ⵓⵟⵟⵓⵏ ⵏ ⵜⵉⵍⵉⴼⵓⵏ',
    next: 'ⴹⴼⵕ',
    storeTitle: 'ⵙⵎⵎⵉ ⵜⴰⵃⴰⵏⵓⵜ ⵏⵏⴽ',
    storeSubtitle: 'ⴰⵢⴰ ⴰⴷ ⵥⵕⵕⵏ ⵉⵎⵙⴰⵖⵏ ⴳ ⵜⴰⵃⴰⵏⵓⵜ ⵏⵏⴽ.',
    shopName: 'ⵉⵙⵎ ⵏ ⵜⴰⵃⴰⵏⵓⵜ',
    shopNamePlaceholder: 'ⵎⴷⵢⴰ. ⴰⵟⵍⴰⵙ ⵉ ⵜⵉⴳⴰⵡⵉⵏ',
    shopDesc: 'ⴰⴳⵍⴰⵎ ⴰⴳⵣⵣⴰⵍ (ⴰⵙⵜⴰⵢ)',
    shopDescPlaceholder: 'ⵎⵎⵍ ⵉ ⵉⵎⵙⴰⵖⵏ ⵎⴰⵢⴷ ⵉⵥⵉⵍⵏ ⴳ ⵜⴰⵃⴰⵏⵓⵜ ⵏⵏⴽ...',
    // Product
    productTitle: 'ⵙⵉⴷⴼ ⵜⴰⵖⴰⵡⵙⴰ ⵏⵏⴽ ⵜⴰⵎⵣⵡⴰⵔⵓⵜ',
    productSubtitle: 'ⵙⵉⴷⴼ ⵜⴰⵡⵓⵔⵉ ⵏⵏⴽ ⵜⴰⵎⵣⵡⴰⵔⵓⵜ ⵃⵎⴰ ⴰⴷ ⵥⵕⵏ ⵉⵎⵙⵖⴰⵏ ⵎⴰ ⵜⵣⵣⵏⵣⴰⵜ.',
    productName: 'ⵉⵙⵎ ⵏ ⵜⵖⴰⵡⵙⴰ',
    productNamePlaceholder: 'ex. ⵜⴰⵥⵕⴱⵉⵜ ⵜⴰⴱⵔⴱⵔⵉⵜ',
    productPrice: 'ⴰⵜⵉⴳ (MAD)',
    productPricePlaceholder: 'ex. 450',
    productImage: 'ⵜⴰⵡⵍⴰⴼⵜ ⵏ ⵜⵖⴰⵡⵙⴰ',
    productImageHelp: 'ⵙⵉⴷⴼ ⵜⴰⵡⵍⴰⴼⵜ ⵉⴼⴰⵡⵏ.',
    productCategory: 'ⴰⵏⴰⵡ',
    productCategoryPlaceholder: 'ⴼⵔⵏ ⴰⵏⴰⵡ...',
    skipStep: 'ⵣⵔⵉ ⵜⴰⵙⵓⵔⵜ ⴰⴷ',
    locationTitle: 'ⵎⴰⵏⵉ ⵖ ⵜⵍⵍⵉⴷ?',
    locationSubtitle: 'ⴰⵡⵙ ⵉⵎⵙⴰⵖⵏ ⴰⴷ ⴰⴼⵏ ⵜⵉⴳⴰⵡⵉⵏ ⵏⵏⴽ.',
    city: 'ⵜⵉⵖⵔⵎⵜ',
    address: 'ⴰⵏⵙⴰ ⵏ ⵓⵎⵣⴰⵖ',
    addressPlaceholder: 'ⵎⴷⵢⴰ. ⴷⵔⴱ ⵙⵏⴰⵏ, ⴱⴰⴱ ⴷⵓⴽⴽⴰⵍⴰ',
    createShop: 'ⵕⵥⵎ ⵜⴰⵃⴰⵏⵓⵜ ⵉⵏⵓ',
    summaryTitle: 'ⵙⵏⵇⴷ ⵉⵏⵖⵎⵉⵙⵏ',
    summarySubtitle: 'ⵙⵏⵇⴷ ⵎⴰⴷ ⵉⵍⵍⴰⵏ ⵓⵔⵜⴰ ⵜⵕⵥⵎⴷ ⵜⴰⵃⴰⵏⵓⵜ ⵏⵏⴽ.',
    creating: 'ⴰⵙⵏⴼⵍ...',
    selectCity: 'ⵙⵜⵉ ⵜⵉⵖⵔⵎⵜ ⵏⵏⴽ...',
    defaultShopDesc: 'ⵜⴰⵃⴰⵏⵓⵜ ⵏⵏⴽ ⵜⴰⵎⴳⵓⵔⵉⵜ ⴳ ⴰⴼⵓⵙ',
    successTitle: 'ⵜⴰⵃⴰⵏⵓⵜ ⵏⵏⴽ ⵜⵕⵥⵎ!',
    successSubtitle: 'ⴰⵢⵢⵓⵣ! ⵜⴳⵉⴷ ⴰⵎⴳⵓⵔⵉ ⵉⵜⵜⵓⵙⵉⵙⴽⵏ ⴳ ⴰⴼⵓⵙ.',
    addProduct: 'ⵔⵏⵓ ⵜⴰⵖⴰⵡⵙⴰ ⵜⴰⵎⵣⵡⴰⵔⵓⵜ',
    goToDashboard: 'ⴷⴷⵓ ⵖⵔ ⵜⴰⴼⵉⵍⴰⵍⵜ ⵏ ⵓⵙⵏⵇⴷ',
    back: 'ⵡⵓⵔⵔⵉ',
    step: 'ⴰⵙⵓⵔⴼ',
    of: 'ⵙⴳ',
    or: 'ⵏⵖ',
    loginEmail: 'ⴰⵎⴰⵢⵍ',
    loginPassword: 'ⵜⴰⴳⵓⵔⵉ ⵏ ⵓⵣⵔⴰⵢ',
    signinBtn: 'ⴽⵛⵎ',
    switchToRegister: 'ⵙⵏⴼⵍ ⴰⵎⵉⴹⴰⵏ',
    errFillFields: 'ⵎⵍⵍⵉ ⴰⴽⴽⵯ ⵉⴳⵔⴰⵏ.',
    errLoginFailed: 'ⵓⵔ ⵉⵎⵓⵔⵙ ⵓⴽⵛⵛⵓⵎ.',
    errFillRequired: 'ⵎⵍⵍⵉ ⴰⴽⴽⵯ ⵉⴳަރⴰⵏ ⵉⵜⵜⵓⵙⵖⴰⵡⵙⴰⵏ.',
    errPasswordLength: 'ⵜⴰⴳⵓⵔⵉ ⵏ ⵓⵣⵔⴰⵢ ⵉⵇⵇⴰⵏ ⴷ ⴰⴷ ⵜⴳ ⵙⴳ 6 ⵏ ⵉⵙⴽⴽⵉⵍⵏ.',
    errShopNameEmpty: 'ⵙⵔⵙ ⵉⵙⵎ ⵏ ⵜⵃⴰⵏⵓⵜ.',
    errShopNameLength: 'ⵉⵙⵎ ⵏ ⵜⵃⴰⵏⵓⵜ ⵉⵇⵇⴰⵏ ⴷ ⴰⴷ ⵉⵍⵉ ⴳⵔ 4 ⴷ 20 ⵏ ⵉⵙⴽⴽⵉⵍⵏ.',
    errShopNameFormat: 'ⵉⵙⵎ ⵏ ⵜⵃⴰⵏⵓⵜ ⵉⵇⵇⴰⵏ ⴷ ⴰⴷ ⵉⵙⵎⵓⵏ ⵖⴰⵙ ⵉⵙⴽⴽⵉⵍⵏ ⴷ ⵉⵣⵡⵉⵍⵏ.',
    errShopNameTaken: 'ⵉⵙⵎ ⴰⴷ ⵏ ⵜⵃⴰⵏⵓⵜ ⵉⵜⵜⵓⵢⴰⵎⵥ ⵢⴰⴷ.',
    errVerifyingShop: 'ⴰⵣⴳⴰⵍ ⴳ ⵓⵙⵏⵇⴷ ⵏ ⵉⵙⵎ ⵏ ⵜⵃⴰⵏⵓⵜ.',
    errSelectCity: 'ⵙⵜⵉ ⵜⵉⵖⵔⵎⵜ ⵏⵏⴽ.',
  },
};

const MOROCCAN_CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tanger', 'Agadir',
  'Meknes', 'Oujda', 'Kenitra', 'Tetouan', 'Sale', 'Nador',
  'Beni Mellal', 'El Jadida', 'Taza', 'Mohammedia', 'Khouribga',
  'Settat', 'Safi', 'Essaouira', 'Ouarzazate', 'Errachidia',
];

const MOROCCAN_CITIES_SECTORS: Record<string, string[]> = {
  'Casablanca': ['Anfa', 'Maârif', 'Sidi Belyout', 'Aïn Diab', 'Bourgogne', 'Gauthier', 'Autre secteur'],
  'Tanger': ['Médina', 'Malabata', 'Marchan', 'Iberia', 'Beni Makada', 'Autre secteur'],
  'Agadir': ['Centre Ville', 'Marina', 'Talborjt', 'Haut Founty', 'Dakhla', 'Autre secteur'],
  'Marrakech': ['Médina', 'Guéliz', 'Hivernage', 'Palmeraie', 'Targa', 'Sidi Youssef Ben Ali', 'Daoudiate', 'Autre secteur'],
  'Fès': ['Fès El Bali', 'Fès El Jdid', 'Ville Nouvelle', 'Narjiss', 'Mont Fleuri', 'Agdal', 'Autre secteur'],
  'Meknès': ['Médina', 'Hamria', 'Ville Nouvelle', 'Bassatine', 'Toulal', 'Autre secteur'],
  'Rabat': ['Médina', 'Agdal', 'Hassan', 'Hay Riad', 'Souissi', 'Les Orangers', 'Youssoufia', 'Océan', 'Autre secteur'],
  'Tétouan': ['Médina', 'Ensanche', 'Sania Rmel', 'Kabila', 'Autre secteur'],
};

export default function ProductFirstOnboardingModal({ isOpen, onClose, lang }: ProductFirstOnboardingModalProps) {
  const t = labels[lang] || labels.en;

  const [hasSession, setHasSession] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('afus_session_user');
    }
    return false;
  });

  const [step, setStep] = useState<Step>(() => {
    return 'step1';
  });
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Account fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Store fields
  const [shopName, setShopName] = useState('');
  const [shopDesc, setShopDesc] = useState('');

  // Location fields
  const [city, setCity] = useState('');
  const [secteur, setSecteur] = useState('');
  const [openCity, setOpenCity] = useState(false);
  const [address, setAddress] = useState('');

  // Product fields
  const [productTitle, setProductTitle] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImageFiles, setProductImageFiles] = useState<File[]>([]);
  const [productImagePreviews, setProductImagePreviews] = useState<string[]>([]);
  const [productCategory, setProductCategory] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<any>(null);

  const [createdShopSlug, setCreatedShopSlug] = useState('');
  const [reviewIdx, setReviewIdx] = useState(0);
  const [reviewFading, setReviewFading] = useState(false);

  const REVIEWS = [
    {
      name: 'Aspen Siphron',
      avatar: 'https://i.pravatar.cc/150?img=47',
      rating: 4.9,
      text: 'The quality exceeded my expectations. You can really see the craftsmanship — this is what authentic Moroccan artisanry looks like.',
      product: 'Handcrafted Cedar Box',
    },
    {
      name: 'Kierra Calzoni',
      avatar: 'https://i.pravatar.cc/150?img=32',
      rating: 5.0,
      text: 'Absolutely love this product. The artisan was very communicative and the packaging was perfect. Will definitely order again.',
      product: 'Berber Wool Rug',
    },
    {
      name: 'Youssef Alami',
      avatar: 'https://i.pravatar.cc/150?img=12',
      rating: 4.8,
      text: 'Ordered a custom leather bag — the stitching is perfect and the smell of genuine leather is amazing. A true gem.',
      product: 'Leather Satchel',
    },
    {
      name: 'Nadia Benchekroun',
      avatar: 'https://i.pravatar.cc/150?img=56',
      rating: 5.0,
      text: 'The zellige mirror is absolutely stunning. Everyone who visits asks where I got it — truly a conversation piece.',
      product: 'Zellige Wall Mirror',
    },
  ];

  const stepIndex = STEPS.indexOf(step);
  const contentSteps: Step[] = hasSession ? ['step1', 'step_category', 'step2', 'account'] : ['step1', 'step_category', 'step2', 'account'];
  const contentStepIndex = contentSteps.indexOf(step);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep('step1');
      setIsLoginMode(false);
      setError('');
      setFullName(''); setEmail(''); setPassword(''); setPhone('');
      setLoginEmail(''); setLoginPassword('');
      setShopName(''); setShopDesc('');
      setCity(''); setSecteur(''); setAddress('');
      setProductTitle('');
      setProductDesc('');
      setProductPrice('');
      setProductImageFiles([]);
      setProductImagePreviews([]);
      setProductCategory('');
      setShowAllCategories(false);
      setCreatedProduct(null);
      setReviewIdx(0);

      getActiveSession().then((session) => {
        if (session) {
          setHasSession(true);
        } else {
          setHasSession(false);
        }
      });
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Auto-advance review carousel
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setReviewFading(true);
      setTimeout(() => {
        setReviewIdx(prev => (prev + 1) % REVIEWS.length);
        setReviewFading(false);
      }, 300);
    }, 4500);
    return () => clearInterval(timer);
  }, [isOpen, REVIEWS.length]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) { setError(t.errFillFields); return; }
    setLoading(true); setError('');
    try {
      await loginUser(loginEmail, loginPassword);
      onClose();
      window.location.reload();
    } catch (err: any) {
      setError(err.message || t.errLoginFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasSession) {
      if (!fullName || !email || !password) { setError(t.errFillRequired); return; }
      if (password.length < 6) { setError(t.errPasswordLength); return; }
    }
    const cleanName = shopName.trim();
    if (!cleanName) { setError(t.errShopNameEmpty || 'Shop name is required'); return; }
    
    setLoading(true);
    try {
      const shopSlug = cleanName.toLowerCase().replace(/\s+/g, '-');
      const isAvailable = await checkShopSlugAvailable(shopSlug);
      if (!isAvailable) {
        setError(t.errShopNameTaken);
        setLoading(false);
        return;
      }
      await handleCreateShop();
    } catch (err) {
      setError(t.errVerifyingShop || 'Error verifying shop');
      setLoading(false);
    }

  };



  const handleStep1Next = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    if (productImageFiles.length === 0) {
      setError(lang === 'fr' ? 'Veuillez ajouter au moins une image.' : lang === 'ar' ? 'يرجى إضافة صورة واحدة على الأقل.' : 'Please add at least one image.');
      return;
    }
    
    
    if (!city) { setError(t.errSelectCity); return; }

    setLoading(true);
    try {
      
      setStep('step_category');
    } catch (err) {
      setError(t.errVerifyingShop || 'Error verifying shop');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Next = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    if (!productTitle) {
      setError(lang === 'fr' ? 'Veuillez saisir un titre.' : lang === 'ar' ? 'يرجى إدخال عنوان.' : 'Please enter a title.');
      return;
    }
    if (!productPrice) {
      setError(lang === 'fr' ? 'Veuillez saisir un prix.' : lang === 'ar' ? 'يرجى إدخال سعر.' : 'Please enter a price.');
      return;
    }

    setStep('account');
  };

  const handleCreateShop = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = shopName.trim();
    const finalCity = secteur ? `${city} - ${secteur}` : city;
    
    setLoading(true); setError('');
    try {
      let createdShop = null;

      if (hasSession) {
        const active = await getActiveSession();
        if (!active) {
          throw new Error('No active session found.');
        }
        const result = await createShopForExistingUser({
          userId: active.id,
          fullName: active.full_name,
          phone: phone || active.phone_number || '',
          shopName: cleanName,
          merchantCity: finalCity,
          pickupAddress: '',
        });
        createdShop = result.shop;
        setCreatedShopSlug(result.shop?.slug || '');
      } else {
        const result = await registerUser({
          email,
          password,
          fullName,
          phone: phone || '',
          role: 'seller',
          shopName: cleanName,
          merchantCity: finalCity,
          pickupAddress: '',
        });
        createdShop = result.shop;
        setCreatedShopSlug(result.shop?.slug || '');
      }

      // Create product if details and images are provided
      if (createdShop && productTitle && productPrice && productImageFiles.length > 0) {
        // Upload images — throw on failure so the user sees the error
        const imageUrlPromises = productImageFiles.map((file) => uploadImage(file));
        const uploadedProductImageUrls = await Promise.all(imageUrlPromises);
        const validUrls = uploadedProductImageUrls.filter(Boolean) as string[];

        if (validUrls.length > 0) {
          const productRes = await fetch('/api/products/onboarding', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              shop_id: createdShop.id,
              category_id: productCategory,
              title: productTitle,
              description: productDesc,
              price: productPrice,
              imageUrls: validUrls,
            }),
          });
          if (!productRes.ok) {
            const errData = await productRes.json();
            throw new Error(errData.error || 'Failed to create onboarding product');
          }
          const resData = await productRes.json();
          if (resData.product) {
            setCreatedProduct(resData.product);
          }
        }
      }

      setStep('success');
    } catch (err: any) {
      console.error(err);
      setError(err.message || t.errCreateShopFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessRedirect = () => {
    onClose();
    if (createdProduct) {
      const slug = createdProduct.slug_translations[lang] || createdProduct.slug_translations.en;
      const title = createdProduct.title_translations[lang] || createdProduct.title_translations.en;
      const price = createdProduct.base_price_mad;
      const img = createdProduct.media_gallery?.[0] || '';
      const shopNameParam = shopName;
      window.location.href = `/${lang}/listing/${createdProduct.numeric_id}/${slug}?t=${encodeURIComponent(title)}&p=${price}&img=${encodeURIComponent(img)}&s=${encodeURIComponent(shopNameParam)}`;
    } else {
      window.location.href = `/${lang}/dashboard`;
    }
  };

  if (!isOpen) return null;

  const progressPercent = step === 'success' ? 100
    : isLoginMode ? 0
    : ((contentStepIndex + 1) / contentSteps.length) * 100;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={() => {
          if (step === 'success') {
            handleSuccessRedirect();
          }
        }}
      />

      {/* Modal Container — Centered, non-fullscreen, arabic-frame corners */}
      <div className={`relative z-10 w-full max-w-lg md:max-w-xl bg-white shadow-2xl arabic-frame flex flex-col min-h-[100dvh] md:min-h-0 md:max-h-[90vh] overflow-hidden border-0 md:border ${lang === 'tz' ? 'font-tifinagh' : ''}`}>

        {/* Unified header */}
        <div className="flex items-center px-6 pt-6 pb-2 md:px-10 lg:px-14 md:pt-8 md:pb-2 bg-white z-20 gap-4 md:gap-8 lg:gap-12">
          <div className="w-16 md:w-24 shrink-0">
            {!isLoginMode && (step === 'step2' || step === 'step_category' || step === 'account') && (
              <button
                onClick={() => {
                  setError('');
                  if (step === 'step_category') setStep('step1');
                  else if (step === 'step2') setStep('step_category');
                  else if (step === 'account') setStep('step2');
                }}
                className="w-10 h-10 rounded-full bg-neutral-50 md:bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-100 transition-all shrink-0"
              >
                <IconArrowLeft className="w-5 h-5" strokeWidth={2} />
              </button>
            )}
          </div>
          
          <div className="flex-1 flex justify-center w-full">
            {!isLoginMode && step !== 'success' && (
              <div className="hidden sm:block w-full max-w-lg space-y-2 mx-auto">
                
                <div className="flex gap-2">
                  {contentSteps.map((s, i) => (
                    <div
                      key={s}
                      className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                        i <= contentStepIndex ? 'bg-primary' : 'bg-neutral-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-16 md:w-24 flex justify-end shrink-0">
            {/* Close button */}
            <button
              onClick={() => {
                if (step === 'success') {
                  handleSuccessRedirect();
                } else {
                  const hasUnsavedChanges = productImageFiles.length > 0 || productCategory !== '' || productPrice !== '' || productTitle !== '' || productDesc !== '' || city !== '' || secteur !== '' || shopName !== '' || fullName !== '' || email !== '';
                  if (hasUnsavedChanges) {
                    const confirmMessage = lang === 'fr' 
                      ? "Êtes-vous sûr de vouloir quitter ? Vos informations seront perdues." 
                      : lang === 'ar' 
                      ? "هل أنت متأكد أنك تريد الخروج؟ سيتم فقدان معلوماتك."
                      : "Are you sure you want to leave? Your information will be lost.";
                    if (window.confirm(confirmMessage)) {
                      onClose();
                    }
                  } else {
                    onClose();
                  }
                }
              }}
              className="w-10 h-10 rounded-full bg-neutral-50 md:bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-100 transition-all shrink-0"
            >
              <IconX className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto relative flex flex-col min-h-0">
          
          

            <div className="flex-1 flex flex-col justify-start pt-4 md:pt-6 pb-0 px-6 md:px-10 lg:px-14 min-h-full">
              <div className="w-full max-w-md my-auto mx-auto">

              {/* ── LOGIN MODE ── */}
                {isLoginMode && (
                  <div className="space-y-6 text-center flex-1 flex flex-col">
                    <div>
                      <button
                        onClick={() => { setIsLoginMode(false); setError(''); }}
                        className="flex items-center justify-center gap-1.5 text-sm text-neutral-500 hover:text-black mb-6 transition-colors mx-auto"
                      >
                        <IconArrowLeft className="w-4 h-4" strokeWidth={2} />
                        <span>{t.back}</span>
                      </button>
                      <h1 className="text-2xl md:text-3xl font-semibold tracking-[-1px] text-neutral-900 leading-tight">{t.signIn}</h1>
                      <p className="text-neutral-500 mt-2 text-base">{t.alreadyHaveAccount}</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4 text-left">
                      {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                          {error}
                        </div>
                      )}
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-black block">{t.loginEmail}</label>
                        <div className="relative">
                          <IconMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={1.8} />
                          <input
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="w-full border border-neutral-200 rounded-2xl pl-11 pr-4 py-3.5 text-base text-left text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300"
                            placeholder="you@example.com"
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-black block">{t.loginPassword}</label>
                        <div className="relative">
                          <IconLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={1.8} />
                          <input
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="w-full border border-neutral-200 rounded-2xl pl-11 pr-4 py-3.5 text-base text-left text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300"
                            placeholder="••••••••"
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={loading || !loginEmail || !loginPassword}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-full font-bold text-base hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? '...' : t.signinBtn}
                      </button>
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => { setIsLoginMode(false); setError(''); }}
                          className="text-sm text-primary font-semibold hover:underline"
                        >
                          {t.switchToRegister}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* ── STEP 1: ACCOUNT ── */}
                {step === 'account' && !isLoginMode && (
                  <div className="space-y-6 text-center flex-1 flex flex-col">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-semibold tracking-[-1px] text-neutral-900 leading-tight">{t.accountTitle}</h1>
                      <p className="text-neutral-500 mt-2 text-base">{t.accountSubtitle}</p>
                    </div>

                    <form onSubmit={handleAccountNext} className="space-y-4 text-left">
                      {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                          {error}
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-black block">{t.shopName} <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <IconBuildingStore className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={1.8} />
                          <input
                            type="text"
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            className="w-full border border-neutral-200 rounded-2xl pl-11 pr-4 py-3.5 text-base text-left text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300"
                            placeholder={t.shopNamePlaceholder}
                          />
                        </div>
                      </div>

                      {!hasSession && (
                        <>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-black block">{t.fullName} <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <IconUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={1.8} />
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full border border-neutral-200 rounded-2xl pl-11 pr-4 py-3.5 text-base text-left text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300"
                            placeholder="Youssef Alami"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-black block">{t.email} <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <IconMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={1.8} />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-neutral-200 rounded-2xl pl-11 pr-4 py-3.5 text-base text-left text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-black block">{t.password} <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <IconLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={1.8} />
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-neutral-200 rounded-2xl pl-11 pr-4 py-3.5 text-base text-left text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300"
                            placeholder="At least 6 characters"
                          />
                        </div>
                      </div>

                      </>
                      )}

                      <div className="sticky bottom-0 left-0 right-0 pt-4 pb-6 md:pb-8 bg-white z-50 flex flex-row-reverse items-center justify-between gap-3 -mx-6 md:-mx-10 lg:-mx-14 px-6 md:px-10 lg:px-14 mt-auto">
                        <button
                          type="submit"
                          className="flex-1 w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 md:py-4 rounded-full font-bold text-sm md:text-base hover:bg-primary/90 transition-all"
                        >
                          {lang === 'fr' ? 'Publier mon produit' : lang === 'ar' ? 'نشر منتجي' : 'Publish my product'}
                          <IconArrowRight className="w-5 h-5" strokeWidth={2.5} />
                        </button>
                      </div>

                      
                    </form>
                  </div>
                )}

                {/* ── STEP 1: BASICS ── */}
                {step === 'step1' && (
                  <div className="space-y-6 text-center flex-1 flex flex-col">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-semibold tracking-[-1px] text-neutral-900 leading-tight">{lang === 'fr' ? 'Quelle est votre création ?' : lang === 'ar' ? 'ما هو إبداعك؟' : 'What is your creation?'}</h1>
                      
                    </div>

                    <form onSubmit={handleStep1Next} className="space-y-4 text-left">
                      {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                          {error}
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-black block">{t.productImage} <span className="text-red-500">*</span></label>
                        <div className="relative border-2 border-dashed border-neutral-200 rounded-2xl hover:border-primary/50 transition-all p-6 flex flex-col items-center justify-center bg-neutral-50 hover:bg-white cursor-pointer group">
                          {productImagePreviews.length > 0 ? (
                            <div className="flex flex-wrap gap-2 w-full">
                              {productImagePreviews.map((preview, idx) => (
                                <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden flex items-center justify-center border border-neutral-200">
                                  <img src={preview} alt="Product preview" className="object-cover w-full h-full rounded-xl" />
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setProductImageFiles((prev) => prev.filter((_, i) => i !== idx));
                                      setProductImagePreviews((prev) => prev.filter((_, i) => i !== idx));
                                    }}
                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                                  >
                                    <IconX className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                              {productImagePreviews.length < 5 && (
                                <div className="w-24 h-24 border-2 border-dashed border-neutral-200 rounded-xl hover:border-primary/50 transition-all flex flex-col items-center justify-center bg-neutral-50 hover:bg-white cursor-pointer relative">
                                  <IconPlus className="w-6 h-6 text-neutral-400" />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                      if (e.target.files) {
                                        const filesArray = Array.from(e.target.files);
                                        const newFiles = [...productImageFiles, ...filesArray].slice(0, 5);
                                        setProductImageFiles(newFiles);
                                        setProductImagePreviews(newFiles.map(file => URL.createObjectURL(file)));
                                      }
                                    }}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center space-y-1 relative w-full h-full">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                                <IconPackage className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-black">
                                  {lang === 'fr' ? 'Déposer des photos ou cliquer' : lang === 'ar' ? 'اسحب صورًا أو انقر هنا' : 'Drop photos or click'}
                                </p>
                                <p className="text-[10px] text-neutral-500 mt-0.5">{t.productImageHelp}</p>
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                  if (e.target.files) {
                                    const filesArray = Array.from(e.target.files).slice(0, 5);
                                    setProductImageFiles(filesArray);
                                    setProductImagePreviews(filesArray.map(file => URL.createObjectURL(file)));
                                  }
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      

                      

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-sm font-semibold text-black block text-left">
                            Ville <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              value={city}
                              onChange={(e) => {
                                setCity(e.target.value);
                                setSecteur('');
                              }}
                              className="w-full border border-neutral-200 rounded-2xl pl-4 pr-10 py-3.5 text-sm text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300 appearance-none cursor-pointer text-left"
                            >
                              <option value="" disabled>Sélectionner une ville...</option>
                              {[...Object.keys(MOROCCAN_CITIES_SECTORS)].sort((a, b) => a.localeCompare(b)).map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                            <IconSelector className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 z-10 pointer-events-none" strokeWidth={1.8} />
                          </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-black block text-left">
                              Secteur <span className="text-neutral-400 font-normal ml-1">(Optionnel)</span>
                            </label>
                            <div className="relative">
                              <select
                                value={secteur}
                                onChange={(e) => setSecteur(e.target.value)}
                                disabled={!city}
                                className="w-full border border-neutral-200 rounded-2xl pl-4 pr-10 py-3.5 text-sm text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300 appearance-none cursor-pointer text-left disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <option value="" disabled>{city ? 'Sélectionner un secteur...' : 'Sélectionnez d\'abord une ville...'}</option>
                                {city && MOROCCAN_CITIES_SECTORS[city] && MOROCCAN_CITIES_SECTORS[city].map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                              <IconSelector className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 z-10 pointer-events-none" strokeWidth={1.8} />
                            </div>
                          </div>
                      </div>

                      <div className="sticky bottom-0 left-0 right-0 pt-4 pb-6 md:pb-8 bg-white z-50 flex flex-row-reverse items-center justify-between gap-3 -mx-6 md:-mx-10 lg:-mx-14 px-6 md:px-10 lg:px-14 mt-auto">
                        <button
                          type="submit"
                          disabled={loading || productImageFiles.length === 0 || !city}
                          className="flex-1 w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 md:py-4 rounded-full font-bold text-sm md:text-base hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2 justify-center w-full">
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              {t.creating || 'Loading...'}
                            </span>
                          ) : (
                            <>
                              {t.next}
                              <IconArrowRight className="w-5 h-5" strokeWidth={2.5} />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}


                
                {/* ── STEP 1.5: CATEGORY ── */}
                {step === 'step_category' && !isLoginMode && (
                  <div className="space-y-6 text-center flex-1 flex flex-col">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-semibold tracking-[-1px] text-neutral-900 leading-tight">
                        {lang === 'fr' ? 'Choisissez une catégorie' : lang === 'ar' ? 'اختر فئة' : 'Choose a category'}
                      </h1>
                    </div>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      setError('');
                      if (!productCategory) {
                        setError(lang === 'fr' ? 'Veuillez sélectionner une catégorie.' : lang === 'ar' ? 'يرجى اختيار فئة.' : 'Please select a category.');
                        return;
                      }
                      setStep('step2');
                    }} className="space-y-6 text-left flex-1 flex flex-col">
                      
                      <div className="space-y-1">
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[...staticCategories]
                            .sort((a, b) => {
                              const nameA = a.name[lang as 'en'|'fr'|'ar'|'tz'] || a.name.en;
                              const nameB = b.name[lang as 'en'|'fr'|'ar'|'tz'] || b.name.en;
                              return nameA.localeCompare(nameB);
                            })
                            
                            .map((c) => {
                              const CatIcon = CATEGORY_ICONS[c.id] || IconPackage;
                              const isSelected = productCategory === c.id;
                              return (
                                <label
                                  key={c.id}
                                  className={`relative flex flex-col items-center justify-center p-3 text-center rounded-2xl border-2 cursor-pointer transition-all ${
                                    isSelected 
                                      ? 'border-primary bg-primary/5 text-primary' 
                                      : 'border-neutral-100 hover:border-primary/30 bg-white text-neutral-600'
                                  }`}
                                >
                                  <input 
                                    type="radio" 
                                    name="category" 
                                    value={c.id} 
                                    checked={isSelected}
                                    onChange={() => {
                                      setProductCategory(c.id);
                                      setTimeout(() => setStep('step2'), 150);
                                    }}
                                    className="hidden" 
                                  />
                                  <CatIcon className={`w-6 h-6 mb-2 ${isSelected ? 'text-primary' : 'text-neutral-400'}`} strokeWidth={1.5} />
                                  <span className="text-xs font-semibold leading-tight">
                                    {c.name[lang as 'en'|'fr'|'ar'|'tz'] || c.name.en}
                                  </span>
                                  {isSelected && (
                                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
                                  )}
                                </label>
                              );
                          })}
                          
                        </div>
                      </div>

                      {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                          {error}
                        </div>
                      )}

                      
                    </form>
                  </div>
                )}

                {/* ── STEP 2: DETAILS ── */}
                {step === 'step2' && (
                  <div className="space-y-6 text-center flex-1 flex flex-col">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-semibold tracking-[-1px] text-neutral-900 leading-tight">{lang === 'fr' ? 'Détails du produit' : lang === 'ar' ? 'تفاصيل المنتج' : 'Product Details'}</h1>
                      <p className="text-neutral-500 mt-2 text-base">{lang === 'fr' ? 'Prix, titre et description' : lang === 'ar' ? 'السعر والعنوان والوصف' : 'Price, title and description'}</p>
                    </div>

                    <form onSubmit={handleStep2Next} className="space-y-4 text-left">
                      {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                          {error}
                        </div>
                      )}

                      <div className="flex flex-col gap-4">
                        <div className="space-y-1">
                          <label className="text-sm font-semibold text-black block">{t.productPrice} <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <input
                              type="number"
                              value={productPrice}
                              onChange={(e) => setProductPrice(e.target.value)}
                              className="w-full border border-neutral-200 rounded-2xl pl-4 pr-24 py-3 text-sm text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300"
                              placeholder={t.productPricePlaceholder}
                            />
                            <div className="absolute right-0 top-0 bottom-0 flex items-center pr-4 pointer-events-none">
                              <div className="h-6 w-px bg-neutral-200 mr-3"></div>
                              <span className="text-lg leading-none mr-1.5">🇲🇦</span>
                              <span className="text-sm font-bold text-black">DH</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-semibold text-black block">{t.productName} <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={productTitle}
                            onChange={(e) => setProductTitle(e.target.value)}
                            className="w-full border border-neutral-200 rounded-2xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300 animate-in"
                            placeholder={t.productNamePlaceholder}
                          />
                        </div>
                      </div>

                      <div className="space-y-1 mt-4">
                        <label className="text-sm font-semibold text-black block">{lang === 'fr' ? 'Description (facultative)' : lang === 'ar' ? 'الوصف (اختياري)' : 'Description (optional)'}</label>
                        <textarea
                          value={productDesc}
                          onChange={(e) => setProductDesc(e.target.value)}
                          className="w-full border border-neutral-200 rounded-2xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300 resize-none h-24"
                          placeholder={lang === 'fr' ? 'Décrivez votre produit...' : lang === 'ar' ? 'صف منتجك...' : 'Describe your product...'}
                        />
                      </div>

                      <div className="sticky bottom-0 left-0 right-0 pt-4 pb-6 md:pb-8 bg-white z-50 flex flex-row-reverse items-center justify-between gap-3 -mx-6 md:-mx-10 lg:-mx-14 px-6 md:px-10 lg:px-14 mt-auto">
                        <button
                          type="submit"
                          disabled={!productTitle || !productPrice || loading}
                          className="flex-1 w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 md:py-4 rounded-full font-bold text-sm md:text-base hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2 justify-center w-full">
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              {t.creating || 'Loading...'}
                            </span>
                          ) : (
                            <>
                              {hasSession ? t.createShop : t.next}
                              {hasSession ? <IconCheck className="w-5 h-5" strokeWidth={2.5} /> : <IconArrowRight className="w-5 h-5" strokeWidth={2.5} />}
                            </>
                          )}
                        </button>
                        
                      </div>
                    </form>
                  </div>
                )}


                {/* ── SUCCESS ── */}
                {step === 'success' && (
                  <div className="space-y-8 text-center mt-12 md:mt-0">
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                          <IconCheck className="w-12 h-12 text-green-500" strokeWidth={2.5} />
                        </div>
                        <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <IconBuildingStore className="w-4 h-4 text-white" strokeWidth={2} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h1 className="text-2xl md:text-3xl font-semibold tracking-[-1px] text-neutral-900 leading-tight">{t.successTitle}</h1>
                      <p className="text-neutral-500 mt-3 text-base leading-relaxed">
                        {t.successSubtitle}
                      </p>
                    </div>



                    <div className="space-y-4">
                      <button
                        type="button"
                        onClick={handleSuccessRedirect}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-full font-bold text-base hover:bg-primary/90 transition-all cursor-pointer"
                      >
                        <IconPackage className="w-5 h-5" strokeWidth={2} />
                        {createdProduct ? t.viewMyProduct : t.addProduct}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          window.location.href = `/${lang}/dashboard`;
                        }}
                        className="w-full flex items-center justify-center gap-2 border border-neutral-200 text-neutral-700 py-4 rounded-2xl font-bold text-base hover:bg-neutral-50 transition-all cursor-pointer"
                      >
                        {t.goToDashboard}
                        <IconArrowRight className="w-5 h-5" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
