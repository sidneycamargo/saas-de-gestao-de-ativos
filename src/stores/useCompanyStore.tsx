import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

export interface Company {
  id: string
  name: string
  legal_identifier?: string
  contact_email?: string
  subscriptions?: { status: string; plan_name?: string }[]
}

interface CompanyStore {
  activeCompanyId: string
  setActiveCompanyId: (id: string) => void
  companies: Company[]
  activeCompany: Company | undefined
  loading: boolean
  refreshCompanies: () => Promise<void>
}

const CompanyContext = createContext<CompanyStore | undefined>(undefined)

export function CompanyProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth()
  const [companies, setCompanies] = useState<Company[]>([])
  const [activeCompanyId, setActiveCompanyId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  const fetchCompanies = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('companies')
      .select('*, subscriptions(*)')
      .order('name')

    if (data && data.length > 0) {
      setCompanies(data)
      if (!activeCompanyId || !data.find((c) => c.id === activeCompanyId)) {
        setActiveCompanyId(data[0].id)
      }
    } else {
      setCompanies([])
      setActiveCompanyId('')
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!session?.user) {
      setCompanies([])
      setActiveCompanyId('')
      setLoading(false)
      return
    }
    fetchCompanies()
  }, [session])

  const activeCompany = companies.find((c) => c.id === activeCompanyId)

  return (
    <CompanyContext.Provider
      value={{
        activeCompanyId,
        setActiveCompanyId,
        activeCompany,
        companies,
        loading,
        refreshCompanies: fetchCompanies,
      }}
    >
      {children}
    </CompanyContext.Provider>
  )
}

export default function useCompanyStore() {
  const context = useContext(CompanyContext)
  if (!context) throw new Error('useCompanyStore must be used within CompanyProvider')
  return context
}
