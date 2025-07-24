import * as XLSX from 'xlsx'

export interface ExcelColumn {
  key: string
  title: string
  width?: number
}

export interface ExcelExportOptions {
  filename: string
  sheetName?: string
  columns: ExcelColumn[]
  data: Record<string, any>[]
}

/**
 * 导出数据到Excel文件
 */
export function exportToExcel(options: ExcelExportOptions) {
  const { filename, sheetName = 'Sheet1', columns, data } = options

  // 创建工作簿
  const workbook = XLSX.utils.book_new()

  // 准备表头
  const headers = columns.map(col => col.title)

  // 准备数据行
  const rows = data.map(item => 
    columns.map(col => {
      const value = item[col.key]
      // 处理日期格式
      if (value instanceof Date) {
        return value.toLocaleDateString('zh-CN')
      }
      // 处理null/undefined
      if (value === null || value === undefined) {
        return ''
      }
      return value
    })
  )

  // 合并表头和数据
  const worksheetData = [headers, ...rows]

  // 创建工作表
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

  // 设置列宽
  const colWidths = columns.map(col => ({
    wch: col.width || 15
  }))
  worksheet['!cols'] = colWidths

  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  // 导出文件
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

/**
 * 格式化公司数据用于Excel导出
 */
export function formatCompaniesForExcel(companies: any[]) {
  return companies.map(company => ({
    id: company.id,
    name: company.name,
    industry: company.industry || '',
    size: company.size || '',
    location: company.location || '',
    assessmentCount: company._count?.assessments || 0,
    createdAt: company.createdAt,
    updatedAt: company.updatedAt
  }))
}

/**
 * 公司数据Excel导出配置
 */
export const companiesExcelColumns: ExcelColumn[] = [
  { key: 'id', title: 'ID', width: 8 },
  { key: 'name', title: '公司名称', width: 20 },
  { key: 'industry', title: '行业', width: 15 },
  { key: 'size', title: '规模', width: 12 },
  { key: 'location', title: '地区', width: 15 },
  { key: 'assessmentCount', title: '评估数量', width: 12 },
  { key: 'createdAt', title: '创建时间', width: 18 },
  { key: 'updatedAt', title: '更新时间', width: 18 }
]
