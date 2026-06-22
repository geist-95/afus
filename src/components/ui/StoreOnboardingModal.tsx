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
} from '@tabler/icons-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

interface StoreOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

type Step = 'account' | 'store' | 'product' | 'location' | 'summary' | 'success';

const STEPS: Step[] = ['account', 'store', 'product', 'location', 'summary', 'success'];

const labels: Record<string, Record<string, string>> = {
  en: {
    // Welcome
    welcomeTitle: 'Start selling on afus',
    welcomeSubtitle: 'Join hundreds of Moroccan artisans and connect directly with buyers across the country.',
    feat1: 'Free to list your products',
    feat2: 'Cash on delivery via Amana',
    feat3: 'Secure & verified platform',
    feat4: 'Reach buyers nationwide',
    getStarted: 'Get started',
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign in',
    // Account
    accountTitle: 'Create your account',
    accountSubtitle: 'Your personal details for signing in.',
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
    productTitle: 'List your first product',
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
    errShopNameFormat: 'Shop name can only contain letters and numbers (no spaces, special characters, or emojis).',
    errShopNameTaken: 'This shop name is already taken.',
    errVerifyingShop: 'Error verifying shop name.',
    errSelectCity: 'Please select your city.',
    errCreateShopFailed: 'Failed to create shop. Please try again.',
  },
  fr: {
    welcomeTitle: 'Commencez à vendre sur afus',
    welcomeSubtitle: 'Rejoignez des centaines d\'artisans marocains et connectez-vous directement aux acheteurs.',
    feat1: 'Publication gratuite',
    feat2: 'Paiement à la livraison via Amana',
    feat3: 'Plateforme sécurisée et vérifiée',
    feat4: 'Atteignez des acheteurs partout',
    getStarted: 'Commencer',
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    signIn: 'Se connecter',
    accountTitle: 'Créez votre compte',
    accountSubtitle: 'Vos informations personnelles pour vous connecter.',
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
    productTitle: 'Ajoutez votre premier produit',
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
    errShopNameFormat: 'Le nom de la boutique ne peut contenir que des lettres et des chiffres (sans espaces, caractères spéciaux ou emojis).',
    errShopNameTaken: 'Ce nom de boutique est déjà pris.',
    errVerifyingShop: 'Erreur lors de la vérification du nom de la boutique.',
    errSelectCity: 'Veuillez sélectionner votre ville.',
    errCreateShopFailed: 'Échec de la création de la boutique. Veuillez réessayer.',
  },
  ar: {
    welcomeTitle: 'ابدأ البيع على أفوس',
    welcomeSubtitle: 'انضم إلى مئات الحرفيين المغاربة وتواصل مباشرة مع المشترين في جميع أنحاء البلاد.',
    feat1: 'إدراج المنتجات مجاناً',
    feat2: 'الدفع عند الاستلام عبر أمانة',
    feat3: 'منصة آمنة وموثقة',
    feat4: 'الوصول إلى المشترين في كل مكان',
    getStarted: 'ابدأ الآن',
    alreadyHaveAccount: 'هل لديك حساب بالفعل؟',
    signIn: 'تسجيل الدخول',
    accountTitle: 'أنشئ حسابك',
    accountSubtitle: 'بياناتك الشخصية لتسجيل الدخول.',
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
    welcomeTitle: 'ⵙⵏⵜⵉ ⴰⵣⵣⵏⵣⵉ ⴳ ⴰⴼⵓⵙ',
    welcomeSubtitle: 'ⴷⵔⵓ ⴷ ⵉⵎⴳⵓⵔⵉⵢⵏ ⵉⵎⵖⵔⵉⴱⵉⵢⵏ ⴷ ⵎⵙⴰⵡⴰⴹ ⴷ ⵉⵎⵙⴰⵖⵏ.',
    feat1: 'ⵙⵔⵙ ⵜⵉⴳⴰⵡⵉⵏ ⵏⵏⴽ ⴼⴰⴱⵓⵔ',
    feat2: 'ⴰⵙⵖⵏ ⴳ ⵓⵎⵣⴰⵖ ⵙ ⴰⵎⴰⵏⴰ',
    feat3: 'ⵜⴰⵙⵏⵙⵉⵜ ⵉⵜⵜⵓⴼⵔⴰⵏ',
    feat4: 'ⴰⵡⴹ ⵉⵎⵙⴰⵖⵏ ⴳ ⴽⵓ ⴰⴷⵖⴰาร',
    getStarted: 'ⵙⵏⵜⵉ',
    alreadyHaveAccount: 'ⵉⵍⵍⴰ ⵖⵓⵔⴽ ⴰⵎⵉⴹⴰⵏ?',
    signIn: 'ⴽⵛⵎ',
    accountTitle: 'ⵙⵏⴼⵍ ⴰⵎⵉⴹⴰⵏ ⵏⵏⴽ',
    accountSubtitle: 'ⵉⵏⵖ密ⵙⵏ ⵏⵏⴽ ⵉ ⵓⴽⵛⵛⵓⵎ.',
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

export default function StoreOnboardingModal({ isOpen, onClose, lang }: StoreOnboardingModalProps) {
  const t = labels[lang] || labels.en;

  const [hasSession, setHasSession] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('afus_session_user');
    }
    return false;
  });

  const [step, setStep] = useState<Step>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('afus_session_user')) {
      return 'store';
    }
    return 'account';
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
  const [openCity, setOpenCity] = useState(false);
  const [address, setAddress] = useState('');

  // Product fields
  const [productTitle, setProductTitle] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [productCategory, setProductCategory] = useState('cat_home_living');
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
  const contentSteps: Step[] = hasSession ? ['store', 'product', 'location', 'summary'] : ['account', 'store', 'product', 'location', 'summary'];
  const contentStepIndex = contentSteps.indexOf(step);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep(hasSession ? 'store' : 'account');
      setIsLoginMode(false);
      setError('');
      setFullName(''); setEmail(''); setPassword(''); setPhone('');
      setLoginEmail(''); setLoginPassword('');
      setShopName(''); setShopDesc('');
      setCity(''); setAddress('');
      setProductTitle('');
      setProductPrice('');
      setProductImageFile(null);
      setProductImagePreview(null);
      setProductCategory('cat_home_living');
      setCreatedProduct(null);
      setReviewIdx(0);

      getActiveSession().then((session) => {
        if (session) {
          setHasSession(true);
          setStep((prev) => (prev === 'account' ? 'store' : prev));
        } else {
          setHasSession(false);
          setStep((prev) => (prev === 'store' ? 'account' : prev));
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

  const handleAccountNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) { setError(t.errFillRequired); return; }
    if (password.length < 6) { setError(t.errPasswordLength); return; }
    setError('');
    setStep('store');
  };

  const handleStoreNext = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = shopName.trim();
    if (!cleanName) { setError(t.errShopNameEmpty); return; }
    if (cleanName.length < 4 || cleanName.length > 20) { setError(t.errShopNameLength); return; }
    if (!/^[a-zA-Z0-9]+$/.test(cleanName)) { setError(t.errShopNameFormat); return; }
    
    setLoading(true);
    try {
      const isAvailable = await checkShopSlugAvailable(cleanName.toLowerCase());
      if (!isAvailable) {
        setError(t.errShopNameTaken);
        setLoading(false);
        return;
      }
      setError('');
      setStep('product');
    } catch (err) {
      setError(t.errVerifyingShop);
    } finally {
      setLoading(false);
    }
  };

  const handleProductNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    if (productTitle || productPrice || productImageFile) {
      if (!productTitle) {
        setError(lang === 'fr' ? 'Veuillez saisir un titre de produit.' : lang === 'ar' ? 'يرجى إدخال اسم المنتج.' : 'Please enter a product title.');
        return;
      }
      if (!productPrice) {
        setError(lang === 'fr' ? 'Veuillez saisir un prix.' : lang === 'ar' ? 'يرجى إدخال السعر.' : 'Please enter a price.');
        return;
      }
      if (!productImageFile) {
        setError(lang === 'fr' ? 'Veuillez ajouter une photo.' : lang === 'ar' ? 'يرجى إضافة صورة.' : 'Please add a photo.');
        return;
      }
    }

    setStep('location');
  };

  const handleProductSkip = () => {
    setProductTitle('');
    setProductPrice('');
    setProductImageFile(null);
    setProductImagePreview(null);
    setError('');
    setStep('location');
  };

  const handleLocationNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city) { setError(t.errSelectCity); return; }
    setError('');
    setStep('summary');
  };

  const handleCreateShop = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!city) { setError(t.errSelectCity); return; }
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
          shopName,
          merchantCity: city,
          pickupAddress: address,
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
          shopName,
          merchantCity: city,
          pickupAddress: address,
        });
        createdShop = result.shop;
        setCreatedShopSlug(result.shop?.slug || '');
      }

      // Create product if details and image are provided
      if (createdShop && productTitle && productPrice && productImageFile) {
        // Upload image — throw on failure so the user sees the error
        const uploadedProductImageUrl = await uploadImage(productImageFile);

        if (uploadedProductImageUrl) {
          const productRes = await fetch('/api/products/onboarding', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              shop_id: createdShop.id,
              category_id: productCategory || 'cat_home_living',
              title: productTitle,
              price: productPrice,
              imageUrl: uploadedProductImageUrl,
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={() => {
          if (step === 'success') {
            handleSuccessRedirect();
          } else {
            onClose();
          }
        }}
      />

      {/* Modal Container — Centered, non-fullscreen, arabic-frame corners */}
      <div className={`relative z-10 w-full max-w-xl md:max-w-2xl bg-white shadow-2xl arabic-frame flex flex-col max-h-[90vh] overflow-hidden ${lang === 'tz' ? 'font-tifinagh' : ''}`}>

        {/* Unified header */}
        <div className="flex items-center justify-between px-6 py-4 md:px-10 lg:px-14 md:py-6 border-b border-neutral-100 bg-white z-20">
          <div className="flex items-center gap-2 md:gap-3">
            <img src="/logo/logo.png" alt="Afus" className="w-6 h-6 md:w-8 md:h-8 object-contain !rounded-none" />
            <img src="/logo/afus.svg" alt="afus" className="h-4 md:h-5 object-contain !rounded-none" />
          </div>
          <div className="flex items-center gap-4">

            {/* Close button */}
            <button
              onClick={() => {
                if (step === 'success') {
                  handleSuccessRedirect();
                } else {
                  onClose();
                }
              }}
              className="w-10 h-10 rounded-full bg-neutral-50 md:bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-100 transition-all"
            >
              <IconX className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto relative flex flex-col min-h-0">
          
          {/* ── GLOBAL STEPPER ── */}
          {!isLoginMode && step !== 'success' && (
            <div className="absolute top-6 md:top-8 left-6 right-6 md:left-10 md:right-10 z-10 pointer-events-none">
              <div className="w-full max-w-md mx-auto pointer-events-auto">
                {step !== 'account' && !(step === 'store' && hasSession) && (
                  <button
                    onClick={() => {
                      setError('');
                      if (step === 'store') setStep('account');
                      else if (step === 'product') setStep('store');
                      else if (step === 'location') setStep('product');
                      else if (step === 'summary') setStep('location');
                    }}
                    className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-black mb-4 transition-colors"
                  >
                    <IconArrowLeft className="w-4 h-4" strokeWidth={2} />
                    <span>{t.back}</span>
                  </button>
                )}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-neutral-500 text-xs font-bold uppercase tracking-wider">
                      <span>{t.step} {contentStepIndex + 1} {t.of} {contentSteps.length}</span>
                      <span>{Math.round(progressPercent)}%</span>
                    </div>

                    <div className="flex gap-1.5">
                      {contentSteps.map((s, i) => (
                        <div
                          key={s}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            i <= contentStepIndex ? 'bg-primary' : 'bg-neutral-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 min-h-full flex items-center justify-center p-6 md:p-10 lg:p-14">
              <div className="w-full max-w-md">

              {/* ── LOGIN MODE ── */}
                {isLoginMode && (
                  <div className="space-y-6 text-center">
                    <div>
                      <button
                        onClick={() => { setIsLoginMode(false); setError(''); }}
                        className="flex items-center justify-center gap-1.5 text-sm text-neutral-500 hover:text-black mb-6 transition-colors mx-auto"
                      >
                        <IconArrowLeft className="w-4 h-4" strokeWidth={2} />
                        <span>{t.back}</span>
                      </button>
                      <h1 className="text-3xl md:text-4xl font-bold !font-ariom text-neutral-900 leading-tight">{t.signIn}</h1>
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
                        disabled={loading}
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
                  <div className="space-y-6 text-center">
                    <div>


                      <h1 className="text-3xl md:text-4xl font-bold !font-ariom text-neutral-900 leading-tight">{t.accountTitle}</h1>
                      <p className="text-neutral-500 mt-2 text-base">{t.accountSubtitle}</p>
                    </div>

                    <form onSubmit={handleAccountNext} className="space-y-4 text-left">
                      {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                          {error}
                        </div>
                      )}

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



                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-full font-bold text-base hover:bg-primary/90 transition-all mt-8"
                      >
                        {t.next}
                        <IconArrowRight className="w-5 h-5" strokeWidth={2.5} />
                      </button>

                      <div className="flex items-center gap-3 my-2">
                        <div className="flex-1 h-px bg-neutral-200" />
                        <span className="text-xs text-neutral-400 font-medium">{t.or}</span>
                        <div className="flex-1 h-px bg-neutral-200" />
                      </div>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => { setIsLoginMode(true); setError(''); }}
                          className="text-sm text-primary font-semibold hover:underline"
                        >
                          {t.alreadyHaveAccount} {t.signIn}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* ── STEP 2: STORE ── */}
                {step === 'store' && (
                  <div className="space-y-6 text-center">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold !font-ariom text-neutral-900 leading-tight">{t.storeTitle}</h1>
                      <p className="text-neutral-500 mt-2 text-base">{t.storeSubtitle}</p>
                    </div>

                    <form onSubmit={handleStoreNext} className="space-y-4">
                      {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                          {error}
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="relative">
                          <input
                            type="text"
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            className="w-full border border-neutral-200 rounded-2xl px-4 py-3.5 text-base text-center text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300"
                            placeholder={t.shopNamePlaceholder}
                          />
                        </div>
                        {shopName && (
                          <p className="text-xs text-neutral-400 mt-1">
                            afus.ma/shop/{shopName.toLowerCase()}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-full font-bold text-base hover:bg-primary/90 transition-all mt-8"
                      >
                        {t.next}
                        <IconArrowRight className="w-5 h-5" strokeWidth={2.5} />
                      </button>
                    </form>
                  </div>
                )}

                {/* ── STEP 3: PRODUCT ── */}
                {step === 'product' && (
                  <div className="space-y-6 text-center">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold !font-ariom text-neutral-900 leading-tight">{t.productTitle}</h1>
                      <p className="text-neutral-500 mt-2 text-base">{t.productSubtitle}</p>
                    </div>

                    <form onSubmit={handleProductNext} className="space-y-4 text-left">
                      {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                          {error}
                        </div>
                      )}

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

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-sm font-semibold text-black block">{t.productPrice} <span className="text-red-500">*</span></label>
                          <input
                            type="number"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                            className="w-full border border-neutral-200 rounded-2xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300"
                            placeholder={t.productPricePlaceholder}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-semibold text-black block">{t.productCategory} <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <select
                              value={productCategory}
                              onChange={(e) => setProductCategory(e.target.value)}
                              className="w-full border border-neutral-200 rounded-2xl pl-4 pr-10 py-3 text-sm text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300 appearance-none cursor-pointer"
                            >
                              {staticCategories.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name[lang as 'en'|'fr'|'ar'|'tz'] || c.name.en}
                                </option>
                              ))}
                            </select>
                            <IconSelector className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" strokeWidth={1.8} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-black block">{t.productImage} <span className="text-red-500">*</span></label>
                        <div className="relative border-2 border-dashed border-neutral-200 rounded-2xl hover:border-primary/50 transition-all p-6 flex flex-col items-center justify-center bg-neutral-50 hover:bg-white cursor-pointer group">
                          {productImagePreview ? (
                            <div className="relative w-full max-h-40 rounded-xl overflow-hidden flex items-center justify-center">
                              <img src={productImagePreview} alt="Product preview" className="object-cover max-h-40 rounded-xl" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider">
                                {lang === 'fr' ? 'Changer' : lang === 'ar' ? 'تغيير' : 'Change'}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center space-y-1">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                                <IconPackage className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-black">
                                  {lang === 'fr' ? 'Déposer une photo ou cliquer' : lang === 'ar' ? 'اسحب صورة أو انقر هنا' : 'Drop a photo or click'}
                                </p>
                                <p className="text-[10px] text-neutral-500 mt-0.5">{t.productImageHelp}</p>
                              </div>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                setProductImageFile(file);
                                setProductImagePreview(URL.createObjectURL(file));
                              }
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-full font-bold text-base hover:bg-primary/90 transition-all mt-6 cursor-pointer"
                      >
                        {t.next}
                        <IconArrowRight className="w-5 h-5" strokeWidth={2.5} />
                      </button>

                      <div className="text-center mt-2">
                        <button
                          type="button"
                          onClick={handleProductSkip}
                          className="text-xs text-neutral-500 font-bold hover:text-black transition-colors underline cursor-pointer"
                        >
                          {t.skipStep}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* ── STEP 4: LOCATION ── */}
                {step === 'location' && (
                  <div className="space-y-6 text-center">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold !font-ariom text-neutral-900 leading-tight">{t.locationTitle}</h1>
                      <p className="text-neutral-500 mt-2 text-base">{t.locationSubtitle}</p>
                    </div>

                    <div className="space-y-4">
                      {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                          {error}
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-black block">{t.city} <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <IconMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 z-10 pointer-events-none" strokeWidth={1.8} />
                          <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full border border-neutral-200 rounded-xl pl-10 pr-10 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all bg-neutral-50 hover:bg-white appearance-none cursor-pointer"
                          >
                            <option value="" disabled>{t.selectCity}</option>
                            {MOROCCAN_CITIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <IconSelector className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 z-10 pointer-events-none" strokeWidth={1.8} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-black block">{t.address}</label>
                        <div className="relative">
                          <IconMapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" strokeWidth={1.8} />
                          <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={2}
                            className="w-full border border-neutral-200 rounded-xl pl-10 pr-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all bg-neutral-50 hover:bg-white resize-none"
                            placeholder={t.addressPlaceholder}
                          />
                        </div>
                      </div>



                      <button
                        type="button"
                        onClick={handleLocationNext}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-full font-bold text-base hover:bg-primary/90 transition-all mt-8"
                      >
                        {t.next}
                        <IconArrowRight className="w-5 h-5" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── STEP 5: SUMMARY ── */}
                {step === 'summary' && (
                  <div className="space-y-6 text-center">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold !font-ariom text-neutral-900 leading-tight">{t.summaryTitle}</h1>
                      <p className="text-neutral-500 mt-2 text-base">{t.summarySubtitle}</p>
                    </div>

                    <form onSubmit={handleCreateShop} className="space-y-4">
                      {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                          {error}
                        </div>
                      )}

                      {/* Preview card */}
                      {productTitle && productImagePreview ? (
                        <div className="arabic-frame bg-neutral-200 p-[1px] max-w-sm mx-auto shadow-sm">
                          <div className="arabic-frame bg-white p-4 flex flex-col text-left space-y-3">
                            <div className="arabic-frame aspect-square w-full bg-neutral-100 overflow-hidden relative">
                              <img
                                src={productImagePreview}
                                alt={productTitle}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                                {staticCategories.find(c => c.id === productCategory)?.name[lang as 'en'|'fr'|'ar'|'tz'] || 'Craft'}
                              </span>
                              <h3 className="font-bold text-neutral-900 text-lg mt-0.5 line-clamp-1">{productTitle}</h3>
                              <p className="text-sm font-bold text-black mt-1 font-sans">{productPrice} MAD</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        shopName && (
                          <div className="arabic-frame bg-neutral-200 p-[1px] max-w-sm mx-auto">
                            <div className="arabic-frame bg-neutral-50 py-4 pr-4 pl-6 flex items-center gap-3 text-left">
                              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                <span className="text-primary font-bold text-lg uppercase">{shopName.charAt(0)}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-black text-sm truncate">{shopName}</p>
                                <p className="text-xs text-neutral-500 truncate">{shopDesc || t.defaultShopDesc}</p>
                              </div>
                            </div>
                          </div>
                        )
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-full font-bold text-base hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2 justify-center w-full">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {t.creating}
                          </span>
                        ) : (
                          <>
                            {t.createShop}
                            <IconCheck className="w-5 h-5" strokeWidth={2.5} />
                          </>
                        )}
                      </button>
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
                      <h1 className="text-3xl md:text-4xl font-bold !font-ariom text-neutral-900 leading-tight">{t.successTitle}</h1>
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
