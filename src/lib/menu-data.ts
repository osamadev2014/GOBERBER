import heroBurger from "@/assets/hero-burger.jpg";
import burgerClassic from "@/assets/burger-classic.jpg";
import burgerBacon from "@/assets/burger-bacon.jpg";
import burgerSpicy from "@/assets/burger-spicy.jpg";
import burgerTruffle from "@/assets/burger-truffle.jpg";
import catFries from "@/assets/cat-fries.jpg";
import catShakes from "@/assets/cat-shakes.jpg";
import catChicken from "@/assets/cat-chicken.jpg";

export type Product = {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  tagline: string;
  taglineAr: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
  badgeAr?: string;
  calories?: number;
  protein?: number;
  ingredients?: string;
  ingredientsAr?: string;
  images?: string[];
};

export const categories = [
  { id: "signatures", name: "Signatures", nameAr: "توقيعات", image: heroBurger },
  { id: "classics", name: "Classics", nameAr: "كلاسيكيات", image: burgerClassic },
  { id: "chicken", name: "Chicken", nameAr: "دجاج", image: catChicken },
  { id: "sides", name: "Sides", nameAr: "أطباق جانبية", image: catFries },
  { id: "shakes", name: "Shakes", nameAr: "ميلك شيك", image: catShakes },
];

export const products: Product[] = [
  {
    id: "p1",
    slug: "the-ember-double",
    name: "The Ember Double",
    nameAr: "إمبور مزدوج",
    tagline: "Double smash, aged cheddar, burnt onion jam.",
    taglineAr: "برجر مسطوح مزدوج، شيدر معتق، مربى بصل محمّر.",
    price: 12.5,
    image: heroBurger,
    category: "signatures",
    badge: "Chef's pick",
    badgeAr: "اختيار الشيف",
    calories: 780,
    protein: 48,
    ingredients:
      "100% grass-fed beef, aged cheddar, brioche bun, house pickles, caramelized onion, ember sauce, iceberg lettuce, roma tomato.",
    ingredientsAr:
      "لحم بقر عشبي 100%، شيدر معتق، خبز بريوش، مخلل منزلي، بصل كرامل، صوص الإمبور، خس، طماطم روما.",
  },
  {
    id: "p2",
    slug: "classic-cheese",
    name: "Classic Cheese",
    nameAr: "كلاسيك جبنة",
    tagline: "One patty, American cheese, brioche.",
    taglineAr: "قطعة لحم واحدة، جبنة أمريكية، بريوش.",
    price: 8.0,
    image: burgerClassic,
    category: "classics",
    calories: 540,
    protein: 28,
    ingredients:
      "Grass-fed beef, American cheese, brioche bun, ketchup, mustard, pickles, shredded lettuce.",
    ingredientsAr:
      "لحم بقر عشبي، جبنة أمريكية، خبز بريوش، كاتشب، مسترد، مخلل، خس مفروم.",
  },
  {
    id: "p3",
    slug: "grilled-tower",
    name: "Bacon Tower",
    nameAr: "البرج المشوي",
    tagline: "Triple stack, smoked bacon, cheese cascade.",
    taglineAr: "ثلاث طبقات لحم، لحم بقر مدخّن، جبنة ذائبة.",
    price: 15.9,
    image: burgerBacon,
    category: "signatures",
    badge: "New",
    badgeAr: "جديد",
    calories: 1180,
    protein: 62,
    ingredients:
      "Triple grass-fed beef, smoked bacon, triple cheddar, brioche bun, caramelized onion, garlic aioli, lettuce.",
    ingredientsAr:
      "ثلاث قطع لحم عشبي، لحم بقر مدخّن، شيدر ثلاثي، خبز بريوش، بصل كرامل، أيولي ثوم، خس.",
  },
  {
    id: "p4",
    slug: "black-inferno",
    name: "Black Inferno",
    nameAr: "النار السوداء",
    tagline: "Charcoal bun, jalapeño, ghost pepper sauce.",
    taglineAr: "خبز فحم، هالابينيو، صوص فلفل الشبح.",
    price: 13.5,
    image: burgerSpicy,
    category: "signatures",
    badge: "🔥 Hot",
    badgeAr: "🔥 حار",
    calories: 690,
    protein: 42,
    ingredients:
      "Grass-fed beef, charcoal brioche bun, jalapeños, ghost pepper sauce, pepper jack, red onion, cilantro.",
    ingredientsAr:
      "لحم بقر عشبي، خبز فحم بريوش، هالابينيو، صوص فلفل الشبح، جبنة بيبر جاك، بصل أحمر، كزبرة.",
  },
  {
    id: "p5",
    slug: "truffle- Royale",
    name: "Truffle Royale",
    nameAr: "ترافل رويال",
    tagline: "Truffle aioli, aged gruyère, caramelized onion.",
    taglineAr: "أيولي ترافل، غرويير معتق، بصل كرامل.",
    price: 16.9,
    image: burgerTruffle,
    category: "signatures",
    calories: 820,
    protein: 44,
    ingredients:
      "Grass-fed beef, aged gruyère, truffle aioli, caramelized onion, arugula, brioche bun, sea salt.",
    ingredientsAr:
      "لحم بقر عشبي، غرويير معتق، أيولي ترافل، بصل كرامل، روكولا، خبز بريوش، ملح بحري.",
  },
  {
    id: "p6",
    slug: "crispy-tenders",
    name: "Crispy Tenders",
    nameAr: "ستربس مقرمشة",
    tagline: "Buttermilk brined, house dip.",
    taglineAr: "مقلية في حليب الزبدة، صوص منزلي.",
    price: 9.5,
    image: catChicken,
    category: "chicken",
    calories: 610,
    protein: 38,
    ingredients:
      "Buttermilk-brined chicken breast, seasoned flour, house dip, pickles.",
    ingredientsAr:
      "صدر دجاج متبل في حليب الزبدة، طحين متبّل، صوص منزلي، مخلل.",
  },
  {
    id: "p7",
    slug: "ember-fries",
    name: "Ember Fries",
    nameAr: " fries الإمبور",
    tagline: "Twice-cooked, smoked salt.",
    taglineAr: "مقلية مرتين، ملح مدخّن.",
    price: 4.5,
    image: catFries,
    category: "sides",
    calories: 380,
    protein: 5,
    ingredients:
      "Hand-cut russet potatoes, smoked sea salt, ember seasoning.",
    ingredientsAr:
      "بطاطس يدوية التقطيع، ملح بحري مدخّن، توابل الإمبور.",
  },
  {
    id: "p8",
    slug: "cocoa-shake",
    name: "Cocoa Shake",
    nameAr: "ميلك شيك الكاكاو",
    tagline: "Dark chocolate, cream, cherry.",
    taglineAr: "شوكولاتة داكنة، كريمة، كرز.",
    price: 5.9,
    image: catShakes,
    category: "shakes",
    calories: 520,
    protein: 12,
    ingredients:
      "Belgian dark chocolate, vanilla ice cream, fresh cream, maraschino cherry.",
    ingredientsAr:
      "شوكولاتة بلجيكية داكنة، آيس كريم فانيليا، كريمة طازجة، كرز ماراشينو.",
  },
];

