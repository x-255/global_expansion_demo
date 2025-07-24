import { useEffect, useState, useCallback } from 'react'
import { getCompany } from '../../actions'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default function AssessmentHeader({ params }: Props) {
  const [companyName, setCompanyName] = useState<string>('')

  const init = useCallback(async () => {
    const { id } = await params
    const company = await getCompany(+id)
    if (company) {
      setCompanyName(company.name)
    }
  }, [params])

  useEffect(() => {
    init()
  }, [init])

  return <div className="mb-0 px-4 text-2xl font-bold">{companyName}</div>
}
