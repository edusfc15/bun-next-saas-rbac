import { redirect } from 'next/navigation'
import { isAuthenticated } from '../auth/auth/auth'
import { Header } from '@/components/header'

export default async function AppLayout({
  children,
  sheet,
}: Readonly<{
  children: React.ReactNode
  sheet: React.ReactNode
}>) {
  if (await !isAuthenticated()) {
    redirect('/auth/sign-in')
  }

  return (
    <>
      {children}
      {sheet}
    </>
  )
}
