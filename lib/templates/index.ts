// NORTIQ AI - Template System
// Pre-built templates for different business types

export interface TemplateSection {
  id: string
  type: 'hero' | 'about' | 'services' | 'gallery' | 'contact' | 'cta' | 'features' | 'testimonials'
  enabled: boolean
}

export interface TemplateTheme {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  fontFamily: string
}

export interface Template {
  id: string
  name: string
  nameJa: string
  description: string
  descriptionJa: string
  category: 'restaurant' | 'salon' | 'shop' | 'clinic' | 'portfolio' | 'business' | 'landing'
  icon: string
  preview: string // gradient or image URL
  theme: TemplateTheme
  sections: TemplateSection[]
  demoContent: {
    heroTitle: string
    heroSubtitle: string
    aboutTitle: string
    aboutText: string
    ctaText: string
  }
}

export const templates: Template[] = [
  {
    id: 'restaurant-elegant',
    name: 'Elegant Dining',
    nameJa: 'エレガントダイニング',
    description: 'Perfect for upscale restaurants and fine dining',
    descriptionJa: '高級レストラン・ファインダイニング向け',
    category: 'restaurant',
    icon: '🍽️',
    preview: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    theme: {
      primaryColor: '#c9a227',
      secondaryColor: '#1a1a2e',
      accentColor: '#e8d5b7',
      backgroundColor: '#0f0f0f',
      textColor: '#ffffff',
      fontFamily: 'serif',
    },
    sections: [
      { id: 'hero', type: 'hero', enabled: true },
      { id: 'about', type: 'about', enabled: true },
      { id: 'services', type: 'services', enabled: true },
      { id: 'gallery', type: 'gallery', enabled: true },
      { id: 'contact', type: 'contact', enabled: true },
    ],
    demoContent: {
      heroTitle: '至高の味わいを、特別な空間で',
      heroSubtitle: '厳選された食材と熟練の技が織りなす、忘れられないひとときを',
      aboutTitle: '私たちについて',
      aboutText: '創業以来、最高品質の食材と伝統的な調理法を大切にしながら、お客様に特別な食体験をお届けしてまいりました。',
      ctaText: '予約する',
    },
  },
  {
    id: 'restaurant-casual',
    name: 'Casual Cafe',
    nameJa: 'カジュアルカフェ',
    description: 'Warm and inviting for cafes and casual eateries',
    descriptionJa: 'カフェ・カジュアルレストラン向け',
    category: 'restaurant',
    icon: '☕',
    preview: 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 50%, #d4c4b0 100%)',
    theme: {
      primaryColor: '#8b4513',
      secondaryColor: '#f5e6d3',
      accentColor: '#d2691e',
      backgroundColor: '#fffaf5',
      textColor: '#3d2914',
      fontFamily: 'sans-serif',
    },
    sections: [
      { id: 'hero', type: 'hero', enabled: true },
      { id: 'about', type: 'about', enabled: true },
      { id: 'services', type: 'services', enabled: true },
      { id: 'gallery', type: 'gallery', enabled: true },
      { id: 'contact', type: 'contact', enabled: true },
    ],
    demoContent: {
      heroTitle: 'ほっと一息、心地よい時間',
      heroSubtitle: '自家焙煎コーヒーと手作りスイーツで、あなたの日常に彩りを',
      aboutTitle: '私たちのこだわり',
      aboutText: '毎朝焙煎する新鮮なコーヒー豆と、地元の食材を使った手作りメニュー。居心地の良い空間で、ゆったりとした時間をお過ごしください。',
      ctaText: 'メニューを見る',
    },
  },
  {
    id: 'salon-modern',
    name: 'Modern Salon',
    nameJa: 'モダンサロン',
    description: 'Sleek and stylish for hair salons and spas',
    descriptionJa: '美容室・スパ向け',
    category: 'salon',
    icon: '💇',
    preview: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 50%, #f48fb1 100%)',
    theme: {
      primaryColor: '#e91e63',
      secondaryColor: '#fce4ec',
      accentColor: '#ad1457',
      backgroundColor: '#ffffff',
      textColor: '#424242',
      fontFamily: 'sans-serif',
    },
    sections: [
      { id: 'hero', type: 'hero', enabled: true },
      { id: 'about', type: 'about', enabled: true },
      { id: 'services', type: 'services', enabled: true },
      { id: 'gallery', type: 'gallery', enabled: true },
      { id: 'testimonials', type: 'testimonials', enabled: true },
      { id: 'contact', type: 'contact', enabled: true },
    ],
    demoContent: {
      heroTitle: 'あなたらしい美しさを引き出す',
      heroSubtitle: '経験豊富なスタイリストが、理想のスタイルを実現します',
      aboutTitle: 'サロンについて',
      aboutText: '最新のトレンドと確かな技術で、お客様一人ひとりの個性を活かしたスタイルをご提案。リラックスできる空間で、特別なひとときをお過ごしください。',
      ctaText: '予約する',
    },
  },
  {
    id: 'salon-luxury',
    name: 'Luxury Spa',
    nameJa: 'ラグジュアリースパ',
    description: 'Elegant and calming for premium salons',
    descriptionJa: '高級サロン・エステ向け',
    category: 'salon',
    icon: '✨',
    preview: 'linear-gradient(135deg, #e8d5b7 0%, #c9b896 50%, #a89b7a 100%)',
    theme: {
      primaryColor: '#8b7355',
      secondaryColor: '#f5f0e8',
      accentColor: '#c9a227',
      backgroundColor: '#fdfbf7',
      textColor: '#4a4a4a',
      fontFamily: 'serif',
    },
    sections: [
      { id: 'hero', type: 'hero', enabled: true },
      { id: 'about', type: 'about', enabled: true },
      { id: 'services', type: 'services', enabled: true },
      { id: 'features', type: 'features', enabled: true },
      { id: 'gallery', type: 'gallery', enabled: true },
      { id: 'contact', type: 'contact', enabled: true },
    ],
    demoContent: {
      heroTitle: '極上の癒しを、あなたに',
      heroSubtitle: '心と体を解きほぐす、プレミアムなリラクゼーション体験',
      aboutTitle: '私たちの想い',
      aboutText: '厳選されたオーガニック製品と熟練のセラピストによる施術で、日常の疲れを癒し、本来の美しさを引き出します。',
      ctaText: 'ご予約・お問い合わせ',
    },
  },
  {
    id: 'shop-minimal',
    name: 'Minimal Shop',
    nameJa: 'ミニマルショップ',
    description: 'Clean and modern for retail stores',
    descriptionJa: '小売店・セレクトショップ向け',
    category: 'shop',
    icon: '🛍️',
    preview: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 50%, #bdbdbd 100%)',
    theme: {
      primaryColor: '#212121',
      secondaryColor: '#f5f5f5',
      accentColor: '#ff5722',
      backgroundColor: '#ffffff',
      textColor: '#212121',
      fontFamily: 'sans-serif',
    },
    sections: [
      { id: 'hero', type: 'hero', enabled: true },
      { id: 'about', type: 'about', enabled: true },
      { id: 'features', type: 'features', enabled: true },
      { id: 'gallery', type: 'gallery', enabled: true },
      { id: 'contact', type: 'contact', enabled: true },
    ],
    demoContent: {
      heroTitle: 'シンプルに、上質を',
      heroSubtitle: '厳選されたアイテムで、あなたの日常をもっと豊かに',
      aboutTitle: '私たちのコンセプト',
      aboutText: '本当に良いものだけを。世界中から厳選したアイテムを、シンプルで使いやすい形でお届けします。',
      ctaText: 'ショップを見る',
    },
  },
  {
    id: 'clinic-trust',
    name: 'Trusted Clinic',
    nameJa: 'トラストクリニック',
    description: 'Professional and trustworthy for medical practices',
    descriptionJa: 'クリニック・医院向け',
    category: 'clinic',
    icon: '🏥',
    preview: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
    theme: {
      primaryColor: '#1976d2',
      secondaryColor: '#e3f2fd',
      accentColor: '#0d47a1',
      backgroundColor: '#ffffff',
      textColor: '#37474f',
      fontFamily: 'sans-serif',
    },
    sections: [
      { id: 'hero', type: 'hero', enabled: true },
      { id: 'about', type: 'about', enabled: true },
      { id: 'services', type: 'services', enabled: true },
      { id: 'features', type: 'features', enabled: true },
      { id: 'contact', type: 'contact', enabled: true },
    ],
    demoContent: {
      heroTitle: '地域の皆様の健康を守る',
      heroSubtitle: '丁寧な診察と最新の医療で、安心できる医療サービスを',
      aboutTitle: '当院について',
      aboutText: '地域に根ざした医療を目指し、患者様一人ひとりに寄り添った丁寧な診察を心がけています。お気軽にご相談ください。',
      ctaText: '診療予約',
    },
  },
  {
    id: 'portfolio-creative',
    name: 'Creative Portfolio',
    nameJa: 'クリエイティブポートフォリオ',
    description: 'Bold and artistic for creatives and freelancers',
    descriptionJa: 'クリエイター・フリーランス向け',
    category: 'portfolio',
    icon: '🎨',
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    theme: {
      primaryColor: '#667eea',
      secondaryColor: '#f5f5f5',
      accentColor: '#764ba2',
      backgroundColor: '#ffffff',
      textColor: '#2d3748',
      fontFamily: 'sans-serif',
    },
    sections: [
      { id: 'hero', type: 'hero', enabled: true },
      { id: 'about', type: 'about', enabled: true },
      { id: 'gallery', type: 'gallery', enabled: true },
      { id: 'services', type: 'services', enabled: true },
      { id: 'contact', type: 'contact', enabled: true },
    ],
    demoContent: {
      heroTitle: 'デザインで、想いを形に',
      heroSubtitle: 'クリエイティブの力で、あなたのビジョンを実現します',
      aboutTitle: '自己紹介',
      aboutText: 'デザイナーとして10年以上の経験を持ち、ブランディングからWebデザインまで幅広く手がけています。',
      ctaText: 'お仕事の相談',
    },
  },
  {
    id: 'business-corporate',
    name: 'Corporate Business',
    nameJa: 'コーポレート',
    description: 'Professional for businesses and companies',
    descriptionJa: '企業・会社向け',
    category: 'business',
    icon: '🏢',
    preview: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 50%, #3182ce 100%)',
    theme: {
      primaryColor: '#2c5282',
      secondaryColor: '#ebf8ff',
      accentColor: '#ed8936',
      backgroundColor: '#ffffff',
      textColor: '#2d3748',
      fontFamily: 'sans-serif',
    },
    sections: [
      { id: 'hero', type: 'hero', enabled: true },
      { id: 'about', type: 'about', enabled: true },
      { id: 'services', type: 'services', enabled: true },
      { id: 'features', type: 'features', enabled: true },
      { id: 'contact', type: 'contact', enabled: true },
    ],
    demoContent: {
      heroTitle: '信頼と実績で、未来を創る',
      heroSubtitle: 'お客様のビジネス成功をサポートする、最適なソリューションを',
      aboutTitle: '会社概要',
      aboutText: '創業以来、お客様の信頼にお応えし、確かな実績を積み重ねてまいりました。これからも誠実なサービスでお客様のビジネスを支援します。',
      ctaText: 'お問い合わせ',
    },
  },
  {
    id: 'landing-product',
    name: 'Product Launch',
    nameJa: 'プロダクトランディング',
    description: 'High-converting landing page for products',
    descriptionJa: '商品・サービス紹介LP向け',
    category: 'landing',
    icon: '🚀',
    preview: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
    theme: {
      primaryColor: '#6366f1',
      secondaryColor: '#f5f3ff',
      accentColor: '#10b981',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      fontFamily: 'sans-serif',
    },
    sections: [
      { id: 'hero', type: 'hero', enabled: true },
      { id: 'features', type: 'features', enabled: true },
      { id: 'about', type: 'about', enabled: true },
      { id: 'testimonials', type: 'testimonials', enabled: true },
      { id: 'cta', type: 'cta', enabled: true },
      { id: 'contact', type: 'contact', enabled: true },
    ],
    demoContent: {
      heroTitle: '革新的なソリューションで、課題を解決',
      heroSubtitle: '今すぐ始めて、ビジネスを次のステージへ',
      aboutTitle: '選ばれる理由',
      aboutText: '使いやすさと高い効果を両立。多くのお客様に選ばれ続けている理由がここにあります。',
      ctaText: '無料で始める',
    },
  },
]

// Get templates by category
export function getTemplatesByCategory(category: Template['category']): Template[] {
  return templates.filter(t => t.category === category)
}

// Get template by ID
export function getTemplateById(id: string): Template | undefined {
  return templates.find(t => t.id === id)
}

// Get all categories with counts
export function getCategories(): { id: Template['category']; label: string; count: number }[] {
  const categories: { id: Template['category']; label: string }[] = [
    { id: 'restaurant', label: '飲食店' },
    { id: 'salon', label: '美容・サロン' },
    { id: 'shop', label: '小売・ショップ' },
    { id: 'clinic', label: 'クリニック' },
    { id: 'portfolio', label: 'ポートフォリオ' },
    { id: 'business', label: '企業・ビジネス' },
    { id: 'landing', label: 'ランディングページ' },
  ]

  return categories.map(cat => ({
    ...cat,
    count: templates.filter(t => t.category === cat.id).length,
  }))
}
