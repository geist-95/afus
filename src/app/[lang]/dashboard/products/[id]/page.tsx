'use client';

import { useState, useEffect, use } from 'react';
import MediaUploader from '@/components/ui/media-uploader';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getActiveSession } from '@/lib/auth';
import { fetchProductById, updateProductListing } from '@/lib/supabase';
import { taxonomy, suggestCategories, translateCategory, translateSubcategory } from '@/lib/categories';
import { DashboardPageSkeleton } from '@/components/ui/Skeleton';
import { X, Search, Package, FileText, ChevronLeft, Info, HelpCircle, Plus, ExternalLink, Copy, MoreHorizontal } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const localDicts = {
  en: {
    backToListings: "Back to listings",
    newListing: "New listing",
    editListing: "Edit listing",
    draft: "Draft",
    notListedYet: "Not listed yet",
    advanced: "Advanced",
    viewOnAfus: "View on Afus",
    copy: "Copy",
    tabs: {
      about: "About",
      price: "Price & Inventory",
      variations: "Variations",
      details: "Details",
      shipping: "Shipping",
      settings: "Settings"
    },
    about: {
      title: "About",
      subtitle: "Tell the world all about your item and why they'll love it.",
      titleLabel: "Title",
      titleHelper: "Include keywords that buyers would use to search for this item.",
      translateLabel: "Translate to other languages",
      categoryLabel: "Category",
      categoryPlaceholder: "Search for a category, e.g. Hats, Rings, Pillows...",
      advancedLabel: "Advanced details (Optional)",
      itemType: "Type",
      physicalItem: "Physical Item",
      digitalFile: "Digital File",
      whoMadeIt: "Who made it?",
      iDid: "I did",
      member: "A member of my shop",
      anotherCompany: "Another company",
      whenWasItMade: "When was it made?",
      madeToOrder: "Made To Order",
      recently: "Recently (2020 - 2025)",
      vintage: "Vintage (Before 2005)",
      photosLabel: "Photos and video",
      photosHelper: "Add up to 10 photos and 1 video.",
      descriptionLabel: "Description",
      descriptionHelper: "What makes your item special? Buyers will only see the first few lines unless they expand the description.",
      personalizationLabel: "Allow buyers to customize this item (Made to order)",
      personalizationHelper: "Collect personalized information for this listing.",
      personalizationInstructions: "Instructions for buyers",
      personalizationPlaceholder: "Include the details you want to include... If you don't want customization, just leave blank.",
      personalizationInstructionsHelper: "Enter the instructions you want buyers to see.",
      charLimit: "Character limit for buyer response",
      makeOptional: "Make customization optional for the buyer"
    },
    price: {
      title: "Price & Inventory",
      priceLabel: "Price (MAD)"
    },
    variations: {
      title: "Variations",
      subtitle: "This item has different options (like sizes or colors).",
      addBtn: "Add variations",
      pricesVary: "Prices vary",
      pricingTable: "Pricing",
      variantsCount: "variants",
      variantCol: "Variant",
      priceCol: "Price (MAD)",
      visibleCol: "Visible",
      modalTitle: "What type of variation is it?",
      modalDesc: "You can add up to 2 variations. Use the variation types listed here for peak discoverability. You can add a custom variation, but buyers won't see the option in filters.",
      createOwn: "Create your own",
      customVariation: "Custom variation",
      nameLabel: "Name",
      linkPhotos: "Link photos to this variation",
      optionsLabel: "Options",
      optionsDesc: "Buyers can choose from the following options. Use the options listed here for peak discoverability. Buyers won't see custom options in filters.",
      optionNameCol: "Option Name",
      priceColHeader: "Price (MAD)",
      addOptionBtn: "Add Option",
      addAtLeastOne: "Add at least 1 option",
      manageVariations: "Manage variations",
      optionsCount: "options",
      addVariationBtn: "Add a variation",
      presets: {
        primaryColor: "Primary color",
        secondaryColor: "Secondary color",
        primaryFabric: "Primary fabric type",
        secondaryFabric: "Secondary fabric type"
      }
    },
    details: {
      title: "Details",
      subtitle: "Add optional details to help buyers find your item.",
      tagsLabel: "Tags",
      tagsHelper: "Add up to 13 tags to help people search for your listings.",
      addBtn: "Add",
      left: "left",
      materialsLabel: "Materials",
      materialsHelper: "Buyers value transparency—tell them what's used to make your item."
    },
    shipping: {
      title: "Shipping",
      subtitle: "Specify how you want to ship your item to buyers.",
      optionsLabel: "Shipping Options",
      amanaTitle: "Amana (National Shipping)",
      amanaDesc: "Ship products across Morocco using Amana service",
      handTitle: "In Hand / Local Pickup",
      handDesc: "Hand delivery or local pickup by the customer",
      processingLabel: "Processing time",
      weightSizeTitle: "Item weight and size",
      removeWeightBtn: "Remove weight & size",
      addWeightBtn: "Add weight & size",
      weightLabel: "Item weight (kg)",
      sizeTitle: "Item size (when packed)",
      sizeHelper: "Enter size in centimeters (cm)",
      length: "Length",
      width: "Width",
      height: "Height"
    },
    settings: {
      title: "Settings",
      returnsTitle: "Returns and exchanges",
      changePolicy: "Change Policy",
      policyHelper: "Buyer can contact seller about any issues with an order.",
      sectionTitle: "Shop section (optional)",
      sectionHelper: "Group related listings into Sections to help shoppers browse.",
      noneOption: "None / Add a section",
      featureTitle: "Feature this listing (optional)",
      featureHelper: "Display this listing at the top of your shop's homepage. You can feature up to 4 listings.",
      yes: "Yes",
      no: "No"
    },
    buttons: {
      cancel: "Cancel",
      publish: "Publishing...",
      saveContinue: "Save and continue"
    }
  },
  fr: {
    backToListings: "Retour aux fiches",
    newListing: "Nouvelle fiche",
    editListing: "Modifier l'annonce",
    draft: "Brouillon",
    notListedYet: "Pas encore en ligne",
    advanced: "Avancé",
    viewOnAfus: "Voir sur Afus",
    copy: "Copier",
    tabs: {
      about: "À propos",
      price: "Prix et inventaire",
      variations: "Variations",
      details: "Détails",
      shipping: "Livraison",
      settings: "Paramètres"
    },
    about: {
      title: "À propos",
      subtitle: "Présentez votre article au monde entier.",
      titleLabel: "Titre",
      titleHelper: "Incluez des mots-clés que les acheteurs utiliseraient pour rechercher cet article.",
      translateLabel: "Traduire dans d'autres langues",
      categoryLabel: "Catégorie",
      categoryPlaceholder: "Rechercher une catégorie (ex: Chapeaux, Bagues...)",
      advancedLabel: "Détails avancés (Optionnel)",
      itemType: "Type",
      physicalItem: "Article physique",
      digitalFile: "Fichier numérique",
      whoMadeIt: "Qui l'a fait ?",
      iDid: "Je l'ai fait",
      member: "Un membre de ma boutique",
      anotherCompany: "Une autre entreprise",
      whenWasItMade: "Quand a-t-il été fait ?",
      madeToOrder: "Fait sur commande",
      recently: "Récemment (2020 - 2025)",
      vintage: "Vintage (Avant 2005)",
      photosLabel: "Photos et vidéo",
      photosHelper: "Ajoutez jusqu'à 10 photos et 1 vidéo.",
      descriptionLabel: "Description",
      descriptionHelper: "Qu'est-ce qui rend votre article spécial ? Les acheteurs ne verront que les premières lignes.",
      personalizationLabel: "Sur commande (Personnalisation)",
      personalizationHelper: "Recueillez les détails de personnalisation pour cette fiche.",
      personalizationInstructions: "Instructions pour les acheteurs",
      personalizationPlaceholder: "Entrez le texte ou les instructions de personnalisation...",
      personalizationInstructionsHelper: "Saisissez les instructions de personnalisation que vous souhaitez afficher pour les acheteurs.",
      charLimit: "Limite de caractères",
      makeOptional: "Rendre la personnalisation facultative"
    },
    price: {
      title: "Prix et inventaire",
      priceLabel: "Prix (MAD)"
    },
    variations: {
      title: "Variations",
      subtitle: "Cet article propose différentes options (taille, couleur).",
      addBtn: "Ajouter des variations",
      pricesVary: "Les prix varient",
      pricingTable: "Tarification",
      variantsCount: "variantes",
      variantCol: "Variante",
      priceCol: "Prix (MAD)",
      visibleCol: "Visible",
      modalTitle: "De quel type de variation s'agit-il ?",
      modalDesc: "Vous pouvez ajouter jusqu'à 2 variations. Utilisez les types de variations listés ici pour une visibilité maximale. Vous pouvez ajouter une variation personnalisée, mais les acheteurs ne verront pas l'option dans les filtres.",
      createOwn: "Créer votre propre variation",
      customVariation: "Variation personnalisée",
      nameLabel: "Nom",
      linkPhotos: "Associer des photos à cette variation",
      optionsLabel: "Options",
      optionsDesc: "Les acheteurs peuvent choisir parmi les options suivantes. Utilisez les options listées ici pour une visibilité maximale. Les acheteurs ne verront pas les options personnalisées dans les filtres.",
      optionNameCol: "Nom de l'option",
      priceColHeader: "Prix (MAD)",
      addOptionBtn: "Ajouter une option",
      addAtLeastOne: "Ajoutez au moins 1 option",
      manageVariations: "Gérer les variations",
      optionsCount: "options",
      addVariationBtn: "Ajouter une variation",
      presets: {
        primaryColor: "Couleur principale",
        secondaryColor: "Couleur secondaire",
        primaryFabric: "Type de tissu principal",
        secondaryFabric: "Type de tissu secondaire"
      }
    },
    details: {
      title: "Détails",
      subtitle: "Ajoutez des détails pour aider les acheteurs à trouver votre article.",
      tagsLabel: "Tags",
      tagsHelper: "Ajoutez jusqu'à 13 tags pour optimiser les recherches.",
      addBtn: "Ajouter",
      left: "restants",
      materialsLabel: "Matériaux",
      materialsHelper: "Dites aux acheteurs ce qui est utilisé pour fabriquer cet article."
    },
    shipping: {
      title: "Livraison",
      subtitle: "Spécifiez les options de livraison pour vos acheteurs.",
      optionsLabel: "Options de livraison",
      amanaTitle: "Amana (Livraison Nationale)",
      amanaDesc: "Expédiez vos colis partout au Maroc via le service Amana",
      handTitle: "Remise en main propre",
      handDesc: "Livraison en main propre ou retrait par le client",
      processingLabel: "Temps de traitement",
      weightSizeTitle: "Poids et dimensions",
      removeWeightBtn: "Supprimer le poids & dimensions",
      addWeightBtn: "Ajouter le poids & dimensions",
      weightLabel: "Poids de l'article (kg)",
      sizeTitle: "Dimensions de l'article",
      sizeHelper: "Saisissez les dimensions en centimètres (cm)",
      length: "Longueur",
      width: "Largeur",
      height: "Hauteur"
    },
    settings: {
      title: "Paramètres",
      returnsTitle: "Retours et échanges",
      changePolicy: "Modifier la politique",
      policyHelper: "L'acheteur peut contacter le vendeur en cas de problème.",
      sectionTitle: "Section de boutique (optionnel)",
      sectionHelper: "Regroupez vos fiches dans des sections pour faciliter la navigation.",
      noneOption: "Aucune / Ajouter une section",
      featureTitle: "Mettre cette fiche en vedette (optionnel)",
      featureHelper: "Affichez cette fiche en haut de la page d'accueil de votre boutique.",
      yes: "Oui",
      no: "Non"
    },
    buttons: {
      cancel: "Annuler",
      publish: "Publication...",
      saveContinue: "Enregistrer et continuer"
    }
  },
  ar: {
    backToListings: "العودة إلى القوائم",
    newListing: "قائمة جديدة",
    editListing: "تعديل المنتج",
    draft: "مسودة",
    notListedYet: "لم يتم نشره بعد",
    advanced: "متقدم",
    viewOnAfus: "عرض على أفس",
    copy: "نسخ",
    tabs: {
      about: "معلومات",
      price: "السعر والمخزون",
      variations: "خيارات المتغيرات",
      details: "تفاصيل",
      shipping: "الشحن",
      settings: "الإعدادات"
    },
    about: {
      title: "معلومات",
      subtitle: "أخبر العالم بكل شيء عن منتجك ولماذا سيحبونه.",
      titleLabel: "العنوان",
      titleHelper: "تضمين الكلمات المفتاحية التي يستخدمها المشترون للبحث.",
      translateLabel: "ترجمة إلى لغات أخرى",
      categoryLabel: "الفئة",
      categoryPlaceholder: "ابحث عن فئة، مثل قبعات، خواتم...",
      advancedLabel: "تفاصيل متقدمة (اختياري)",
      itemType: "النوع",
      physicalItem: "منتج مادي",
      digitalFile: "ملف رقمي",
      whoMadeIt: "من صنعه؟",
      iDid: "أنا صنعته",
      member: "عضو في متجري",
      anotherCompany: "شركة أخرى",
      whenWasItMade: "متى تم صنعه؟",
      madeToOrder: "صنع حسب الطلب",
      recently: "حديثاً (2020 - 2025)",
      vintage: "قديم (قبل 2005)",
      photosLabel: "الصور والفيديو",
      photosHelper: "أضف ما يصل إلى 10 صور وفيديو واحد.",
      descriptionLabel: "الوصف",
      descriptionHelper: "ما الذي يجعل منتجك مميزاً؟ سيرى المشترون الأسطر الأولى فقط.",
      personalizationLabel: "تحت الطلب (السماح بالتخصيص)",
      personalizationHelper: "جمع معلومات التخصيص لهذه القائمة.",
      personalizationInstructions: "إرشادات للمشترين",
      personalizationPlaceholder: "أدخل إرشادات التخصيص الخاصة بك...",
      personalizationInstructionsHelper: "أدخل إرشادات التخصيص التي تريد أن يراها المشترون.",
      charLimit: "الحد الأقصى للحروف",
      makeOptional: "اجعل التخصيص اختيارياً للمشتري"
    },
    price: {
      title: "السعر والمخزون",
      priceLabel: "السعر (درهم)"
    },
    variations: {
      title: "المتغيرات",
      subtitle: "يحتوي هذا المنتج على خيارات مختلفة (مثل المقاسات أو الألوان).",
      addBtn: "إضافة متغيرات",
      pricesVary: "الأسعار تختلف",
      pricingTable: "التسعير",
      variantsCount: "متغيرات",
      variantCol: "المتغير",
      priceCol: "السعر (درهم)",
      visibleCol: "مرئي",
      modalTitle: "ما هو نوع هذا المتغير؟",
      modalDesc: "يمكنك إضافة ما يصل إلى خيارين للمتغيرات. استخدم الأنواع المدرجة هنا لتحقيق أقصى قدر من القابلية للاكتشاف. يمكنك إضافة متغير مخصص، ولكن لن يراه المشترون في الفلاتر.",
      createOwn: "إنشاء متغير خاص بك",
      customVariation: "متغير مخصص",
      nameLabel: "الاسم",
      linkPhotos: "ربط الصور بهذا المتغير",
      optionsLabel: "الخيارات",
      optionsDesc: "يمكن للمشترين الاختيار من بين الخيارات التالية. استخدم الخيارات المدرجة هنا لتحسين البحث. لن يرى المشترون الخيارات المخصصة في الفلاتر.",
      optionNameCol: "اسم الخيار",
      priceColHeader: "السعر (درهم)",
      addOptionBtn: "إضافة خيار",
      addAtLeastOne: "أضف خيارًا واحدًا على الأقل",
      manageVariations: "إدارة المتغيرات",
      optionsCount: "خيارات",
      addVariationBtn: "إضافة متغير",
      presets: {
        primaryColor: "اللون الأساسي",
        secondaryColor: "اللون الثانوي",
        primaryFabric: "نوع النسيج الأساسي",
        secondaryFabric: "نوع النسيج الثانوي"
      }
    },
    details: {
      title: "التفاصيل",
      subtitle: "أضف تفاصيل اختيارية لمساعدة المشترين في العثور على منتجك.",
      tagsLabel: "الوسوم",
      tagsHelper: "أضف ما يصل إلى 13 وسماً لتحسين البحث.",
      addBtn: "إضافة",
      left: "متبقي",
      materialsLabel: "المواد",
      materialsHelper: "يُقدِّر المشترون الشفافية — أخبرهم بالمواد المستخدمة في صنع منتجك."
    },
    shipping: {
      title: "الشحن",
      subtitle: "حدد كيف تريد شحن منتجك للمشترين.",
      optionsLabel: "خيارات الشحن",
      amanaTitle: "أمانة (شحن وطني)",
      amanaDesc: "شحن المنتجات في جميع أنحاء المغرب عبر خدمة أمانة",
      handTitle: "تسليم باليد / استلام محلي",
      handDesc: "التسليم باليد أو الاستلام المحلي من قبل الزبون",
      processingLabel: "وقت المعالجة",
      weightSizeTitle: "وزن وحجم المنتج",
      removeWeightBtn: "إزالة الوزن والحجم",
      addWeightBtn: "إضافة الوزن والحجم",
      weightLabel: "وزن المنتج (كجم)",
      sizeTitle: "حجم المنتج (عند التعبئة)",
      sizeHelper: "أدخل الأبعاد بالسنتيمتر (سم)",
      length: "الطول",
      width: "العرض",
      height: "الارتفاع"
    },
    settings: {
      title: "الإعدادات",
      returnsTitle: "المرتجعات والاستبدال",
      changePolicy: "تغيير السياسة",
      policyHelper: "يمكن للمشتري الاتصال بالبائع بشأن أي مشاكل في الطلب.",
      sectionTitle: "قسم المتجر (اختياري)",
      sectionHelper: "صنف المنتجات في أقسام لتسهيل التصفح.",
      noneOption: "بلا قسم / إضافة قسم جديد",
      featureTitle: "تمييز هذا المنتج (اختياري)",
      featureHelper: "عرض هذا المنتج في أعلى الصفحة الرئيسية لمتجرك.",
      yes: "نعم",
      no: "لا"
    },
    buttons: {
      cancel: "إلغاء",
      publish: "جاري النشر...",
      saveContinue: "حفظ ومتابعة"
    }
  },
  tz: {
    backToListings: "ⴰⵖⵓⵍ ⵖⵔ ⵜⵍⴳⴰⵎⵉⵏ",
    newListing: "ⵜⴰⴼⵉⵍⵜ ⵜⴰⵎⴰⵢⵏⵓⵜ",
    editListing: "ⵙⵏⴼⵍ ⵜⴰⴼⵉⵍⵜ",
    draft: "ⴱⵔⵓⵢⵓ",
    notListedYet: "ⵓⵔ ⵜⵍⵍⵉ ⴳ ⵓⵥⵟⵟⴰ",
    advanced: "ⴰⵎⴰⵜⵜⴰⵢ",
    viewOnAfus: "ⵥⵕ ⴳ Afus",
    copy: "ⵙⵙⵏⴼⵍ",
    tabs: {
      about: "ⵇⵇⵛ",
      price: "ⴰⵜⵉⴳ ⴷ ⵓⵙⵡⵓⴷⴷⵓ",
      variations: "ⵜⵉⵏⴼⵔⵓⵜⵉⵏ",
      details: "ⵜⵉⴼⴰⵡⵉⵏ",
      shipping: "ⴰⵙⵉⵡⴹ",
      settings: "ⵜⵉⵙⵖⴰⵍ"
    },
    about: {
      title: "ⵇⵇⵛ",
      subtitle: "ⵙⵙⴼⴰⵡ ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏⵏⴽ ⵉ ⵓⵎⴰⴹⴰⵍ ⴰⴽⴽⵯ.",
      titleLabel: "ⴰⵣⵡⵉⵍ",
      titleHelper: "ⵙⴽⵛⵎ ⵜⵉⴳⵓⵔⵉⵡⵉⵏ ⵜⵉⴼⴰⵡⵉⵏ ⵏ ⵓⵙⵉⴳⴳⵍ.",
      translateLabel: "ⵙⵙⵏⴼⵍ ⵖⵔ ⵜⵓⵜⵍⴰⵢⵉⵏ ⵢⴰⴹⵏ",
      categoryLabel: "ⵜⴰⴳⵔⵓⵎⵎⴰ",
      categoryPlaceholder: "ⴰⴼ ⵜⴰⴳⵔⵓⵎⵎⴰ...",
      advancedLabel: "ⵜⵉⴼⴰⵡⵉⵏ ⵢⴰⴹⵏ (ⴼⵔⵏ)",
      itemType: "ⴰⵏⴰⵡ",
      physicalItem: "ⵜⴰⵖⴰⵡⵙⴰ ⵜⴰⵎⴰⴷⴷⵓⴷⵜ",
      digitalFile: "ⴰⴼⴰⵢⵍⵓ ⵓⵟⵟⵓⵏⴰⵏ",
      whoMadeIt: "ⵎⴰⵏ ⵜ ⵉⵙⴽⵔⵏ?",
      iDid: "ⵏⴽⴽⵉ ⵜ ⵉⵙⴽⵔⵏ",
      member: "ⴰⵎⴷⵔⴰⵡ ⴳ ⵜⵃⴰⵏⵓⵜ ⵉⵏⵓ",
      anotherCompany: "ⵜⴰⵎⵙⵙⵓⵔⵜ ⵢⴰⴹⵏ",
      whenWasItMade: "ⵎⴰⵏ ⴰⵣⵎⵣ ⵉⵜⵜⵓⵙⴽⴰⵔ?",
      madeToOrder: "ⵉⵜⵜⵓⵙⴽⴰⵔ ⵙ ⵜⵙⵖⵉⵜ",
      recently: "ⴷⵖⵉⵢⴰ (2020 - 2025)",
      vintage: "ⴼⴰⵔ (ⵇⴱⵍ 2005)",
      photosLabel: "ⵜⵉⵡⵍⴰⴼⵉⵏ ⴷ ⵓⴼⵉⴷⵢⵓ",
      photosHelper: "ⴰⵣⵏ ⴰⵔ 10 ⵜⵉⵡⵍⴰⴼⵉⵏ ⴷ 1 ⵓⴼⵉⴷⵢⵓ.",
      descriptionLabel: "ⵜⴰⵙⵙⵓⵔⵜ",
      descriptionHelper: "ⵎⴰⵏ ⵜⴰⵖⴰⵡⵙⴰ ⵉⵥⵉⵍⵏ ⴳ ⵜⴼⵉⵍⵜ ⵏⵏⴽ?",
      personalizationLabel: "ⴰⵊ ⵉⵎⵙⵖⴰⵏⵏ ⴰⴷ ⵙⵏⴼⵍⵏ ⵜⴰⵖⴰⵡⵙⴰ",
      personalizationHelper: "ⵙⵎⵓⵏ ⵜⵉⴼⴰⵡⵉⵏ ⵏ ⵓⵙⵏⴼⵍ.",
      personalizationInstructions: "ⵜⵉⴱⵔⴰⵜⵉⵏ ⵉ ⵉⵎⵙⵖⴰⵏⵏ",
      personalizationPlaceholder: "ⵙⴽⵛⵎ ⵜⵉⴱⵔⴰⵜⵉⵏ ⵏ ⵓⵙⵏⴼⵍ...",
      personalizationInstructionsHelper: "ⵙⴽⵛⵎ ⵜⵉⴱⵔⴰⵜⵉⵏ ⵏ ⵓⵙⵏⴼⵍ ⵍⵍِي ⵜⵔⵉⵜ ⴰⴷ ⵥⵕⵏ ⵉⵎⵙⵖⴰⵏⵏ.",
      charLimit: "ⴰⵡⵜⵜⵓ ⵏ ⵜⵉⵔⵔⴰ",
      makeOptional: "ⴰⵊ ⴰⵙⵏⴼⵍ ⴰⴷ ⵉⴳ ⵓⴼⵔⵉⵏ"
    },
    price: {
      title: "ⴰⵜⵉⴳ ⴷ ⵓⵙⵡⵓⴷⴷⵓ",
      priceLabel: "ⴰⵜⵉⴳ (MAD)"
    },
    variations: {
      title: "ⵜⵉⵏⴼⵔⵓⵜⵉⵏ",
      subtitle: "ⵜⴰⴼⵉⵍⵜ ⴰⴷ ⵜⵍⵍⴰ ⴳ ⵜⵉⴼⵔⵉⵜⵉⵏ ⵢⴰⴹⵏ (ⴽⵓⵍⵓⵔ, ⵜⴰⵣⵡⵉⵍⵜ).",
      addBtn: "ⵔⵏⵓ ⵜⵉⵏⴼⵔⵓⵜⵉⵏ",
      pricesVary: "ⴰⵜⵉⴳ ⴰⵔ ⵉⵙⵏⴼⵉⵍ",
      pricingTable: "ⵜⵉⵣⵣⵉⴳⵣⵜ",
      variantsCount: "ⵜⵉⵏⴼⵔⵓⵜⵉⵏ",
      variantCol: "ⵜⴰⵏⴼⵔⵓⵜ",
      priceCol: "ⴰⵜⵉⴳ (MAD)",
      visibleCol: "ⵥⵕ",
      modalTitle: "ⵎⴰⵜⵜⴰ ⴰⵏⴰⵡ ⵏ ⵜⵏⴼⵔⵓⵜ?",
      modalDesc: "ⵜⵥⴹⴰⵕⵜ ⴰⴷ ⵜⵔⵏⵓⴷ ⴰⵔ 2 ⵜⵉⵏⴼⵔⵓⵜⵉⵏ.",
      createOwn: "ⵙⴽⵔ ⵜⵉⵏ ⵏⵏⴽ",
      customVariation: "ⵜⴰⵏⴼⵔⵓⵜ ⵜⴰⵥⵍⴰⵢⵜ",
      nameLabel: "ⵉⵙⵎ",
      linkPhotos: "ⵙⵎⵓⵏ ⵜⵉⵡⵍⴰⴼⵉⵏ ⴷ ⵜⵏⴼⵔⵓⵜ",
      optionsLabel: "ⵜⵉⴼⵔⵉⵜⵉⵏ",
      optionsDesc: "ⵥⴹⴰⵕⵏ ⵉⵎⵙⵖⴰⵏⵏ ⴰⴷ ⴼⵔⵏⵏ ⴳ ⵜⴼⵔⵉⵜⵉⵏ ⴰⴷ.",
      optionNameCol: "ⵉⵙⵎ ⵏ ⵜⴼⵔⵉⵜ",
      priceColHeader: "ⴰⵜⵉⴳ (MAD)",
      addOptionBtn: "ⵔⵏⵓ ⵜⴰⴼⵔⵉⵜ",
      addAtLeastOne: "ⵔⵏⵓ ⵢⴰⵜ ⵜⴼⵔⵉⵜ ⵎⴰⵇⵇⴰⵔ",
      manageVariations: "ⵙⵡⵓⴷⴷⵓ ⵜⵉⵏⴼⵔⵓⵜⵉⵏ",
      optionsCount: "ⵜⵉⴼⵔⵉⵜⵉⵏ",
      addVariationBtn: "ⵔⵏⵓ ⵜⴰⵏⴼⵔⵓⵜ",
      presets: {
        primaryColor: "ⴽⵓⵍⵓⵔ ⴰⵎⵣⵡⴰⵔⵓ",
        secondaryColor: "ⴽⵓⵍⵓⵔ ⵡⵉⵙ ⵙⵉⵏ",
        primaryFabric: "ⵜⴰⵙⴱⵖⵜ ⵜⴰⵎⵣⵡⴰⵔⵓⵜ",
        secondaryFabric: "ⵜⴰⵙⴱⵖⵜ ⵜⵉⵙ ⵙⵏⴰⵜ"
      }
    },
    details: {
      title: "ⵜⵉⴼⴰⵡⵉⵏ",
      subtitle: "ⵔⵏⵓ ⵜⵉⴼⴰⵡⵉⵏ ⴰⴼⴰⴷ ⴰⴷ ⴰⴼⵏ ⵉⵎⵙⵖⴰⵏⵏ ⵜⴰⵖⴰⵡⵙⴰ ⵏⵏⴽ.",
      tagsLabel: "ⵜⵉⴳⵓⵔⵉⵡⵉⵏ",
      tagsHelper: "ⵔⵏⵓ ⴰⵔ 13 ⵜⵉⴳⵓⵔⵉⵡⵉⵏ ⵉ ⵓⵙⵉⴳﮕⵍ.",
      addBtn: "ⵔⵏⵓ",
      left: "ⵉⵇⵇⴰⵏ",
      materialsLabel: "ⵉⵎⴰⵙⵙⵏ",
      materialsHelper: "ⵎⵍ ⵉ ⵉⵎⵙⵖⴰⵏⵏ ⵎⴰⵜⵜⴰ ⵉⵎⴰⵙⵙⵏ ⵍⵍⵉ ⵜⵙⵙⵎⵔⴰⵙⴷ."
    },
    shipping: {
      title: "ⴰⵙⵉⵡⴹ",
      subtitle: "ⵎⵍ ⵎⴰⵏⵉⴽ ⵜⵔⵉⵜ ⴰⴷ ⵜⴰⵣⵏⴷ ⵜⴰⵖⴰⵡⵙⴰ ⵏⵏⴽ.",
      optionsLabel: "ⵜⵉⴼⵔⵉⵜⵉⵏ ⵏ ⵓⵙⵉⵡⴹ",
      amanaTitle: "ⴰⵎⴰⵏⴰ (ⴰⵙⵉⵡⴹ ⴰⵏⴰⵎⵓⵔ)",
      amanaDesc: "ⴰⵣⵏ ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⴳ ⵍⵎⵖⵔⵉⴱ ⵙ ⵓⵙⵉⵡⴹ ⵏ ⴰⵎⴰⵏⴰ",
      handTitle: "ⴼⴽ ⵙ ⵓⴼⵓⵙ",
      handDesc: "ⴰⵙⵉⵡⴹ ⵙ ⵓⴼⵓⵙ ⵏⵖ ⴰⵙⵉⴳⴳⵍ ⴷⴰⵔ ⵓⵎⵙⵖⴰⵏ",
      processingLabel: "ⴰⵣⵎⵣ ⵏ ⵓⵙⵡⵓⵔⵉ",
      weightSizeTitle: "ⵜⴰⵣⵡⵉⵍⵜ ⴷ ⵓⵥⴰⵢ ⵏ ⵜⵖⴰⵡⵙⴰ",
      removeWeightBtn: "ⴽⴽⵙ ⵜⴰⵣⵡⵉⵍⵜ ⴷ ⵓⵥⴰⵢ",
      addWeightBtn: "ⵔⵏⵓ ⵜⴰⵣⵡⵉⵍⵜ ⴷ ⵓⵥⴰⵢ",
      weightLabel: "ⵓⵥⴰⵢ (kg)",
      sizeTitle: "ⵜⴰⵣⵡⵉⵍⵜ ⵏ ⵜⵖⴰⵡⵙⴰ",
      sizeHelper: "ⵙⴽⵛⵎ ⵜⵉⵣⵡⵉⵍⵉⵏ ⵙ (cm)",
      length: "ⵜⵉⵖⵣⵉ",
      width: "ⵜⴰⵔⵓⵜ",
      height: "ⵜⴰⵜⵜⵓⵢⵜ"
    },
    settings: {
      title: "ⵜⵉⵙⵖⴰⵍ",
      returnsTitle: "ⵜⵉⵙⵖⴰⵍ ⵏ ⵓⵖⵓⵍ ⴷ ⵓⵙⵏⴼﻠ",
      changePolicy: "ⵙⵏⴼⵍ ⵜⴰⵙⵖⵍⵜ",
      policyHelper: "ⵉⵥⴹⴰⵕ ⵓⵎⵙⵖⴰⵏ ⴰⴷ ⵉⵎⵙⴰⵡⴰⵍ ⴷ ⵓⵎⵙⵏⴼⵍ ⵅⴼ ⴽⵔⴰ ⵏ ⵓⵎⵓⵛⴽⵉⵍ.",
      sectionTitle: "ⵜⴰⴳⵔⵓⵎⵎⴰ ⵏ ⵜⵃⴰⵏⵓⵜ (ⴼⵔⵏ)",
      sectionHelper: "ⵙⵎⵓⵏ ⵜⵉⴼⵉⵍⵉⵏ ⵏⵏⴽ ⴳ ⵜⴳⵔⵓⵎⵎⴰⵡⵉⵏ.",
      noneOption: "ⵓⵔ ⵉⵍⵍⵉ / ⵔⵏⵓ ⵜⴰⴳⵔⵓⵎⵎⴰ",
      featureTitle: "ⵙⵙⵉⵡⴹ ⵜⴰⴼⵉⵍⵜ ⴰⴷ (ⴼⵔⵏ)",
      featureHelper: "ⵎⵍ ⵜⴰⴼⵉⵍⵜ ⴰⴷ ⴳ ⵜⵡⵏⵣⴰ ⵏ ⵜⵃⴰⵏⵓⵜ ⵏⵏⴽ.",
      yes: "ⵢⴰⵀ",
      no: "ⵓⵀⵓ"
    },
    buttons: {
      cancel: "ⴽⴽⵙ",
      publish: "ⴰⵣⵣⴰⵏ...",
      saveContinue: "ⵃⴹⵓ ⴷ ⵜⵣⵣⵉⴳⵣⵜ"
    }
  }
};
interface PageProps {
  params: Promise<{ lang: string; id: string }>;
}

