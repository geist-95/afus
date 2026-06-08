import fs from 'fs';

let content = fs.readFileSync('src/app/[lang]/(main)/blog/[slug]/page.tsx', 'utf8');

// For Post 6
const post6Content = `    content: (lang) => {
      const texts = {
        en: {
          intro: "Looking for a truly unique present that speaks volumes? In a world dominated by mass production, choosing a handmade gift means you are not just giving a physical item—you are sharing a rich story, supporting a lineage of master craftsmen, and preserving cultural heritage. Here is our ultimate, hand-picked guide to the best artisanal Moroccan finds that are guaranteed to delight anyone on your list.",
          artTitle: "The Art of Meaningful Gifting",
          artDesc: "There is a profound joy in unboxing a gift that has been shaped by human hands. This guide is designed to help you navigate the vibrant souks of Morocco right from your screen.",
          h1: "1. Exquisite Hand-Painted Ceramics",
          p1: "For the home chef, traditional Moroccan ceramics are an absolute treasure.",
          h2: "2. Hand-Woven Berber Rugs and Textiles",
          p2: "Nothing quite compares to a genuine Berber rug. Smaller textiles are exceptional choices.",
          h3: "3. Hand-Tooled Leather Goods",
          p3: "Moroccan leather is world-renowned for its quality and durability.",
          quote: "A handmade gift is a silent conversation between the artisan, the giver, and the receiver.",
          outro: "Explore our full collection to discover more hidden gems directly from the medina."
        },
        fr: {
          intro: "Vous cherchez un cadeau vraiment unique ? Choisir un cadeau fait main signifie partager une histoire et soutenir des maîtres artisans. Voici notre guide des meilleures trouvailles marocaines.",
          artTitle: "L'art d'offrir avec sens",
          artDesc: "Il y a une joie profonde à déballer un cadeau façonné par des mains humaines. Ce guide vous aide à naviguer dans les souks du Maroc.",
          h1: "1. Céramiques exquises peintes à la main",
          p1: "Pour le chef, les céramiques marocaines traditionnelles sont un trésor absolu.",
          h2: "2. Tapis et textiles berbères tissés à la main",
          p2: "Rien ne se compare à un authentique tapis berbère. Les petits textiles sont aussi d'excellents choix.",
          h3: "3. Articles en cuir travaillés à la main",
          p3: "Le cuir marocain est mondialement reconnu pour sa qualité et sa durabilité.",
          quote: "Un cadeau fait main est une conversation silencieuse entre l'artisan, celui qui donne et celui qui reçoit.",
          outro: "Explorez notre collection complète pour découvrir plus de trésors cachés de la médina."
        },
        ar: {
          intro: "هل تبحث عن هدية فريدة حقًا؟ اختيار هدية مصنوعة يدويًا يعني مشاركة قصة ودعم الحرفيين المهرة. إليك دليلنا لأفضل المنتجات المغربية.",
          artTitle: "فن الهدايا ذات المعنى",
          artDesc: "هناك فرحة عميقة في فتح هدية شكلتها أيدي البشر. يساعدك هذا الدليل على تصفح أسواق المغرب.",
          h1: "1. سيراميك رائع مطلي يدويًا",
          p1: "بالنسبة للطاهي، يعد السيراميك المغربي التقليدي كنزًا مطلقًا.",
          h2: "2. سجاد ومنسوجات أمازيغية منسوجة يدويًا",
          p2: "لا شيء يقارن بسجادة أمازيغية أصلية. المنسوجات الصغيرة هي خيارات استثنائية.",
          h3: "3. سلع جلدية مشغولة يدويًا",
          p3: "يشتهر الجلد المغربي عالميًا بجودته ومتانته.",
          quote: "الهدية المصنوعة يدويًا هي محادثة صامتة بين الحرفي والمانح والمتلقي.",
          outro: "استكشف مجموعتنا الكاملة لاكتشاف المزيد من الجواهر الخفية من المدينة القديمة."
        },
        tz: {
          intro: "ⴰⵔ ⵜⵔⵣⵣⵓⴷ ⴼ ⵜⴰⵔⵣⵉⴼⵜ ⵉⵥⵉⵍⵏ? ⴰⵙⵜⴰⵢ ⵏ ⵜⴰⵔⵣⵉⴼⵜ ⵏ ⵓⴼⵓⵙ ⵉⴳⴰ ⴰⴱⵟⵟⵓ ⵏ ⵜⵏⵇⵇⵉⵙⵜ ⴷ ⵡⴰⵏⵏⴰⵍ ⵏ ⵉⵏⴰⵥⵓⵕⵏ. ⴰⵢⴰ ⵉⴳⴰ ⴰⵎⴰⵏⴰⵔ ⵏⵏⵖ ⵉ ⵜⵖⴰⵡⵙⵉⵡⵉⵏ ⵜⵉⵎⵖⵔⵉⴱⵉⵢⵉⵏ.",
          artTitle: "ⵜⴰⵥⵓⵕⵉ ⵏ ⵜⵉⴽⴽⵉ ⵉⵍⴰⵏ ⴰⵏⴰⵎⴽ",
          artDesc: "ⵜⵍⵍⴰ ⵜⵓⵎⵔⵜ ⴳ ⵓⵕⵥⵥⵓⵎ ⵏ ⵜⴰⵔⵣⵉⴼⵜ ⵉⵜⵜⵓⵙⴽⴰⵔⵏ ⵙ ⵉⴼⴰⵙⵙⵏ. ⴰⵎⴰⵏⴰⵔ ⴰⴷ ⴰⵔ ⴰⴽ ⵉⵜⵜⴰⵡⵙ ⴰⴷ ⵜⵏⵉⴳⴷ ⴳ ⵉⵙⵡⴰⵇⵏ ⵏ ⵍⵎⵖⵔⵉ.",
          h1: "1. ⵍⵅⵣⴼ ⵉⵥⵉⵍⵏ ⵉⵜⵜⵓⴽⵍⵓⵏ ⵙ ⵓⴼⵓⵙ",
          p1: "ⵉ ⵓⵎⴰⵙⵜⴰⵏ ⵏ ⵓⵏⵡⴰⵍ, ⵍⵅⵣⴼ ⴰⵎⵖⵔⵉⴱⵉ ⵉⴳⴰ ⴰⴳⵔⵔⵓⵊ.",
          h2: "2. ⵉⵥⵕⴱⴰⵢ ⴷ ⵜⵉⵎⵍⵙⵉⵜ ⵜⴰⵎⴰⵣⵉⵖⵜ",
          p2: "ⵓⵔ ⵉⵍⵍⵉ ⵎⴰⵢⴷ ⵉⵜⵜⵎⵢⴰⵏⴰⵡⵏ ⴷ ⵓⵥⵕⴱⵉⵢ ⴰⵎⴰⵣⵉⵖ. ⵜⵉⵎⵍⵙⵉⵜ ⵜⵉⵎⵥⵥⵢⴰⵏⵉⵏ ⴳⴰⵏⵜ ⵉⵙⵜⴰⵢⵏ ⵉⴼⴰⵡⵏ.",
          h3: "3. ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵉⵍⵎ",
          p3: "ⵉⵍⵎ ⴰⵎⵖⵔⵉⴱⵉ ⵉⵜⵜⵡⴰⵙⵙⵏ ⴳ ⵓⵎⴰⴹⴰⵍ ⵙ ⵜⵖⴰⵔⴰ ⵏⵏⵙ.",
          quote: "ⵜⴰⵔⵣⵉⴼⵜ ⵏ ⵓⴼⵓⵙ ⵜⴳⴰ ⴰⵎⵙⴰⵡⴰⵍ ⵉⵙⵙⵓⵙⵎⵏ ⴳⵔ ⵓⵎⴰⵙⵜⴰⵏ, ⵡⴰⵍⵍⵉ ⵉⵜⵜⴰⴽⴽⴰⵏ, ⴷ ⵡⴰⵍⵍⵉ ⵉⵜⵜⴰⵎⵥⵏ.",
          outro: "ⵔⵣⵓ ⴳ ⵜⴳⵔⵓⵎⵎⴰ ⵏⵏⵖ ⴰⴼⴰⴷ ⴰⴷ ⵜⴰⴼⴷ ⵓⴳⴳⴰⵔ ⵏ ⵉⴳⵔⵔⵓⵊⵏ ⵙⴳ ⵜⵖⵔⵎⵜ."
        }
      }[lang] || texts.en;
      
      return (
        <>
          <p className="lead font-medium text-2xl text-[#2a0a1e] mb-8">{texts.intro}</p>
          
          <div className="my-10 w-full h-96 bg-neutral-200 arabic-frame overflow-hidden flex items-center justify-center relative">
            <span className="text-neutral-500 absolute z-10 font-medium">Placeholder Image</span>
            <div className="absolute inset-0 bg-neutral-300 opacity-20"></div>
          </div>
          
          <h2>{texts.artTitle}</h2>
          <p>{texts.artDesc}</p>
          
          <h3>{texts.h1}</h3>
          <p>{texts.p1}</p>
          
          <h3>{texts.h2}</h3>
          <p>{texts.p2}</p>
          
          <h3>{texts.h3}</h3>
          <p>{texts.p3}</p>
          
          <div className="my-10 w-full h-96 bg-neutral-200 arabic-frame overflow-hidden flex items-center justify-center relative">
            <span className="text-neutral-500 absolute z-10 font-medium">Placeholder Image</span>
            <div className="absolute inset-0 bg-neutral-300 opacity-20"></div>
          </div>
          
          <blockquote>"{texts.quote}"</blockquote>
          
          <p>{texts.outro}</p>
        </>
      );
    }`;

