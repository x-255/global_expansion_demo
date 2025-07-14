'use server'

import { prisma } from '@/lib/prisma'
import type { CompanyAssessment } from '@/generated/prisma/client'

export async function getCompanies() {
  const companies = await prisma.company.findMany({
    orderBy: {
      id: 'asc'
    }
  })
  return companies
}

export async function getCompany(id: number) {
  const company = await prisma.company.findUnique({
    where: {
      id
    }
  })
  return company
}

export async function createCompany(name: string) {
  const company = await prisma.company.create({
    data: {
      name
    }
  })
  return company
}

export async function getCompanyAssessments(companyId: number): Promise<CompanyAssessment[]> {
  const company = await prisma.company.findUnique({
    where: {
      id: companyId
    },
    include: {
      assessments: true
    }
  })
  return company?.assessments || []
} 