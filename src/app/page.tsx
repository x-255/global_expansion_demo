import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          企业出海能力评估
        </h1>
        <p className="text-gray-600 text-center mb-4">
          帮助中国企业系统性评估自身的国际化（出海）能力，发现优势与短板，助力全球化发展。
        </p>
        <Link
          href="/assessment"
          className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          开始评估
        </Link>
      </div>
      <footer className="mt-10 text-gray-400 text-sm">
        © {new Date().getFullYear()} 企业出海能力评估
      </footer>
    </div>
  )
}
