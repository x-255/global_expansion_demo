import type { Company } from '@/generated/prisma/client'
import Link from 'next/link'

type CompanyWithCount = Company & {
  _count: {
    assessments: number
  }
}

interface CompaniesTableProps {
  companies: CompanyWithCount[]
  clickedId: number | null
  onCompanyClick: (e: React.MouseEvent, companyId: number) => void
}

export function CompaniesTable({
  companies,
  clickedId,
  onCompanyClick,
}: CompaniesTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-1">公司名称</div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-1">行业</div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-1">规模</div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-1">地区</div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-1">评估次数</div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-1">创建时间</div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {companies.map((company) => (
            <tr
              key={company.id}
              className={`hover:bg-gray-50 transition-colors ${
                clickedId === company.id ? 'opacity-50' : ''
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {company.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {company.industry || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {company.size || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {company.location || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {company._count.assessments}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(company.createdAt).toLocaleDateString('zh-CN')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link
                  href={`/admin/companies/${company.id}/assessments`}
                  onClick={(e) => onCompanyClick(e, company.id)}
                  className="text-blue-600 hover:text-blue-900 transition-colors"
                >
                  {clickedId === company.id ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                      加载中...
                    </div>
                  ) : (
                    '查看详情'
                  )}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {companies.length === 0 && (
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            没有找到公司
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            没有找到符合条件的公司记录
          </p>
        </div>
      )}
    </div>
  )
}