const post7Content = `    content: (lang) => {
      const texts = {
        en: {
          intro: "Every beautiful piece on our platform begins with a spark of inspiration. Today, we're taking you into the labyrinthine alleys of the medina to explore the creative process of master artisan Youssef.",
          h1: "The Workspace: A Sensory Overload",
          p1: "Tucked away in the heart of the ancient medina, Youssef's workshop is a sanctuary of creation. The walls are lined with tools and vibrant dyes sit in terracotta pots.",
          h2: "The Process: Patience and Precision",
          p2: "Watching a master at work is a mesmerizing experience. It takes years to master the techniques used here. Every step is deliberate.",
          quote: "Our work is a dialogue between the past and the present. We are keeping a language alive.",
          h3: "A Commitment to the Future",
          p3: "The magic created here goes beyond aesthetics. It's about sustaining a micro-economy and passing on skills to the next generation."
        },
        fr: {
          intro: "Chaque belle pièce commence par une étincelle d'inspiration. Aujourd'hui, nous vous emmenons dans la médina pour explorer le processus créatif du maître artisan Youssef.",
          h1: "L'Espace de Travail : Une surcharge sensorielle",
          p1: "L'atelier de Youssef est un sanctuaire de création. Les murs sont recouverts d'outils et des teintures vibrantes reposent dans des pots en terre cuite.",
          h2: "Le Processus : Patience et Précision",
          p2: "Regarder un maître à l'œuvre est fascinant. Il faut des années pour maîtriser ces techniques. Chaque étape est délibérée.",
          quote: "Notre travail est un dialogue entre le passé et le présent. Nous maintenons un langage en vie.",
          h3: "Un Engagement envers l'Avenir",
          p3: "La magie créée ici va au-delà de l'esthétique. Il s'agit de soutenir une micro-économie et de transmettre des compétences."
        },
        ar: {
          intro: "كل قطعة جميلة تبدأ بشرارة إلهام. اليوم، نأخذك إلى المدينة القديمة لاستكشاف العملية الإبداعية للحرفي الماهر يوسف.",
          h1: "مساحة العمل: تجربة حسية",
          p1: "ورشة يوسف هي ملاذ للإبداع. تصطف الأدوات على الجدران وتوجد الأصباغ النابضة بالحياة في أواني من الطين.",
          h2: "العملية: الصبر والدقة",
          p2: "مشاهدة أستاذ في العمل تجربة رائعة. يستغرق إتقان التقنيات سنوات. كل خطوة مدروسة.",
          quote: "عملنا هو حوار بين الماضي والحاضر. نحن نحافظ على لغة حية.",
          h3: "التزام نحو المستقبل",
          p3: "السحر الذي يُصنع هنا يتجاوز الجماليات. يتعلق الأمر بدعم الاقتصاد وتمرير المهارات."
        },
        tz: {
          intro: "ⴽⵓ ⵜⴰⵖⴰⵡⵙⴰ ⵉⴼⴰⵡⵏ ⴰⵔ ⵜⴱⴷⴷⴰ ⵙ ⵢⴰⵜ ⵜⵙⵉⴷⵉⵜ ⵏ ⵓⵙⵏⴼⵍⵓⵍ. ⴰⵙⵙⴰ, ⵔⴰⴷ ⴽ ⵏⴰⵡⵉ ⵖⵔ ⵜⵖⵔⵎⵜ ⴰⴼⴰⴷ ⴰⴷ ⵜⵥⵕⴷ ⵜⴰⵡⵓⵔⵉ ⵏ ⵓⵎⴰⵙⵜⴰⵏ ⵢⵓⵙⴼ.",
          h1: "ⴰⴷⵖⴰⵔ ⵏ ⵜⵡⵓⵔⵉ: ⵢⴰⵜ ⵜⵉⵔⵎⵉⵜ",
          p1: "ⵜⴰⵅⵅⴰⵎⵜ ⵏ ⵢⵓⵙⴼ ⵜⴳⴰ ⴰⴷⵖⴰⵔ ⵏ ⵓⵙⵏⴼⵍⵓⵍ. ⵉⵎⴰⵙⵙⵏ ⵍⵍⴰⵏ ⴳ ⵉⵖⵔⴰⴱⵏ ⴷ ⵉⴽⵯⵍⴰⵏ ⵍⵍⴰⵏ ⴳ ⵉⵇⵚⵕⵉⵢⵏ.",
          h2: "ⵜⴰⵡⵓⵔⵉ: ⴰⵚⴱⵕ ⴷ ⵓⵙⵖⵥⵏ",
          p2: "ⴰⵥⵕⵉ ⵏ ⵓⵎⴰⵙⵜⴰⵏ ⴰⵔ ⵉⵙⵡⵓⵔⵉ ⵉⴳⴰ ⵢⴰⵜ ⵜⵖⴰⵡⵙⴰ ⵉⴼⴰⵡⵏ. ⵉⵅⵚⵚⴰ ⵉⵙⴳⴳⵯⴰⵙⵏ ⴰⴼⴰⴷ ⴰⴷ ⵉⵙⵙⵏ ⵜⵉⵖⴰⵔⴰⵙⵉⵏ.",
          quote: "ⵜⴰⵡⵓⵔⵉ ⵏⵏⵖ ⵜⴳⴰ ⴰⵎⵙⴰⵡⴰⵍ ⴳⵔ ⵉⵣⵔⵉ ⴷ ⵖⵉⵍⴰ. ⴰⵔ ⵏⵃⵟⵟⵓ ⵢⴰⵜ ⵜⵓⵜⵍⴰⵢⵜ ⵜⵉⴷⵔⵜ.",
          h3: "ⴰⵙⵓⵊⴷ ⵉ ⵉⵎⴰⵍ",
          p3: "ⵜⴰⵥⵓⵕⵉ ⴰⴷ ⵜⵣⵔⵉ ⴰⴼⴰⵍⴽⴰⵢ. ⵜⴳⴰ ⴰⵙⵏⴰⵍ ⵏ ⵜⴷⴰⵎⵙⴰ ⴷ ⵓⵙⵣⵔⵉ ⵏ ⵜⵎⵓⵣⴰⵢ."
        }
      }[lang] || texts.en;
      
      return (
        <>
          <p className="lead font-medium text-2xl text-[#1e0a2e] mb-8">{texts.intro}</p>
          
          <div className="my-10 w-full h-96 bg-neutral-200 arabic-frame overflow-hidden flex items-center justify-center relative">
            <span className="text-neutral-500 absolute z-10 font-medium">Placeholder Image</span>
            <div className="absolute inset-0 bg-neutral-300 opacity-20"></div>
          </div>
          
          <h2>{texts.h1}</h2>
          <p>{texts.p1}</p>
          
          <h2>{texts.h2}</h2>
          <p>{texts.p2}</p>
          
          <blockquote>"{texts.quote}"</blockquote>
          
          <div className="my-10 w-full h-96 bg-neutral-200 arabic-frame overflow-hidden flex items-center justify-center relative">
            <span className="text-neutral-500 absolute z-10 font-medium">Placeholder Image</span>
            <div className="absolute inset-0 bg-neutral-300 opacity-20"></div>
          </div>
          
          <h2>{texts.h3}</h2>
          <p>{texts.p3}</p>
        </>
      );
    }`;