export default function EditListingPage({ params }: PageProps) {
  const { lang, id } = use(params);
  const router = useRouter();

  const t = localDicts[lang as 'en'|'fr'|'ar'|'tz'] || localDicts.en;

  // Auth States
  const [authLoading, setAuthLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Advanced Mode State
  const [advancedMode, setAdvancedMode] = useState(false);

  // Form State
  const [titleEn, setTitleEn] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [titleTz, setTitleTz] = useState('');
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
  const [descTz, setDescTz] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);

  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');

  // New Fields
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

  // Computed combinations for the matrix
  const [variationMatrix, setVariationMatrix] = useState<Record<string, any>>({});

  // Shipping State
  const [shippingAmana, setShippingAmana] = useState(true);
  const [shippingHand, setShippingHand] = useState(false);
  const [processingTime, setProcessingTime] = useState('1-2 business days');

  const [hasItemWeightAndSize, setHasItemWeightAndSize] = useState(false);
  const [itemWeightKg, setItemWeightKg] = useState('');
  const [itemSizeLength, setItemSizeLength] = useState('');
  const [itemSizeWidth, setItemSizeWidth] = useState('');
  const [itemSizeHeight, setItemSizeHeight] = useState('');

  // Collections List
  const [collections, setCollections] = useState<any[]>([]);

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
        router.push(`/${lang}/login?redirect=dashboard/products/${id}`);
        return;
      }
      setSession(activeUser);
      setAuthLoading(false);

      if (activeUser.shop) {
        const { fetchCollections } = await import('@/lib/supabase');
        try {
          const shopCollections = await fetchCollections(activeUser.shop.id);
          setCollections(shopCollections);
        } catch (e) {
          console.warn('Failed to fetch collections:', e);
        }
      }

      // Fetch Product Details
      const product = await fetchProductById(id);
      if (product) {
        setTitleEn(product.title_translations?.en || '');
        setTitleFr(product.title_translations?.fr || '');
        setTitleAr(product.title_translations?.ar || '');
        setTitleTz(product.title_translations?.tz || '');

        setDescEn(product.description_translations?.en || '');
        setDescFr(product.description_translations?.fr || '');
        setDescAr(product.description_translations?.ar || '');
        setDescTz(product.description_translations?.tz || '');

        setPrice((product.base_price_mad || '').toString());
        setMediaUrls(product.media_gallery || []);
        setSelectedCatId(product.category_id || '');
        setSelectedSubcatId(product.subcategory_id || '');

        if (product.category_id) {
          const transCat = translateCategory(product.category_id, lang, 'Jewelry');
          const transSub = product.subcategory_id ? translateSubcategory(product.subcategory_id, lang, '') : '';
          setSuggestionQuery(transSub ? `${transCat} > ${transSub}` : transCat);
        }

        if (product.metadata) {
          setItemType(product.metadata.itemType || 'physical');
          setWhoMadeIt(product.metadata.whoMadeIt || 'i_did');
          setWhenMade(product.metadata.whenMade || 'recently');
          setTags(product.metadata.tags || []);
          setMaterials(product.metadata.materials || '');

          if (product.metadata.personalization) {
            setShowPersonalization(true);
            setPersonalizationInstructions(product.metadata.personalization.instructions || '');
            setCharLimit((product.metadata.personalization.charLimit || 256).toString());
            setPersonalizationOptional(!!product.metadata.personalization.optional);
          }

          if (product.metadata.variations) {
            setVariations(product.metadata.variations.items || []);
            setPricesVary(!!product.metadata.variations.pricesVary);
            setVariationMatrix(product.metadata.variations.matrix || {});
            if (product.metadata.variations.items?.length > 0) {
              setHasVariations(true);
            }
          }

          if (product.metadata.shipping) {
            setShippingAmana(!!product.metadata.shipping.amana);
            setShippingHand(!!product.metadata.shipping.handDelivery);
            setProcessingTime(product.metadata.shipping.processingTime || '1-2 business days');

            if (product.metadata.shipping.weight) {
              setHasItemWeightAndSize(true);
              setItemWeightKg(product.metadata.shipping.weight.kg || '');
            }
            if (product.metadata.shipping.size) {
              setHasItemWeightAndSize(true);
              setItemSizeLength(product.metadata.shipping.size.length || '');
              setItemSizeWidth(product.metadata.shipping.size.width || '');
              setItemSizeHeight(product.metadata.shipping.size.height || '');
            }
          }

          if (product.metadata.settings) {
            setReturnsPolicy(product.metadata.settings.returnsPolicy || 'No returns or exchanges');
            setShopSection(product.metadata.settings.shopSection || '');
            setFeatureListing(!!product.metadata.settings.featureListing);
          }
        }
      }
    }

    checkAuth();
  }, [lang, id, router]);

  // Scroll listener to update active tab based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['about', 'price', 'variations', 'details', 'shipping', 'settings'];
      let currentSection = 'about';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 220) {
            currentSection = id;
          }
        }
      }
      setActiveTab(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleUpdateListing = async () => {
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

    const activeTitle = titleEn || titleFr || titleAr || titleTz;
    const activeDesc = descEn || descFr || descAr || descTz;

    const payload = {
      category_id: dbCategoryId,
      subcategory_id: selectedSubcatId,
      status: 'active', // Set to active to publish the draft
      base_price_mad: parseFloat(price) || 0,
      title_translations: {
        en: titleEn || activeTitle,
        fr: titleFr || activeTitle,
        ar: titleAr || activeTitle,
        tz: titleTz || activeTitle,
      },
      description_translations: {
        en: descEn || activeDesc,
        fr: descFr || activeDesc,
        ar: descAr || activeDesc,
        tz: descTz || activeDesc,
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
          quantitiesVary: false,
          skusVary: false,
          matrix: variationMatrix
        },
        shipping: {
          amana: shippingAmana,
          handDelivery: shippingHand,
          processingTime,
          weight: hasItemWeightAndSize ? { kg: itemWeightKg } : null,
          size: hasItemWeightAndSize ? { length: itemSizeLength, width: itemSizeWidth, height: itemSizeHeight, unit: 'cm' } : null
        },
        settings: {
          returnsPolicy,
          shopSection,
          featureListing: featureListing
        }
      }
    };

    try {
      const result = await updateProductListing(id, payload);
      if (result) {
        // If a shop section (collection) was selected, add the product to that collection
        if (shopSection) {
          const { supabase } = await import('@/lib/supabase');
          try {
            const { data: collection } = await supabase.from('collections').select('product_ids').eq('id', shopSection).single();
            if (collection) {
              const pIds = Array.isArray(collection.product_ids) ? collection.product_ids : [];
              const productId = result.id || result.numeric_id?.toString();
              if (productId && !pIds.includes(productId)) {
                await supabase.from('collections').update({ product_ids: [...pIds, productId] }).eq('id', shopSection);
              }
            }
          } catch (e) {
            console.warn('Failed to update collection with edited product:', e);
          }
        }

        router.push(`/${lang}/dashboard/products`);
      }
    } catch (error) {
      console.warn("Failed to update product:", error);
      alert(`Failed to publish product. Error: ${(error as any)?.message || JSON.stringify(error)}`);
    } finally {
      setIsSubmitting(false);
    }
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
    { id: 'about', label: t.tabs.about },
    { id: 'price', label: t.tabs.price },
    ...(advancedMode ? [
      { id: 'variations', label: t.tabs.variations },
      { id: 'details', label: t.tabs.details }
    ] : []),
    { id: 'shipping', label: t.tabs.shipping },
    { id: 'settings', label: t.tabs.settings }
  ];

  const displayedTitle = titleEn || titleFr || titleAr || titleTz || t.editListing;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-neutral-50 pb-24">
      {/* Top Header (Not Sticky) */}
      <div className="bg-white px-6 py-6 border-b border-neutral-200 flex flex-col justify-center w-full relative z-10">
        <Link href={`/${lang}/dashboard/products`} className="inline-flex items-center text-sm font-bold text-neutral-600 hover:text-black transition-colors mb-4 w-fit">
          <ChevronLeft className="w-4 h-4 mr-1" /> {t.backToListings}
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex-1 mr-4">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-800">
              {displayedTitle}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-neutral-200 text-neutral-700 text-xs font-bold rounded-md">{t.draft}</span>
                <span className="text-xs text-neutral-500">{t.notListedYet}</span>
              </div>
              <div className="flex items-center gap-2 bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-full text-xs font-bold text-neutral-800 w-fit shadow-sm">
                <Switch
                  checked={advancedMode}
                  onCheckedChange={setAdvancedMode}
                />
                <span>{t.advanced}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center shrink-0">
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
            <h2 className="text-2xl font-bold text-neutral-800">{t.about.title}</h2>
            <p className="text-sm text-neutral-500 mt-1">{t.about.subtitle}</p>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2 pt-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="block text-neutral-800 font-bold text-sm">
                    {t.about.titleLabel} <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-neutral-500">{t.about.titleHelper}</p>
                </div>
                {advancedMode && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-500">{t.about.translateLabel}</span>
                    <label className="flex items-center cursor-pointer">
                      <div className={`w-10 h-5 rounded-full transition-colors relative ${enableAltLangs ? 'bg-black' : 'bg-neutral-300'}`}>
                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${enableAltLangs ? 'translate-x-5' : ''}`} />
                        <input type="checkbox" checked={enableAltLangs} onChange={(e) => setEnableAltLangs(e.target.checked)} className="hidden" />
                      </div>
                    </label>
                  </div>
                )}
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
              {lang === 'tz' && (
                <textarea
                  required
                  rows={2}
                  value={titleTz}
                  onChange={(e) => setTitleTz(e.target.value)}
                  className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                  placeholder="e.g. ⵜⴰⵃⴰⵏⵓⵜ ⵉⵏⵓ..."
                />
              )}
              <div className="text-right text-xs text-neutral-400">
                {(lang === 'en' ? titleEn.length : lang === 'fr' ? titleFr.length : lang === 'ar' ? titleAr.length : titleTz.length)}/140
              </div>
            </div>

            {advancedMode && enableAltLangs && (
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
                {lang !== 'tz' && (
                  <div className="space-y-2">
                    <label className="block text-neutral-800 font-bold text-sm text-neutral-600">Tifinagh Title (ⵜⴰⵎⴰⵣⵉⵖⵜ)</label>
                    <textarea
                      rows={2}
                      value={titleTz}
                      onChange={(e) => setTitleTz(e.target.value)}
                      className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Category Search */}
            <div className="space-y-2 pt-4 border-t border-neutral-100">
              <label className="block text-neutral-800 font-bold text-sm">
                {t.about.categoryLabel} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder={t.about.categoryPlaceholder}
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
                  {suggestions.map((s, idx) => {
                    const transCat = translateCategory(s.categoryId, lang, s.categoryName);
                    const transSub = translateSubcategory(s.subcategoryId, lang, s.subcategoryName);
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedCatId(s.categoryId);
                          setSelectedSubcatId(s.subcategoryId);
                          setSuggestionQuery(`${transCat} > ${transSub}`);
                          setSuggestions([]);
                        }}
                        className="w-full text-left p-3 hover:bg-neutral-50 transition-colors flex flex-col border-b border-neutral-100 last:border-0"
                      >
                        <span className="font-bold text-sm text-neutral-800">{transSub}</span>
                        <span className="text-xs text-neutral-500">{transCat} &gt; {transSub}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Core Properties (Advanced Details) */}
            <Accordion type="single" collapsible className="w-full border-t border-neutral-100 pt-4">
              <AccordionItem value="advanced-details" className="border-none">
                <AccordionTrigger className="py-3 hover:no-underline hover:text-black text-neutral-600 font-bold text-sm bg-neutral-50 px-4 rounded-lg">
                  {t.about.advancedLabel}
                </AccordionTrigger>
                <AccordionContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <label className="block text-neutral-800 font-bold text-sm">{t.about.itemType} <span className="text-red-500">*</span></label>
                      <select
                        value={itemType}
                        onChange={(e) => setItemType(e.target.value)}
                        className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm bg-white"
                      >
                        <option value="physical">{t.about.physicalItem}</option>
                        <option value="digital">{t.about.digitalFile}</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-neutral-800 font-bold text-sm">{t.about.whoMadeIt} <span className="text-red-500">*</span></label>
                      <select
                        value={whoMadeIt}
                        onChange={(e) => setWhoMadeIt(e.target.value)}
                        className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm bg-white"
                      >
                        <option value="i_did">{t.about.iDid}</option>
                        <option value="member">{t.about.member}</option>
                        <option value="another">{t.about.anotherCompany}</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-neutral-800 font-bold text-sm">{t.about.whenWasItMade} <span className="text-red-500">*</span></label>
                      <select
                        value={whenMade}
                        onChange={(e) => setWhenMade(e.target.value)}
                        className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm bg-white"
                      >
                        <option value="made_to_order">{t.about.madeToOrder}</option>
                        <option value="recently">{t.about.recently}</option>
                        <option value="vintage">{t.about.vintage}</option>
                      </select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Photos */}
            <div className="space-y-2 pt-4 border-t border-neutral-100">
              <label className="flex items-center gap-2 text-neutral-800 font-bold text-sm">
                {t.about.photosLabel} <span className="text-red-500">*</span>
                <HelpCircle className="w-4 h-4 text-neutral-400" />
              </label>
              <p className="text-xs text-neutral-500 mb-2">{t.about.photosHelper}</p>
              
              {mediaUrls.length > 0 && (
                <div className="grid grid-cols-5 gap-3 mb-4">
                  {mediaUrls.map((url, i) => (
                    <div key={i} className="aspect-square bg-neutral-100 rounded-lg relative overflow-hidden group border border-neutral-200">
                      <img src={url} alt="product" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setMediaUrls(mediaUrls.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-black text-white rounded-full transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="bg-neutral-50 p-6 rounded-xl border-2 border-dashed border-neutral-300 text-center flex flex-col items-center justify-center">
                <MediaUploader onUploadComplete={handleUploadComplete} maxFiles={10} />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 pt-4 border-t border-neutral-100">
              <label className="block text-neutral-800 font-bold text-sm">
                {t.about.descriptionLabel} <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-neutral-500 mb-2">{t.about.descriptionHelper}</p>

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
              {lang === 'tz' && (
                <textarea
                  required
                  rows={5}
                  value={descTz}
                  onChange={(e) => setDescTz(e.target.value)}
                  className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                />
              )}
            </div>

            {advancedMode && enableAltLangs && (
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
                {lang !== 'tz' && (
                  <div className="space-y-2">
                    <label className="block text-neutral-800 font-bold text-sm text-neutral-600">Tifinagh Description (ⵜⴰⵎⴰⵣⵉⵖⵜ)</label>
                    <textarea
                      rows={3}
                      value={descTz}
                      onChange={(e) => setDescTz(e.target.value)}
                      className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Personalization */}
            {advancedMode && (
              <div className="pt-4 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-neutral-800">{t.about.personalizationLabel}</h3>
                    <p className="text-xs text-neutral-500 mt-1">{t.about.personalizationHelper}</p>
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
                      <label className="block text-neutral-800 font-bold text-sm">{t.about.personalizationInstructions}</label>
                      <p className="text-xs text-neutral-500 mb-2">{t.about.personalizationInstructionsHelper}</p>
                      <textarea
                        rows={4}
                        value={personalizationInstructions}
                        onChange={(e) => setPersonalizationInstructions(e.target.value)}
                        placeholder={t.about.personalizationPlaceholder}
                        className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                      />
                      <div className="text-right text-xs text-neutral-400">{personalizationInstructions.length}/256</div>
                    </div>
                    <div className="space-y-2 w-1/2">
                      <label className="block text-neutral-800 font-bold text-sm">{t.about.charLimit} <span className="text-red-500">*</span></label>
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
                      <span className="text-sm font-medium text-neutral-800">{t.about.makeOptional}</span>
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* PRICE & INVENTORY SECTION */}
        <div id="price" className="space-y-8 bg-white p-8 rounded-xl border border-neutral-200">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">{t.price.title}</h2>
          </div>

          <div className="max-w-sm space-y-2">
            <label className="block text-neutral-800 font-bold text-sm">
              {t.price.priceLabel} <span className="text-red-500">*</span>
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
        </div>

        {/* VARIATIONS */}
        {advancedMode && (
          <div id="variations" className="space-y-6 bg-white p-8 rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-800">{t.variations.title}</h2>
                <p className="text-sm text-neutral-500 mt-1">{t.variations.subtitle}</p>
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
                    <Plus className="w-4 h-4" /> {t.variations.addBtn}
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
                            <Plus className="w-4 h-4" /> {t.variations.addBtn}
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
                        <span className="text-sm font-medium text-neutral-800">{t.variations.pricesVary}</span>
                      </label>
                    </div>

                    {pricesVary && variations.length > 0 && (
                      <div className="pt-6 border-t border-neutral-100">
                        <h3 className="font-bold text-neutral-800 mb-1">{t.variations.pricingTable}</h3>
                        <p className="text-xs text-neutral-500 mb-4">{getVariationCombinations().length} {t.variations.variantsCount}</p>

                        <div className="border border-neutral-200 rounded-xl overflow-hidden">
                          <div className="flex px-4 py-3 text-xs font-bold text-neutral-500 border-b border-neutral-200 bg-neutral-50">
                            <div className="w-12"></div>
                            <div className="flex-1">{t.variations.variantCol}</div>
                            <div className="w-32">{t.variations.priceCol}</div>
                            <div className="w-16 text-center">{t.variations.visibleCol}</div>
                          </div>
                          <div className="divide-y divide-neutral-200">
                            {getVariationCombinations().map((combo: string[], idx: number) => {
                              const key = combo.join('-');
                              const data = variationMatrix[key] || { price: '', visible: true };
                              return (
                                <div key={key} className="flex items-center px-4 py-4 bg-white hover:bg-neutral-50 transition-colors">
                                  <div className="w-12">
                                    <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black cursor-pointer" />
                                  </div>
                                  <div className="flex-1 text-sm text-neutral-700">
                                    {combo.join(' / ')}
                                  </div>
                                  <div className="w-32 pr-4">
                                    <div className="relative">
                                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">MAD</span>
                                      <input
                                        type="number"
                                        value={data.price}
                                        onChange={(e) => setVariationMatrix({ ...variationMatrix, [key]: { ...data, price: e.target.value } })}
                                        className="w-full border border-neutral-300 pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                                      />
                                    </div>
                                  </div>
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
        )}

        {/* DETAILS SECTION */}
        {advancedMode && (
          <div id="details" className="space-y-6 bg-white p-8 rounded-xl border border-neutral-200">
            <div>
              <h2 className="text-2xl font-bold text-neutral-800">{t.details.title}</h2>
              <p className="text-sm text-neutral-500 mt-1">{t.details.subtitle}</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-neutral-800 font-bold text-sm">{t.details.tagsLabel}</label>
                <p className="text-xs text-neutral-500 mb-2">{t.details.tagsHelper}</p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    disabled={tags.length >= 13}
                    className="flex-1 border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                    placeholder={lang === 'fr' ? 'ex: Carnet, Bijoux...' : lang === 'ar' ? 'مثال: دفتر، مجوهرات...' : 'e.g. Storyteller\'s Notebook'}
                  />
                  <button
                    onClick={() => handleAddTag({ key: 'Enter', preventDefault: () => { } } as any)}
                    className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-sm rounded-lg transition-colors"
                  >
                    {t.details.addBtn}
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
                    <span className="text-xs text-neutral-400 py-1.5 px-2">{13 - tags.length} {t.details.left}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-neutral-100">
                <label className="block text-neutral-800 font-bold text-sm">{t.details.materialsLabel}</label>
                <p className="text-xs text-neutral-500 mb-2">{t.details.materialsHelper}</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    className="flex-1 border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                    placeholder={lang === 'fr' ? 'Ingrédients, matériaux...' : lang === 'ar' ? 'المكونات، المواد...' : 'Ingredients, components, etc.'}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SHIPPING SECTION */}
        <div id="shipping" className="space-y-8 bg-white p-8 rounded-xl border border-neutral-200">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">{t.shipping.title}</h2>
            <p className="text-sm text-neutral-500 mt-1">{t.shipping.subtitle}</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-neutral-800 font-bold text-sm">{t.shipping.optionsLabel} <span className="text-red-500">*</span></label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-colors ${shippingAmana ? 'border-black bg-neutral-50' : 'border-neutral-200 bg-white hover:bg-neutral-50'}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={shippingAmana}
                      onChange={(e) => setShippingAmana(e.target.checked)}
                      className="rounded border-neutral-300 text-black focus:ring-black w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-sm text-neutral-800">{t.shipping.amanaTitle}</div>
                      <p className="text-xs text-neutral-500 mt-0.5">{t.shipping.amanaDesc}</p>
                    </div>
                  </div>
                </label>

                <label className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-colors ${shippingHand ? 'border-black bg-neutral-50' : 'border-neutral-200 bg-white hover:bg-neutral-50'}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={shippingHand}
                      onChange={(e) => setShippingHand(e.target.checked)}
                      className="rounded border-neutral-300 text-black focus:ring-black w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-sm text-neutral-800">{t.shipping.handTitle}</div>
                      <p className="text-xs text-neutral-500 mt-0.5">{t.shipping.handDesc}</p>
                    </div>
                  </div>
                </label>
              </div>

              <div className="space-y-2 max-w-sm pt-4">
                <label className="block text-neutral-800 font-bold text-sm">{t.shipping.processingLabel} <span className="text-red-500">*</span></label>
                <select
                  value={processingTime}
                  onChange={(e) => setProcessingTime(e.target.value)}
                  className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm bg-white font-medium text-neutral-800"
                >
                  <option value="1 day">{lang === 'fr' ? '1 jour' : lang === 'ar' ? 'يوم واحد' : '1 day'}</option>
                  <option value="1-2 business days">{lang === 'fr' ? '1-2 jours ouvrables' : lang === 'ar' ? '1-2 أيام عمل' : '1-2 business days'}</option>
                  <option value="1-3 business days">{lang === 'fr' ? '1-3 jours ouvrables' : lang === 'ar' ? '1-3 أيام عمل' : '1-3 business days'}</option>
                  <option value="3-5 business days">{lang === 'fr' ? '3-5 jours ouvrables' : lang === 'ar' ? '3-5 أيام عمل' : '3-5 business days'}</option>
                  <option value="5-7 business days">{lang === 'fr' ? '5-7 jours ouvrables' : lang === 'ar' ? '5-7 أيام عمل' : '5-7 business days'}</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-100 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-neutral-800">{t.shipping.weightSizeTitle}</h3>
                <button
                  onClick={() => setHasItemWeightAndSize(!hasItemWeightAndSize)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm font-semibold rounded-full transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> {hasItemWeightAndSize ? t.shipping.removeWeightBtn : t.shipping.addWeightBtn}
                </button>
              </div>

              {hasItemWeightAndSize && (
                <>
                  <div className="space-y-2 max-w-md">
                    <label className="block text-neutral-800 font-bold text-sm">{t.shipping.weightLabel}</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={itemWeightKg}
                        onChange={(e) => setItemWeightKg(e.target.value)}
                        className="w-full border border-neutral-300 pr-12 pl-3 py-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                        placeholder="0.0"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">kg</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-neutral-800 font-bold text-sm">{t.shipping.sizeTitle}</label>
                      <p className="text-xs text-neutral-500 mt-1">{t.shipping.sizeHelper}</p>
                    </div>
                    <div className="flex gap-4 max-w-2xl mt-2">
                      <div className="space-y-1 flex-1">
                        <label className="block text-xs font-semibold text-neutral-700">{t.shipping.length}</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={itemSizeLength}
                            onChange={(e) => setItemSizeLength(e.target.value)}
                            className="w-full border border-neutral-300 pr-12 pl-3 py-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">cm</span>
                        </div>
                      </div>
                      <div className="space-y-1 flex-1">
                        <label className="block text-xs font-semibold text-neutral-700">{t.shipping.width}</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={itemSizeWidth}
                            onChange={(e) => setItemSizeWidth(e.target.value)}
                            className="w-full border border-neutral-300 pr-12 pl-3 py-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">cm</span>
                        </div>
                      </div>
                      <div className="space-y-1 flex-1">
                        <label className="block text-xs font-semibold text-neutral-700">{t.shipping.height}</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={itemSizeHeight}
                            onChange={(e) => setItemSizeHeight(e.target.value)}
                            className="w-full border border-neutral-300 pr-12 pl-3 py-3 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">cm</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* SETTINGS SECTION */}
        <div id="settings" className="space-y-4 bg-white p-8 rounded-xl border border-neutral-200">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">{t.settings.title}</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-neutral-800 flex items-center gap-1">
                {t.settings.returnsTitle} <span className="text-red-500">*</span>
              </h3>

              <div className="p-5 border border-neutral-200 rounded-xl bg-neutral-50 max-w-md">
                <label className="block text-xs font-bold text-neutral-700 mb-2">{t.settings.changePolicy}</label>
                <select
                  value={returnsPolicy}
                  onChange={(e) => setReturnsPolicy(e.target.value)}
                  className="w-full border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm bg-white font-bold"
                >
                  <option value="No returns or exchanges">{lang === 'fr' ? 'Pas de retours ni d\'échanges' : lang === 'ar' ? 'لا يوجد مرتجعات أو استبدال' : 'No returns or exchanges'}</option>
                  <option value="30 days returns & exchanges">{lang === 'fr' ? 'Retours & échanges sous 30 jours' : lang === 'ar' ? 'مرتجعات واستبدال خلال 30 يومًا' : '30 days returns & exchanges'}</option>
                  <option value="14 days returns only">{lang === 'fr' ? 'Retours uniquement sous 14 jours' : lang === 'ar' ? 'مرتجعات فقط خلال 14 يومًا' : '14 days returns only'}</option>
                </select>
                <p className="text-xs text-neutral-500 mt-3">{t.settings.policyHelper}</p>
              </div>
            </div>

            {advancedMode && (
              <>
                <div className="pt-6 border-t border-neutral-100 grid grid-cols-[200px_1fr] gap-8">
                  <div>
                    <label className="font-bold text-sm text-neutral-800 block">{t.settings.sectionTitle}</label>
                    <p className="text-xs text-neutral-500 mt-1">{t.settings.sectionHelper}</p>
                  </div>
                  <div>
                    <select
                      value={shopSection}
                      onChange={(e) => setShopSection(e.target.value)}
                      className="w-full max-w-md border border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-black text-sm bg-white"
                    >
                      <option value="">{t.settings.noneOption}</option>
                      {collections.map((col: any) => (
                        <option key={col.id} value={col.id}>{col.name_translations?.[lang] || col.name || col.id}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-100 grid grid-cols-[200px_1fr] gap-8">
                  <div>
                    <label className="font-bold text-sm text-neutral-800 block">{t.settings.featureTitle}</label>
                    <p className="text-xs text-neutral-500 mt-1">{t.settings.featureHelper}</p>
                  </div>
                  <div>
                    <div className="inline-flex bg-neutral-100 rounded-full p-1 border border-neutral-200">
                      <button
                        onClick={() => setFeatureListing(true)}
                        className={`px-6 py-1.5 rounded-full text-sm font-bold transition-colors ${featureListing ? 'bg-white shadow-sm text-neutral-800' : 'text-neutral-500 hover:text-neutral-700'}`}
                      >
                        {t.settings.yes}
                      </button>
                      <button
                        onClick={() => setFeatureListing(false)}
                        className={`px-6 py-1.5 rounded-full text-sm font-bold transition-colors ${!featureListing ? 'bg-white shadow-sm text-neutral-800' : 'text-neutral-500 hover:text-neutral-700'}`}
                      >
                        {t.settings.no}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-[65px] pb-safe md:bottom-0 md:pb-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 md:px-8 z-30 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Link href={`/${lang}/dashboard/products`}>
          <button className="px-6 py-3 font-semibold text-sm text-neutral-600 hover:text-black transition-colors rounded-full hover:bg-neutral-100">
            {t.buttons.cancel}
          </button>
        </Link>
        <button
          onClick={handleUpdateListing}
          disabled={isSubmitting || !(lang === 'en' ? titleEn : lang === 'fr' ? titleFr : lang === 'ar' ? titleAr : titleTz) || !price || !selectedCatId}
          className="px-8 py-3 bg-black hover:bg-neutral-800 text-white font-bold text-sm rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isSubmitting ? t.buttons.publish : t.buttons.saveContinue}
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
                  <h2 className="text-2xl font-bold text-neutral-800 mb-2">{t.variations.modalTitle}</h2>
                  <p className="text-sm text-neutral-500 mb-8">{t.variations.modalDesc}</p>

                  <div className="flex flex-wrap gap-3 mb-8">
                    {[
                      { key: 'primaryColor', label: t.variations.presets.primaryColor },
                      { key: 'secondaryColor', label: t.variations.presets.secondaryColor },
                      { key: 'primaryFabric', label: t.variations.presets.primaryFabric },
                      { key: 'secondaryFabric', label: t.variations.presets.secondaryFabric }
                    ].map(preset => (
                      <button
                        key={preset.key}
                        onClick={() => handleVariationPreset(preset.label)}
                        className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-sm rounded-full transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleVariationPreset('')}
                    className="flex items-center gap-2 text-neutral-800 font-bold hover:text-black transition-colors"
                  >
                    <Plus className="w-5 h-5" /> {t.variations.createOwn}
                  </button>
                </div>
                <div className="px-8 py-4 bg-neutral-50 rounded-b-2xl border-t border-neutral-100 flex justify-between">
                  <button onClick={closeVariationsModal} className="font-bold text-neutral-600 hover:text-black">{t.buttons.cancel}</button>
                </div>
              </>
            )}

            {variationStep === 2 && (
              <>
                <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-neutral-800">
                    {currentVariationName ? currentVariationName : t.variations.customVariation}
                  </h2>
                </div>
                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                  <div className="space-y-2">
                    <label className="block text-neutral-800 font-bold text-sm">{t.variations.nameLabel} <span className="text-red-500">*</span></label>
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
                    <span className="text-sm font-medium text-neutral-800">{t.variations.linkPhotos}</span>
                  </label>

                  <div className="space-y-2 border-t border-neutral-100 pt-6">
                    <label className="flex items-center gap-2 text-neutral-800 font-bold text-sm">
                      {t.variations.optionsLabel} <HelpCircle className="w-4 h-4 text-neutral-400" />
                    </label>
                    <p className="text-xs text-neutral-500 mb-4">{t.variations.optionsDesc}</p>

                    {currentVariationOptions.length > 0 && (
                      <div className="space-y-3 mt-4 mb-4">
                        <div className="flex px-1 text-xs font-bold text-neutral-800">
                          <div className="flex-1">{t.variations.optionNameCol}</div>
                          <div className="w-32">{t.variations.priceColHeader}</div>
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
                      {t.variations.addOptionBtn}
                    </button>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 rounded-b-2xl flex justify-between items-center">
                  <button onClick={() => setVariationStep(variations.length > 0 ? 3 : 1)} className="px-4 py-2 font-bold text-neutral-600 hover:text-black">{t.buttons.cancel}</button>
                  <div className="flex items-center gap-4">
                    {currentVariationOptions.length === 0 && <span className="text-sm text-neutral-500">{t.variations.addAtLeastOne}</span>}
                    <button
                      onClick={handleSaveVariation}
                      disabled={!currentVariationName || currentVariationOptions.length === 0}
                      className="px-6 py-2.5 bg-black text-white font-bold rounded-full disabled:opacity-50"
                    >
                      {t.buttons.saveContinue}
                    </button>
                  </div>
                </div>
              </>
            )}

            {variationStep === 3 && (
              <>
                <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-neutral-800">{t.variations.manageVariations}</h2>
                  <button onClick={closeVariationsModal} className="p-2 hover:bg-neutral-100 rounded-full text-neutral-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto space-y-6">
                  {variations.map((v, idx) => (
                    <div key={idx} className="border border-neutral-200 rounded-xl p-4 flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-neutral-800">{v.name}</h4>
                        <p className="text-xs text-neutral-500 mb-2">{v.options.length} {t.variations.optionsCount}</p>
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
                      <Plus className="w-4 h-4" /> {t.variations.addVariationBtn}
                    </button>
                  )}

                  <div className="border-t border-neutral-100 pt-6 space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-12 h-6 rounded-full transition-colors relative ${pricesVary ? 'bg-black' : 'bg-neutral-300'}`}>
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${pricesVary ? 'translate-x-6' : ''}`} />
                        <input type="checkbox" checked={pricesVary} onChange={(e) => setPricesVary(e.target.checked)} className="hidden" />
                      </div>
                      <span className="font-bold text-sm text-neutral-800">{t.variations.pricesVary}</span>
                    </label>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 rounded-b-2xl flex justify-between">
                  <button onClick={closeVariationsModal} className="font-bold text-neutral-600 hover:text-black">{t.buttons.cancel}</button>
                  <button onClick={closeVariationsModal} className="px-6 py-2 bg-black text-white font-bold rounded-full">{t.buttons.saveContinue}</button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
