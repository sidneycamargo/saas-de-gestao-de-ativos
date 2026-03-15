import React, { createContext, useContext, useState, ReactNode } from 'react'
import { companies } from '@/lib/mock-data'

interface Company {
  id: string
  name: string
  logo: string
}

interface CompanyStore {
  activeCompanyId: string
  setActiveCompanyId: (id: string) => void
  activeCompany: Company | undefined
}

const CompanyContext = createContext<CompanyStore | undefined>(undefined)

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [activeCompanyId, setActiveCompanyId] = useState<string>(companies[0]?.id || '')
  const activeCompany = companies.find((c) => c.id === activeCompanyId)

  return (
    <CompanyContext.Provider value={{ activeCompanyId, setActiveCompanyId, activeCompany }}>
      {children}
    </CompanyContext.Provider>
  )
}

export default function useCompanyStore() {
  const context = useContext(CompanyContext)
  if (!context) {
    throw new Error('useCompanyStore must be used within CompanyProvider')
  }
  return context
}
