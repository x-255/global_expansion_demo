'use server'

import { cookies } from 'next/headers'

export async function setCompanyCookie(companyName: string) {
  const cookieStore = await cookies()
  cookieStore.set('companyName', companyName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
}

export async function getCompanyCookie() {
  const cookieStore = await cookies()
  const companyName = cookieStore.get('companyName')
  return companyName?.value
}

export async function removeCompanyCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('companyName')
} 