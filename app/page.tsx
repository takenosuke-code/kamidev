import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'
import {
  Sparkles,
  Clock,
  Shield,
  Check,
  X,
  ArrowRight,
  Zap,
  Globe,
  Palette,
  BarChart3,
  Headphones,
  Lock,
  RefreshCw,
  ChevronRight,
  Star
} from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-ai-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">NORTIQ</h1>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-slate-800 font-medium transition-colors"
                >
                  ダッシュボード
                </Link>
                <LogoutButton variant="minimal" />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-slate-800 font-medium transition-colors"
                >
                  ログイン
                </Link>
                <Link
                  href="/login"
                  className="btn-ai text-sm px-5 py-2.5"
                >
                  無料で始める
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-ai-50/50 to-white" />

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-ai-200/30 rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-ai-100 to-purple-100 text-ai-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Sparkles size={16} className="text-ai-600" />
            <span>AIが全て自動で作成します</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-slate-800 leading-tight mb-6 animate-fade-in-up">
            プロ品質のホームページが
            <br />
            <span className="gradient-text">たった3分</span>で完成。
          </h2>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            お店の名前を入力するだけ。デザイン、コーディング、スマホ対応
            <br />
            すべてAIにおまかせください。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link
              href="/login"
              className="btn-ai inline-flex items-center justify-center gap-2 px-8 py-4 text-lg"
            >
              無料で始める
              <ArrowRight size={20} />
            </Link>
            <Link
              href="#how-it-works"
              className="btn-ghost inline-flex items-center justify-center gap-2 px-8 py-4 text-lg"
            >
              詳しく見る
              <ChevronRight size={20} />
            </Link>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-col items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-sm text-gray-500">500店舗以上にご利用</span>
            </div>
            <div className="flex items-center gap-6 opacity-50">
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
              <div className="w-24 h-8 bg-gray-200 rounded"></div>
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
              <div className="w-22 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Feature Grid */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">
              NORTIQの特徴
            </h3>
            <p className="text-gray-600">
              AIの力で、誰でも簡単にプロ品質のホームページを作成できます
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Large feature card */}
            <div className="lg:col-span-2 bento-card bg-gradient-to-br from-slate-800 to-slate-700 text-white border-0 p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-white/80">AIパワード</span>
              </div>
              <h4 className="text-2xl font-bold mb-3">3分でプロ品質</h4>
              <p className="text-gray-300 mb-6">
                業種を入力するだけで、AIが最適なデザインを自動生成。
                専門知識は一切不要です。コーディング、レスポンシブ対応、
                SEO対策まで全て自動で完了します。
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/10 rounded-full text-sm">自動デザイン</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-sm">SEO対策</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-sm">スマホ対応</span>
              </div>
            </div>

            {/* Speed card */}
            <div className="bento-card">
              <div className="w-12 h-12 bg-ai-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-ai-600" />
              </div>
              <h4 className="font-semibold text-slate-800 text-lg mb-2">即日公開</h4>
              <p className="text-gray-600 text-sm">
                デザインを選んだらすぐに公開。待ち時間なしでビジネスを始められます。
              </p>
            </div>

            {/* Design card */}
            <div className="bento-card">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-slate-800 text-lg mb-2">3つのデザイン提案</h4>
              <p className="text-gray-600 text-sm">
                業種に最適化された3パターンのデザインからお好みを選択できます。
              </p>
            </div>

            {/* Analytics card */}
            <div className="bento-card">
              <div className="w-12 h-12 bg-matcha-100 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-matcha-600" />
              </div>
              <h4 className="font-semibold text-slate-800 text-lg mb-2">アナリティクス</h4>
              <p className="text-gray-600 text-sm">
                訪問者数、ページビュー、滞在時間など、重要な指標をリアルタイムで確認。
              </p>
            </div>

            {/* Domain card */}
            <div className="bento-card">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-slate-800 text-lg mb-2">独自ドメイン対応</h4>
              <p className="text-gray-600 text-sm">
                お持ちのドメインを簡単に接続。ブランドイメージを統一できます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">
              かんたん3ステップ
            </h3>
            <p className="text-gray-600">
              難しい操作は一切ありません
            </p>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-ai-500 to-purple-500 hidden md:block"></div>

            <div className="space-y-8 stagger-children">
              {/* Step 1 */}
              <div className="flex gap-6 items-start">
                <div className="w-16 h-16 bg-gradient-to-br from-ai-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 relative z-10 shadow-lg shadow-ai-500/30">
                  1
                </div>
                <div className="bento-card flex-1">
                  <h4 className="font-semibold text-slate-800 text-lg mb-2">
                    業種を入力する
                  </h4>
                  <p className="text-gray-600">
                    「渋谷の美容室」「新宿のイタリアンレストラン」など、あなたのビジネスを教えてください。
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6 items-start">
                <div className="w-16 h-16 bg-gradient-to-br from-ai-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 relative z-10 shadow-lg shadow-ai-500/30">
                  2
                </div>
                <div className="bento-card flex-1">
                  <h4 className="font-semibold text-slate-800 text-lg mb-2">
                    AIが3つのデザインを提案
                  </h4>
                  <p className="text-gray-600">
                    あなたの業種に最適なデザインを3パターンご提案。お好みのものをお選びください。
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6 items-start">
                <div className="w-16 h-16 bg-gradient-to-br from-ai-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 relative z-10 shadow-lg shadow-ai-500/30">
                  3
                </div>
                <div className="bento-card flex-1">
                  <h4 className="font-semibold text-slate-800 text-lg mb-2">
                    選ぶだけで公開完了
                  </h4>
                  <p className="text-gray-600">
                    デザインを選んだら即座に公開。SSL証明書、スマホ対応、全て自動で設定されます。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">
              なぜNORTIQが選ばれるのか
            </h3>
            <p className="text-gray-600">
              従来の方法との比較
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-2xl overflow-hidden shadow-lg">
              <thead>
                <tr>
                  <th className="p-5 text-left bg-gray-50"></th>
                  <th className="p-5 text-center bg-gray-50">
                    <span className="text-gray-600 font-medium">制作会社</span>
                  </th>
                  <th className="p-5 text-center bg-gray-50">
                    <span className="text-gray-600 font-medium">DIYツール</span>
                  </th>
                  <th className="p-5 text-center bg-gradient-to-r from-ai-600 to-purple-600 text-white">
                    <span className="font-bold">NORTIQ</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="p-5 font-medium text-slate-700">
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-gray-400" />
                      制作時間
                    </div>
                  </td>
                  <td className="p-5 text-center text-gray-600">2〜4週間</td>
                  <td className="p-5 text-center text-gray-600">数日〜数週間</td>
                  <td className="p-5 text-center bg-ai-50 font-bold text-ai-700">
                    3分
                  </td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="p-5 font-medium text-slate-700">費用</td>
                  <td className="p-5 text-center text-gray-600">30〜100万円</td>
                  <td className="p-5 text-center text-gray-600">月額1,000〜3,000円</td>
                  <td className="p-5 text-center bg-ai-50 font-bold text-ai-700">
                    月額1,980円〜
                  </td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="p-5 font-medium text-slate-700">専門知識</td>
                  <td className="p-5 text-center">
                    <span className="text-gray-400 text-sm">不要</span>
                  </td>
                  <td className="p-5 text-center">
                    <span className="text-red-500 text-sm">必要</span>
                  </td>
                  <td className="p-5 text-center bg-ai-50">
                    <Check className="mx-auto text-matcha-500" size={20} />
                  </td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="p-5 font-medium text-slate-700">プロ品質</td>
                  <td className="p-5 text-center">
                    <Check className="mx-auto text-matcha-500" size={20} />
                  </td>
                  <td className="p-5 text-center">
                    <X className="mx-auto text-red-400" size={20} />
                  </td>
                  <td className="p-5 text-center bg-ai-50">
                    <Check className="mx-auto text-matcha-500" size={20} />
                  </td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="p-5 font-medium text-slate-700">即日公開</td>
                  <td className="p-5 text-center">
                    <X className="mx-auto text-red-400" size={20} />
                  </td>
                  <td className="p-5 text-center">
                    <X className="mx-auto text-red-400" size={20} />
                  </td>
                  <td className="p-5 text-center bg-ai-50">
                    <Check className="mx-auto text-matcha-500" size={20} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Anshin Guarantee Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="w-20 h-20 bg-gradient-to-br from-matcha-400 to-matcha-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-matcha-500/30">
            <Shield className="w-10 h-10 text-white" />
          </div>

          <h3 className="text-3xl font-bold mb-4">安心保証</h3>
          <p className="text-gray-300 mb-10 max-w-2xl mx-auto">
            お客様に安心してご利用いただけるよう、万全のサポート体制を整えています。
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 card-hover">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">24時間サポート</h4>
              <p className="text-gray-400 text-sm">
                困ったときはいつでもチャットでお問い合わせいただけます。
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 card-hover">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">SSL証明書無料</h4>
              <p className="text-gray-400 text-sm">
                セキュリティ対策も自動で設定。追加費用は一切不要です。
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 card-hover">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">自動バックアップ</h4>
              <p className="text-gray-400 text-sm">
                万が一のトラブルにも、すぐに復旧できる体制を整えています。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-slate-800 mb-4">
            シンプルな料金プラン
          </h3>
          <p className="text-gray-600 mb-10">
            初期費用なし。必要な機能だけを選べます。
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Starter Plan */}
            <div className="bento-card text-left">
              <h4 className="font-semibold text-slate-800 text-xl mb-2">スタータープラン</h4>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-slate-800">¥1,980</span>
                <span className="text-gray-500">/月</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-gray-600">
                  <Check size={18} className="text-matcha-500" />
                  <span>AIサイト生成</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check size={18} className="text-matcha-500" />
                  <span>月100回のAIリクエスト</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check size={18} className="text-matcha-500" />
                  <span>SSL証明書無料</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check size={18} className="text-matcha-500" />
                  <span>メールサポート</span>
                </li>
              </ul>
              <Link href="/login" className="btn-ghost w-full text-center block">
                プランを選択
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bento-card text-left border-2 border-ai-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="badge badge-ai">おすすめ</span>
              </div>
              <h4 className="font-semibold text-slate-800 text-xl mb-2">プロプラン</h4>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-slate-800">¥5,980</span>
                <span className="text-gray-500">/月</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-gray-600">
                  <Check size={18} className="text-matcha-500" />
                  <span>スタータープランの全機能</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check size={18} className="text-matcha-500" />
                  <span>月500回のAIリクエスト</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check size={18} className="text-matcha-500" />
                  <span>自動翻訳機能</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check size={18} className="text-matcha-500" />
                  <span>独自ドメイン対応</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check size={18} className="text-matcha-500" />
                  <span>優先サポート</span>
                </li>
              </ul>
              <Link href="/login" className="btn-ai w-full text-center block">
                プランを選択
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-ai-600 to-purple-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">
            今すぐ始めましょう
          </h3>
          <p className="text-white/80 mb-8">
            クレジットカード不要。3分でプロ品質のホームページが完成します。
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-ai-700 px-8 py-4 rounded-xl font-medium text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            無料で始める
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-ai-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">NORTIQ</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-slate-800 transition-colors">利用規約</a>
              <a href="#" className="hover:text-slate-800 transition-colors">プライバシーポリシー</a>
              <a href="#" className="hover:text-slate-800 transition-colors">特定商取引法</a>
              <a href="#" className="hover:text-slate-800 transition-colors">お問い合わせ</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">
              &copy; 2026 NORTIQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
