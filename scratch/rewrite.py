import re

with open('scratch/ProductFirstOnboardingModal_modified.tsx', 'r') as f:
    content = f.read()

# 1. Extract the handlers
handleProductNext_regex = re.compile(r'  const handleProductNext = .*?};\n', re.DOTALL)
handleCreateShop_regex = re.compile(r'  const handleCreateShop = .*?};\n', re.DOTALL)

# Let's replace the handlers logic with handleStep1Next, handleStep2Next, handleCreateShop.

new_handlers = r"""
  const handleStep1Next = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    if (productImageFiles.length === 0) {
      setError(lang === 'fr' ? 'Veuillez ajouter au moins une image.' : lang === 'ar' ? 'يرجى إضافة صورة واحدة على الأقل.' : 'Please add at least one image.');
      return;
    }
    if (!productCategory) {
      setError(lang === 'fr' ? 'Veuillez sélectionner une catégorie.' : lang === 'ar' ? 'يرجى اختيار فئة.' : 'Please select a category.');
      return;
    }
    const cleanName = shopName.trim();
    if (!cleanName) { setError(t.errShopNameEmpty || 'Shop name is required'); return; }
    if (!city || (MOROCCAN_CITIES_SECTORS[city] && !secteur)) { setError(t.errSelectCity); return; }

    setLoading(true);
    try {
      const shopSlug = cleanName.toLowerCase().replace(/\s+/g, '-');
      const isAvailable = await checkShopSlugAvailable(shopSlug);
      if (!isAvailable) {
        setError(t.errShopNameTaken);
        setLoading(false);
        return;
      }
      setStep('step2');
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

    if (hasSession) {
      await handleCreateShop();
    } else {
      setStep('account');
    }
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
        if (!active) throw new Error('No active session found.');
        
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

      if (createdShop && productTitle && productPrice && productImageFiles.length > 0) {
        const imageUrlPromises = productImageFiles.map((file) => uploadImage(file));
        const uploadedUrls = await Promise.all(imageUrlPromises);
        const validUrls = uploadedUrls.filter(url => url !== null) as string[];

        if (validUrls.length > 0) {
          const product = await createProductListing({
            shopId: createdShop.id,
            title: productTitle,
            description: productDesc,
            basePriceMad: parseFloat(productPrice),
            categoryId: productCategory,
            mediaGallery: validUrls,
          });
          setCreatedProductId(product?.id || null);
          setCreatedProduct(product);
        }
      }

      setStep('success');
    } catch (err: any) {
      console.error(err);
      setError(err.message || t.errCreatingShop);
    } finally {
      setLoading(false);
    }
  };
"""

content = re.sub(r'  const handleProductNext = async.*?};(?=\n\n  const handleCreateShop)', '', content, flags=re.DOTALL)
content = re.sub(r'  const handleProductNext = .*?};(?=\n\n  const handleCreateShop)', '', content, flags=re.DOTALL)
content = re.sub(r'  const handleProductNext = .*?(?=  const handleAccountNext)', lambda x: new_handlers + '\n\n', content, flags=re.DOTALL)


