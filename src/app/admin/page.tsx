import { Card } from '@/components/admin'
import Link from 'next/link'
import { getDashboardStats, getRecentAssessments } from './actions'

export default async function AdminDashboard() {
  const [dashboardStats, recentAssessments] = await Promise.all([
    getDashboardStats(),
    getRecentAssessments(),
  ])

  const statsCards = [
    {
      name: '企业总数',
      value: dashboardStats.companiesCount.toString(),
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
    },
    {
      name: '评估总数',
      value: dashboardStats.assessmentsCount.toString(),
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      name: '活跃用户',
      value: dashboardStats.activeUsersCount.toString(),
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
    },
    {
      name: '本月评估',
      value: dashboardStats.thisMonthAssessments.toString(),
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
  ]
  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">仪表板</h1>
        <p className="mt-2 text-slate-600">欢迎回到全球化扩张评估管理系统</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>
              </div>
              <div className="p-3 bg-slate-100 rounded-lg text-slate-600">
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 最近评估 */}
      <div>
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-slate-900">最近评估</h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {recentAssessments.length > 0 ? (
                recentAssessments.map((assessment) => (
                  <Link
                    key={assessment.id}
                    href={`/admin/companies/${assessment.companyId}/assessments`}
                    className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 rounded-lg px-2 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {assessment.companyName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(assessment.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {assessment.status}
                    </span>
                  </Link>
                ))
              ) : (
                <p className="text-slate-500 text-center py-4">暂无评估记录</p>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}