const post8Content = `    content: (lang) => {
      const texts = {
        en: {
          intro: "Spring is the ultimate season of renewal. It's the perfect time to breathe new life into your living space with handcrafted touches.",
          h1: "1. Swap Out Heavy Textiles for Light Cottons",
          p1: "Replace heavy wool with hand-loomed cotton blankets from Moroccan artisans.",
          h2: "2. Introduce Artistic Ceramics",
          p2: "Spring is about bringing color back into our lives. Hand-painted Moroccan ceramics are versatile pieces of art.",
          h3: "3. Add Natural Texture with Woven Baskets",
          p3: "Hand-woven baskets add a vital layer of organic texture that softens modern interiors.",
          outro: "Embrace the spring by bringing the enduring beauty of handmade artistry into your environment."
        },
        fr: {
          intro: "Le printemps est la saison du renouveau. C'est le moment idéal pour donner un nouveau souffle à votre espace de vie avec des touches artisanales.",
          h1: "1. Échangez les textiles lourds contre du coton léger",
          p1: "Remplacez la laine lourde par des couvertures en coton tissées à la main par des artisans marocains.",
          h2: "2. Introduisez des céramiques artistiques",
          p2: "Le printemps ramène la couleur dans nos vies. Les céramiques marocaines peintes à la main sont des pièces d'art polyvalentes.",
          h3: "3. Ajoutez une texture naturelle avec des paniers tressés",
          p3: "Les paniers tressés à la main ajoutent une touche organique qui adoucit les intérieurs modernes.",
          outro: "Accueillez le printemps en apportant la beauté durable de l'artisanat dans votre environnement."
        },
        ar: {
          intro: "الربيع هو موسم التجديد. إنه الوقت المثالي لبث حياة جديدة في مساحة معيشتك بلمسات مصنوعة يدويًا.",
          h1: "1. استبدل المنسوجات الثقيلة بالقطن الخفيف",
          p1: "استبدل الصوف الثقيل ببطانيات قطنية منسوجة يدويًا من قبل الحرفيين المغاربة.",
          h2: "2. أضف السيراميك الفني",
          p2: "الربيع يعيد الألوان إلى حياتنا. السيراميك المغربي المطلي يدويًا هو قطع فنية متعددة الاستخدامات.",
          h3: "3. أضف ملمسًا طبيعيًا مع السلال المنسوجة",
          p3: "تضيف السلال المنسوجة يدويًا لمسة عضوية تخفف من التصميمات الداخلية الحديثة.",
          outro: "استقبل الربيع من خلال إدخال الجمال الدائم للحرف اليدوية في بيئتك."
        },
        tz: {
          intro: "ⵜⴰⴼⵙⵓⵜ ⵜⴳⴰ ⴰⵙⴳⴳⵯⴰⵙ ⵏ ⵓⵙⵎⴰⵢⵏⵓ. ⵉⴳⴰ ⴰⴽⵓⴷ ⵉⵖⵓⴷⴰⵏ ⴰⴼⴰⴷ ⴰⴷ ⵜⵙⵎⴰⵢⵏⵓⵜ ⵜⴰⴷⴷⴰⵔⵜ ⵏⵏⴽ ⵙ ⵜⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵓⴼⵓⵙ.",
          h1: "1. ⵙⵏⴼⵍ ⵜⵉⵎⵍⵙⵉⵜ ⵉⵥⴰⵢⵢⵏ ⵙ ⵍⵇⵟⵏ ⵉⴼⵙⵙⵓⵙⵏ",
          p1: "ⵙⵏⴼⵍ ⵜⴰⴹⵓⵜ ⵙ ⵉⴱⵔⴷⵉⵢⵏ ⵏ ⵍⵇⵟⵏ ⵉⵜⵜⵓⵥⴹⴰⵏ ⵙ ⵓⴼⵓⵙ.",
          h2: "2. ⵙⴽⵛⵎ ⵍⵅⵣⴼ ⵏ ⵜⴰⵥⵓⵕⵉ",
          p2: "ⵜⴰⴼⵙⵓⵜ ⴰⵔ ⴷ ⵜⵜⴰⵡⵉ ⵉⴽⵯⵍⴰⵏ. ⵍⵅⵣⴼ ⴰⵎⵖⵔⵉⴱⵉ ⵉⴳⴰ ⵜⴰⵥⵓⵕⵉ ⵉⵎⵢⴰⵏⴰⵡⵏ.",
          h3: "3. ⵔⵏⵓ ⵜⴰⵖⴰⵔⴰ ⵜⴰⴳⴰⵎⴰⵏⵜ ⵙ ⵉⵙⴽⴽⵉⵏⵏ",
          p3: "ⵉⵙⴽⴽⵉⵏⵏ ⵉⵜⵜⵓⵥⴹⴰⵏ ⴰⵔ ⵔⵏⵏⵓⵏ ⵢⴰⵜ ⵜⵖⴰⵔⴰ ⵜⴰⴳⴰⵎⴰⵏⵜ ⵉ ⵜⴰⴷⴷⴰⵔⵜ.",
          outro: "ⵙⵏⵓⴱⴳ ⵜⴰⴼⵙⵓⵜ ⵙ ⵓⵙⵉⴷⴼ ⵏ ⵜⴰⵥⵓⵕⵉ ⵏ ⵓⴼⵓⵙ ⴳ ⵜⴰⴷⴷⴰⵔⵜ ⵏⵏⴽ."
        }
      }[lang] || texts.en;
      
      return (
        <>
          <p className="lead font-medium text-2xl text-[#0a1a0e] mb-8">{texts.intro}</p>
          
          <div className="my-10 w-full h-96 bg-neutral-200 arabic-frame overflow-hidden flex items-center justify-center relative">
            <span className="text-neutral-500 absolute z-10 font-medium">Placeholder Image</span>
            <div className="absolute inset-0 bg-neutral-300 opacity-20"></div>
          </div>
          
          <h3>{texts.h1}</h3>
          <p>{texts.p1}</p>
          
          <h3>{texts.h2}</h3>
          <p>{texts.p2}</p>
          
          <h3>{texts.h3}</h3>
          <p>{texts.p3}</p>
          
          <div className="my-10 w-full h-96 bg-neutral-200 arabic-frame overflow-hidden flex items-center justify-center relative">
            <span className="text-neutral-500 absolute z-10 font-medium">Placeholder Image</span>
            <div className="absolute inset-0 bg-neutral-300 opacity-20"></div>
          </div>
          
          <p>{texts.outro}</p>
        </>
      );
    }`;

// Basic string replacement for content properties
const replaceBlock = (contentStr, startText, endText, newBlock) => {
  const startIndex = contentStr.indexOf(startText);
  if (startIndex === -1) return contentStr;
  
  // Find the exact matching '    )' or '    }' block end depending on formatting
  const endIndex = contentStr.indexOf(endText, startIndex);
  if (endIndex === -1) return contentStr;
  
  return contentStr.substring(0, startIndex) + newBlock + contentStr.substring(endIndex + endText.length);
};

// Replace post 6
let newContent = replaceBlock(content, '    content: (\n      <>\n        <p className="lead font-medium text-2xl text-[#2a0a1e] mb-8">', '      </>\n    )', post6Content);

// Replace post 7
newContent = replaceBlock(newContent, '    content: (\n      <>\n        <p className="lead font-medium text-2xl text-[#1e0a2e] mb-8">', '      </>\n    )', post7Content);

// Replace post 8
newContent = replaceBlock(newContent, '    content: (\n      <>\n        <p className="lead font-medium text-2xl text-[#0a1a0e] mb-8">', '      </>\n    )', post8Content);

fs.writeFileSync('src/app/[lang]/(main)/blog/[slug]/page.tsx', newContent);
console.log('Translations injected successfully!');
