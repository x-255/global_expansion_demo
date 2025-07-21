import Link from 'next/link'
import type { Company } from '@/generated/prisma/client'

type CompanyWithCount = Company & {
  _count: {
    assessments: number
  }
}

interface CompaniesCardsProps {
  companies: CompanyWithCount[]
  clickedId: number | null
  onCompanyClick: (e: React.MouseEvent, companyId: number) => void
}

export function CompaniesCards({
  companies,
  clickedId,
  onCompanyClick,
}: CompaniesCardsProps) {
  if (companies.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">没有找到公司</h3>
        <p className="mt-1 text-sm text-gray-500">没有找到符合条件的公司记录</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {companies.map((company) => (
        <Link
          key={company.id}
          href={`/admin/companies/${company.id}/assessments`}
          onClick={(e) => onCompanyClick(e, company.id)}
          className={`block bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 relative ${
            clickedId === company.id ? 'opacity-70' : ''
          }`}
        >
          <div className="flex flex-col space-y-3">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold text-gray-900">
                {company.name}
              </h2>
              <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                <span className="font-medium text-blue-600">
                  {company._count.assessments}
                </span>
                <span className="text-blue-500 ml-1">评估</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <svg
                  className="w-4 h-4 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className="font-medium">行业：</span>
              </div>
              <div className="text-gray-700">
                {company.industry || '未设置行业'}
              </div>

              <div className="flex items-center text-gray-600">
                <svg
                  className="w-4 h-4 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-medium">地区：</span>
              </div>
              <div className="text-gray-700">
                {company.location || '未设置地区'}
              </div>

              <div className="flex items-center text-gray-600">
                <svg
                  className="w-4 h-4 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                <span className="font-medium">规模：</span>
              </div>
              <div className="text-gray-700">
                {company.size || '未设置规模'}
              </div>
            </div>
          </div>
          {clickedId === company.id && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-xl">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          )}
        </Link>
      ))}
    </div>
  )
}