export const combos = [
  {
    id: "c1",
    name: "Ember Duo Meal",
    nameAr: "وجبة إمبور ثنائية",
    items: "Ember Double + Fries + Shake",
    itemsAr: "إمبور مزدوج + فرايز + ميلك شيك",
    price: 18.9,
    save: 3.9,
    image: heroBurger,
  },
  {
    id: "c2",
    name: "Family Feast",
    nameAr: "وليمة العائلة",
    items: "4 Burgers · 2 Fries · 4 Drinks",
    itemsAr: "4 برجر · 2 فرايز · 4 مشروبات",
    price: 49.9,
    save: 12.0,
    image: burgerBacon,
  },
];

export const extras = [
  { id: "cheese", label: "Extra cheese", labelAr: "جبنة إضافية", price: 1.5 },
  { id: "smoked-beef", label: "Smoked beef", labelAr: "لحم بقر مدخّن", price: 2.0 },
  { id: "onion", label: "Burnt onion jam", labelAr: "مربى بصل محمّر", price: 1.0 },
  { id: "jalapeno", label: "Jalapeños", labelAr: "هالابينيو", price: 0.75 },
  { id: "truffle", label: "Truffle aioli", labelAr: "أيولي ترافل", price: 1.75 },
];

export const modifiers = [
  { en: "No pickles", ar: "بدون مخلل" },
  { en: "No onion", ar: "بدون بصل" },
  { en: "No sauce", ar: "بدون صوص" },
  { en: "Gluten-free bun", ar: "خبز بدون غلوتين" },
];

export const offers = [
  {
    id: "o1",
    title: "Free delivery over 25 ﷼",
    titleAr: "توصيل مجاني فوق 25 ﷼",
    subtitle: "Every order, every day.",
    subtitleAr: "كل طلب، كل يوم.",
    accent: "ember" as const,
  },
  {
    id: "o2",
    title: "20% off first order",
    titleAr: "خصم 20% على أول طلب",
    subtitle: "Use code EMBER20 at checkout.",
    subtitleAr: "استخدم كود EMBER20 عند الدفع.",
    accent: "flame" as const,
  },
  {
    id: "o3",
    title: "Loyalty · Earn 1 point per 1 ﷼",
    titleAr: "ولاء · اكسب نقطة لكل 1 ﷼",
    subtitle: "Redeem for free burgers.",
    subtitleAr: "استبدل ببرجر مجاني.",
    accent: "cream" as const,
  },
];
