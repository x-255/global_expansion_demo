import type { Company } from '@/generated/prisma/client'
import Link from 'next/link'
import { useState } from 'react'
import CompaniesForm from './CompaniesForm'
import {
  exportToExcel,
  formatCompaniesForExcel,
  companiesExcelColumns,
} from '@/utils/excel'
import { Button, Card, Table, type Column } from '@/components/admin'

export type CompanyWithCount = Company & {
  _count: {
    assessments: number
  }
}

interface CompaniesTableProps {
  companies: CompanyWithCount[]
  clickedId: number | null
  onCompanyClick: (e: React.MouseEvent, companyId: number) => void
  onCompanyUpdated: () => void
}

export function CompaniesTable({
  companies,
  onCompanyClick,
  onCompanyUpdated,
}: Omit<CompaniesTableProps, 'clickedId'>) {
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingCompany, setEditingCompany] = useState<CompanyWithCount | null>(
    null
  )

  const handleEdit = (company: CompanyWithCount) => {
    setLoading(true)
    setEditingCompany(company)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingCompany(null)
    setLoading(false)
  }

  const handleExportExcel = () => {
    const formattedData = formatCompaniesForExcel(companies)
    const currentDate = new Date()
      .toLocaleDateString('zh-CN')
      .replace(/\//g, '-')
    exportToExcel({
      filename: `公司列表_${currentDate}`,
      sheetName: '公司列表',
      columns: companiesExcelColumns,
      data: formattedData,
    })
  }

  // 定义表格列
  const columns: Column<CompanyWithCount>[] = [
    {
      key: 'id',
      title: 'ID',
      width: 80,
      render: (value) => (
        <span className="font-mono text-sm text-slate-600">
          {value as React.ReactNode}
        </span>
      ),
    },
    {
      key: 'name',
      title: '公司名称',
      render: (value, record) => (
        <div className="flex items-center gap-3">
          <div>
            <div className="font-medium text-slate-900">
              {value as React.ReactNode}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'industry',
      title: '行业',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {(value as React.ReactNode) || '未设置'}
        </span>
      ),
    },
    {
      key: 'size',
      title: '规模',
      render: (value) => (
        <span className="text-sm text-slate-600">
          {(value as React.ReactNode) || '-'}
        </span>
      ),
    },
    {
      key: 'location',
      title: '地区',
      render: (value) => (
        <span className="text-sm text-slate-600">
          {(value as React.ReactNode) || '-'}
        </span>
      ),
    },
    {
      key: '_count.assessments',
      title: '评估次数',
      align: 'center' as const,
      render: (_, record) => (
        <span className="inline-flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
          {record._count.assessments}
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: '创建时间',
      render: (value) => (
        <span className="text-sm text-slate-600">
          {new Date(value as string | number | Date).toLocaleDateString(
            'zh-CN'
          )}
        </span>
      ),
    },
    {
      key: 'actions',
      title: '操作',
      width: 140,
      render: (_, record) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation()
              handleEdit(record)
            }}
          >
            编辑
          </Button>
          <Link
            href={`/admin/companies/${record.id}/assessments`}
            onClick={(e) => onCompanyClick(e, record.id)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            查看
          </Link>
        </div>
      ),
    },
  ]

  return (
    <Card padding="none">
      <Card.Header
        actions={
          <Button
            variant="success"
            onClick={handleExportExcel}
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
          >
            导出Excel
          </Button>
        }
      >
        <h3 className="text-lg font-semibold text-slate-800">公司列表</h3>
        <p className="text-sm text-slate-500 mt-1">管理所有注册的企业信息</p>
      </Card.Header>

      <Table
        columns={columns}
        data={companies}
        loading={loading}
        emptyText="暂无公司数据"
        onRowClick={(record) => {
          const event = new MouseEvent('click', { bubbles: true })
          onCompanyClick(event as unknown as React.MouseEvent, record.id)
        }}
      />

      {showForm && (
        <CompaniesForm
          company={editingCompany}
          onClose={handleCloseForm}
          onUpdated={onCompanyUpdated}
        />
      )}
    </Card>
  )
}