# 2. JSX Replacement
step1_jsx = r"""                {/* ── STEP 1: BASICS ── */}
                {step === 'step1' && (
                  <div className="space-y-6 text-center">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold !font-ariom text-neutral-900 leading-tight">{lang === 'fr' ? 'Commençons par les bases' : lang === 'ar' ? 'لنبدأ بالأساسيات' : 'Let\'s start with the basics'}</h1>
                      <p className="text-neutral-500 mt-2 text-base">{lang === 'fr' ? 'Photos, catégorie et nom de boutique' : lang === 'ar' ? 'الصور والفئة واسم المتجر' : 'Photos, category, and shop name'}</p>
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

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-black block">{t.productCategory} <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[...staticCategories]
                            .sort((a, b) => {
                              const nameA = a.name[lang as 'en'|'fr'|'ar'|'tz'] || a.name.en;
                              const nameB = b.name[lang as 'en'|'fr'|'ar'|'tz'] || b.name.en;
                              return nameA.localeCompare(nameB);
                            })
                            .slice(0, showAllCategories ? staticCategories.length : 5)
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
                                    onChange={() => setProductCategory(c.id)}
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
                          {!showAllCategories && staticCategories.length > 5 && (
                            <button
                              type="button"
                              onClick={() => setShowAllCategories(true)}
                              className="flex flex-col items-center justify-center p-3 text-center rounded-2xl border-2 border-dashed border-neutral-200 hover:border-primary/50 hover:bg-neutral-50 transition-all cursor-pointer text-neutral-500"
                            >
                              <IconChevronDown className="w-6 h-6 mb-2 text-neutral-400" strokeWidth={1.5} />
                              <span className="text-xs font-semibold">More</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-black block text-left">Nom de la boutique <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input
                            type="text"
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            className="w-full border border-neutral-200 rounded-2xl px-4 py-3.5 text-base text-left text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300"
                            placeholder={t.shopNamePlaceholder}
                          />
                        </div>
                        {shopName && (
                          <p className="text-xs text-neutral-400 mt-1 text-left">
                            afus.ma/shop/{shopName.toLowerCase().replace(/\s+/g, '-')}
                          </p>
                        )}
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

                        {city && MOROCCAN_CITIES_SECTORS[city] && (
                          <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="text-sm font-semibold text-black block text-left">
                              Secteur <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <select
                                value={secteur}
                                onChange={(e) => setSecteur(e.target.value)}
                                className="w-full border border-neutral-200 rounded-2xl pl-4 pr-10 py-3.5 text-sm text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300 appearance-none cursor-pointer text-left"
                              >
                                <option value="" disabled>Sélectionner un secteur...</option>
                                {MOROCCAN_CITIES_SECTORS[city].map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                              <IconSelector className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 z-10 pointer-events-none" strokeWidth={1.8} />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-100 z-50 flex flex-row-reverse items-center justify-between gap-3 md:relative md:border-0 md:bg-transparent md:p-0 md:mt-8">
                        <button
                          type="submit"
                          disabled={loading || productImageFiles.length === 0 || !productCategory || !shopName.trim() || !city || (MOROCCAN_CITIES_SECTORS[city] && !secteur)}
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
"""

step2_jsx = r"""                {/* ── STEP 2: DETAILS ── */}
                {step === 'step2' && (
                  <div className="space-y-6 text-center">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold !font-ariom text-neutral-900 leading-tight">{lang === 'fr' ? 'Détails du produit' : lang === 'ar' ? 'تفاصيل المنتج' : 'Product Details'}</h1>
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
                          <input
                            type="number"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                            className="w-full border border-neutral-200 rounded-2xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary/50 transition-all bg-white hover:border-neutral-300"
                            placeholder={t.productPricePlaceholder}
                          />
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

                      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-100 z-50 flex flex-row-reverse items-center justify-between gap-3 md:relative md:border-0 md:bg-transparent md:p-0 md:mt-8">
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
                        <button
                          type="button"
                          onClick={() => { setError(''); setStep('step1'); }}
                          className="md:hidden flex-1 flex items-center justify-center gap-1.5 text-sm md:text-base font-bold text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors py-3.5 md:py-4 rounded-full border border-neutral-200"
                        >
                          <IconArrowLeft className="w-5 h-5" strokeWidth={2.5} />
                          <span>{t.back}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}
"""

content = re.sub(r'                {\/\* ── STEP 2: STORE & LOCATION ── \*\/}.*?(?=                {\/\* ── STEP 3: PRODUCT ── \*\/})', '', content, flags=re.DOTALL)
content = re.sub(r'                {\/\* ── STEP 3: PRODUCT ── \*\/}.*?(?=                {\/\* ── SUCCESS ── \*\/})', lambda x: step1_jsx + '\n\n' + step2_jsx + '\n\n', content, flags=re.DOTALL)

with open('src/components/ui/ProductFirstOnboardingModal.tsx', 'w') as f:
    f.write(content)

print("Done generating ProductFirstOnboardingModal.tsx")
