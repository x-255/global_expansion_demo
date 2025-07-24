export interface BreadcrumbItem {
  name: string
  href?: string
}

export function generateBreadcrumb(pathname: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = []

  // 移除 /admin 前缀
  const path = pathname.replace('/admin', '')

  if (!path || path === '/') {
    return breadcrumbs
  }

  const segments = path.split('/').filter(Boolean)

  // 根据路径生成面包屑
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    const currentPath = '/admin/' + segments.slice(0, i + 1).join('/')

    switch (segment) {
      case 'companies':
        breadcrumbs.push({ name: '企业管理', href: currentPath })
        break
      case 'dimensions':
        breadcrumbs.push({ name: '维度管理', href: currentPath })
        break
      case 'questions':
        breadcrumbs.push({ name: '问题管理', href: currentPath })
        break
      case 'maturity-levels':
        breadcrumbs.push({ name: '成熟度等级', href: currentPath })
        break
      case 'core-strategies':
        breadcrumbs.push({ name: '核心策略', href: currentPath })
        break
      case 'users':
        breadcrumbs.push({ name: '用户管理', href: currentPath })
        break
      case 'assessments':
        breadcrumbs.push({ name: '评估记录', href: currentPath })
        break
      default:
        // 如果是数字ID，尝试获取更友好的名称
        if (/^\d+$/.test(segment)) {
          const prevSegment = segments[i - 1]
          if (prevSegment === 'assessments') {
            breadcrumbs.push({ name: `评估详情` })
          }
        } else {
          breadcrumbs.push({ name: segment })
        }
        break
    }
  }

  return breadcrumbs
}
