// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4'
  }
  public: {
    Tables: {
      asset_events: {
        Row: {
          asset_id: string
          company_id: string
          cost: number | null
          created_at: string
          date: string
          description: string | null
          id: string
          new_locator_id: string | null
          old_locator_id: string | null
          parts_replaced: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          asset_id: string
          company_id: string
          cost?: number | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          new_locator_id?: string | null
          old_locator_id?: string | null
          parts_replaced?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          asset_id?: string
          company_id?: string
          cost?: number | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          new_locator_id?: string | null
          old_locator_id?: string | null
          parts_replaced?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'asset_events_asset_id_fkey'
            columns: ['asset_id']
            isOneToOne: false
            referencedRelation: 'assets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'asset_events_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'asset_events_new_locator_id_fkey'
            columns: ['new_locator_id']
            isOneToOne: false
            referencedRelation: 'locators'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'asset_events_old_locator_id_fkey'
            columns: ['old_locator_id']
            isOneToOne: false
            referencedRelation: 'locators'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'asset_events_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      assets: {
        Row: {
          brand_id: string | null
          category_id: string | null
          company_id: string
          contract_id: string | null
          created_at: string
          description: string | null
          id: string
          identifier: string | null
          locator_id: string | null
          min_stock: number | null
          model: string | null
          name: string | null
          patrimony: string | null
          price: number | null
          product_id: string | null
          serial: string | null
          sku: string | null
          status: string | null
          stock: number | null
          type: string | null
          updated_at: string
        }
        Insert: {
          brand_id?: string | null
          category_id?: string | null
          company_id: string
          contract_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          identifier?: string | null
          locator_id?: string | null
          min_stock?: number | null
          model?: string | null
          name?: string | null
          patrimony?: string | null
          price?: number | null
          product_id?: string | null
          serial?: string | null
          sku?: string | null
          status?: string | null
          stock?: number | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          brand_id?: string | null
          category_id?: string | null
          company_id?: string
          contract_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          identifier?: string | null
          locator_id?: string | null
          min_stock?: number | null
          model?: string | null
          name?: string | null
          patrimony?: string | null
          price?: number | null
          product_id?: string | null
          serial?: string | null
          sku?: string | null
          status?: string | null
          stock?: number | null
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'assets_brand_id_fkey'
            columns: ['brand_id']
            isOneToOne: false
            referencedRelation: 'brands'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'assets_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'assets_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'assets_contract_id_fkey'
            columns: ['contract_id']
            isOneToOne: false
            referencedRelation: 'contracts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'assets_locator_id_fkey'
            columns: ['locator_id']
            isOneToOne: false
            referencedRelation: 'locators'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'assets_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      brands: {
        Row: {
          company_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'brands_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
        ]
      }
      categories: {
        Row: {
          company_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'categories_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
        ]
      }
      companies: {
        Row: {
          configuration: Json | null
          contact_email: string | null
          created_at: string
          id: string
          legal_identifier: string | null
          name: string
          updated_at: string
        }
        Insert: {
          configuration?: Json | null
          contact_email?: string | null
          created_at?: string
          id?: string
          legal_identifier?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          configuration?: Json | null
          contact_email?: string | null
          created_at?: string
          id?: string
          legal_identifier?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_memberships: {
        Row: {
          company_id: string
          created_at: string
          group_id: string | null
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          group_id?: string | null
          id?: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          group_id?: string | null
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'company_memberships_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'company_memberships_group_id_fkey'
            columns: ['group_id']
            isOneToOne: false
            referencedRelation: 'groups'
            referencedColumns: ['id']
          },
        ]
      }
      contracts: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          identifier: string | null
          registration_date: string | null
          renewal_after: boolean | null
          renewal_within: boolean | null
          start_date: string | null
          supplier_id: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          identifier?: string | null
          registration_date?: string | null
          renewal_after?: boolean | null
          renewal_within?: boolean | null
          start_date?: string | null
          supplier_id: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          identifier?: string | null
          registration_date?: string | null
          renewal_after?: boolean | null
          renewal_within?: boolean | null
          start_date?: string | null
          supplier_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'contracts_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'contracts_supplier_id_fkey'
            columns: ['supplier_id']
            isOneToOne: false
            referencedRelation: 'suppliers'
            referencedColumns: ['id']
          },
        ]
      }
      groups: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          permissions: Json | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          permissions?: Json | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          permissions?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'groups_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
        ]
      }
      locators: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'locators_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
        ]
      }
      maintenances: {
        Row: {
          asset_id: string | null
          company_id: string
          created_at: string
          date: string | null
          description: string | null
          email_sent: boolean | null
          end_date: string | null
          forecast_date: string | null
          id: string
          is_warranty: boolean | null
          order_date: string | null
          origin: string | null
          priority: string | null
          start_date: string | null
          status: string | null
          supplier_id: string | null
          technician: string | null
          technician_id: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          asset_id?: string | null
          company_id: string
          created_at?: string
          date?: string | null
          description?: string | null
          email_sent?: boolean | null
          end_date?: string | null
          forecast_date?: string | null
          id?: string
          is_warranty?: boolean | null
          order_date?: string | null
          origin?: string | null
          priority?: string | null
          start_date?: string | null
          status?: string | null
          supplier_id?: string | null
          technician?: string | null
          technician_id?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          asset_id?: string | null
          company_id?: string
          created_at?: string
          date?: string | null
          description?: string | null
          email_sent?: boolean | null
          end_date?: string | null
          forecast_date?: string | null
          id?: string
          is_warranty?: boolean | null
          order_date?: string | null
          origin?: string | null
          priority?: string | null
          start_date?: string | null
          status?: string | null
          supplier_id?: string | null
          technician?: string | null
          technician_id?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'maintenances_asset_id_fkey'
            columns: ['asset_id']
            isOneToOne: false
            referencedRelation: 'assets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'maintenances_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'maintenances_supplier_id_fkey'
            columns: ['supplier_id']
            isOneToOne: false
            referencedRelation: 'suppliers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'maintenances_technician_id_fkey'
            columns: ['technician_id']
            isOneToOne: false
            referencedRelation: 'technicians'
            referencedColumns: ['id']
          },
        ]
      }
      products: {
        Row: {
          brand_id: string | null
          category_id: string | null
          company_id: string
          created_at: string
          description: string | null
          id: string
          min_stock: number | null
          model: string | null
          name: string
          price: number | null
          sku: string | null
          specification: string | null
          stock: number | null
          type: string | null
          updated_at: string
        }
        Insert: {
          brand_id?: string | null
          category_id?: string | null
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          min_stock?: number | null
          model?: string | null
          name: string
          price?: number | null
          sku?: string | null
          specification?: string | null
          stock?: number | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          brand_id?: string | null
          category_id?: string | null
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          min_stock?: number | null
          model?: string | null
          name?: string
          price?: number | null
          sku?: string | null
          specification?: string | null
          stock?: number | null
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'products_brand_id_fkey'
            columns: ['brand_id']
            isOneToOne: false
            referencedRelation: 'brands'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'products_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'products_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          is_super_admin: boolean
          name: string
          phone: string | null
          status: string | null
          two_factor_enabled: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          is_super_admin?: boolean
          name: string
          phone?: string | null
          status?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_super_admin?: boolean
          name?: string
          phone?: string | null
          status?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          company_id: string
          created_at: string
          id: string
          plan_name: string | null
          status: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          plan_name?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          plan_name?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'subscriptions_company_id_fkey'
            columns: ['company_id']
            isOneToOne: true
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
        ]
      }
      suppliers: {
        Row: {
          company_id: string
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          company_id: string
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          company_id?: string
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'suppliers_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
        ]
      }
      technicians: {
        Row: {
          company_id: string
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          specialty: string | null
          status: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          specialty?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          specialty?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'technicians_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
        ]
      }
      warranties: {
        Row: {
          asset_id: string | null
          company_id: string
          created_at: string
          end_date: string | null
          id: string
          provider: string | null
          start_date: string | null
          status: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          asset_id?: string | null
          company_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          provider?: string | null
          start_date?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          asset_id?: string | null
          company_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          provider?: string | null
          start_date?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'warranties_asset_id_fkey'
            columns: ['asset_id']
            isOneToOne: false
            referencedRelation: 'assets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'warranties_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
        ]
      }
      warranty_suppliers: {
        Row: {
          created_at: string
          id: string
          supplier_id: string
          warranty_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          supplier_id: string
          warranty_id: string
        }
        Update: {
          created_at?: string
          id?: string
          supplier_id?: string
          warranty_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'warranty_suppliers_supplier_id_fkey'
            columns: ['supplier_id']
            isOneToOne: false
            referencedRelation: 'suppliers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'warranty_suppliers_warranty_id_fkey'
            columns: ['warranty_id']
            isOneToOne: false
            referencedRelation: 'warranties'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_company_ids: { Args: never; Returns: string[] }
      get_user_company_ids: { Args: never; Returns: string[] }
      is_super_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: asset_events
//   id: uuid (not null, default: gen_random_uuid())
//   company_id: uuid (not null)
//   asset_id: uuid (not null)
//   user_id: uuid (nullable)
//   type: text (not null)
//   date: timestamp with time zone (not null, default: now())
//   description: text (nullable)
//   old_locator_id: uuid (nullable)
//   new_locator_id: uuid (nullable)
//   parts_replaced: text (nullable)
//   cost: numeric (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: assets
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (nullable)
//   description: text (nullable)
//   category_id: uuid (nullable)
//   company_id: uuid (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   sku: text (nullable)
//   patrimony: text (nullable)
//   locator_id: uuid (nullable)
//   serial: text (nullable)
//   status: text (nullable, default: 'Operacional'::text)
//   stock: integer (nullable, default: 0)
//   min_stock: integer (nullable, default: 0)
//   price: numeric (nullable, default: 0)
//   type: text (nullable, default: 'asset'::text)
//   identifier: text (nullable)
//   model: text (nullable)
//   brand_id: uuid (nullable)
//   product_id: uuid (nullable)
//   contract_id: uuid (nullable)
// Table: brands
//   id: uuid (not null, default: gen_random_uuid())
//   company_id: uuid (not null)
//   name: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: categories
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   company_id: uuid (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: companies
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   legal_identifier: text (nullable)
//   contact_email: text (nullable)
//   configuration: jsonb (nullable, default: '{}'::jsonb)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: company_memberships
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   company_id: uuid (not null)
//   role: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   group_id: uuid (nullable)
// Table: contracts
//   id: uuid (not null, default: gen_random_uuid())
//   company_id: uuid (not null)
//   supplier_id: uuid (not null)
//   registration_date: date (nullable)
//   start_date: date (nullable)
//   end_date: date (nullable)
//   renewal_within: boolean (nullable, default: false)
//   renewal_after: boolean (nullable, default: false)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   identifier: text (nullable)
//   description: text (nullable)
// Table: groups
//   id: uuid (not null, default: gen_random_uuid())
//   company_id: uuid (not null)
//   name: text (not null)
//   description: text (nullable)
//   permissions: jsonb (nullable, default: '{}'::jsonb)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: locators
//   id: uuid (not null, default: gen_random_uuid())
//   company_id: uuid (not null)
//   name: text (not null)
//   description: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: maintenances
//   id: uuid (not null, default: gen_random_uuid())
//   company_id: uuid (not null)
//   asset_id: uuid (nullable)
//   type: text (nullable)
//   date: date (nullable)
//   status: text (nullable, default: 'Pendente'::text)
//   technician: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   description: text (nullable)
//   priority: text (nullable, default: 'Média'::text)
//   origin: text (nullable, default: 'Manual'::text)
//   order_date: date (nullable)
//   email_sent: boolean (nullable, default: false)
//   start_date: date (nullable)
//   end_date: date (nullable)
//   forecast_date: date (nullable)
//   supplier_id: uuid (nullable)
//   is_warranty: boolean (nullable, default: false)
//   technician_id: uuid (nullable)
// Table: products
//   id: uuid (not null, default: gen_random_uuid())
//   company_id: uuid (not null)
//   name: text (not null)
//   description: text (nullable)
//   type: text (nullable, default: 'equipment'::text)
//   category_id: uuid (nullable)
//   brand_id: uuid (nullable)
//   model: text (nullable)
//   sku: text (nullable)
//   price: numeric (nullable, default: 0)
//   stock: integer (nullable, default: 0)
//   min_stock: integer (nullable, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   specification: text (nullable)
// Table: profiles
//   id: uuid (not null)
//   name: text (not null)
//   email: text (not null)
//   is_super_admin: boolean (not null, default: false)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   phone: text (nullable)
//   two_factor_enabled: boolean (nullable, default: false)
//   status: text (nullable, default: 'Ativo'::text)
// Table: subscriptions
//   id: uuid (not null, default: gen_random_uuid())
//   company_id: uuid (not null)
//   status: text (not null)
//   plan_name: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: suppliers
//   id: uuid (not null, default: gen_random_uuid())
//   company_id: uuid (not null)
//   name: text (not null)
//   contact_name: text (nullable)
//   email: text (nullable)
//   phone: text (nullable)
//   whatsapp: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: technicians
//   id: uuid (not null, default: gen_random_uuid())
//   company_id: uuid (not null)
//   name: text (not null)
//   email: text (nullable)
//   phone: text (nullable)
//   type: text (nullable, default: 'Interno'::text)
//   specialty: text (nullable)
//   status: text (nullable, default: 'Ativo'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: warranties
//   id: uuid (not null, default: gen_random_uuid())
//   company_id: uuid (not null)
//   asset_id: uuid (nullable)
//   type: text (nullable)
//   provider: text (nullable)
//   start_date: date (nullable)
//   end_date: date (nullable)
//   status: text (nullable, default: 'Ativa'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: warranty_suppliers
//   id: uuid (not null, default: gen_random_uuid())
//   warranty_id: uuid (not null)
//   supplier_id: uuid (not null)
//   created_at: timestamp with time zone (not null, default: now())

// --- CONSTRAINTS ---
// Table: asset_events
//   FOREIGN KEY asset_events_asset_id_fkey: FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
//   FOREIGN KEY asset_events_company_id_fkey: FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
//   FOREIGN KEY asset_events_new_locator_id_fkey: FOREIGN KEY (new_locator_id) REFERENCES locators(id) ON DELETE SET NULL
//   FOREIGN KEY asset_events_old_locator_id_fkey: FOREIGN KEY (old_locator_id) REFERENCES locators(id) ON DELETE SET NULL
//   PRIMARY KEY asset_events_pkey: PRIMARY KEY (id)
//   FOREIGN KEY asset_events_user_id_fkey: FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL
// Table: assets
//   FOREIGN KEY assets_brand_id_fkey: FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL
//   FOREIGN KEY assets_category_id_fkey: FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
//   FOREIGN KEY assets_company_id_fkey: FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
//   FOREIGN KEY assets_contract_id_fkey: FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE SET NULL
//   FOREIGN KEY assets_locator_id_fkey: FOREIGN KEY (locator_id) REFERENCES locators(id) ON DELETE SET NULL
//   PRIMARY KEY assets_pkey: PRIMARY KEY (id)
//   FOREIGN KEY assets_product_id_fkey: FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
// Table: brands
//   FOREIGN KEY brands_company_id_fkey: FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
//   PRIMARY KEY brands_pkey: PRIMARY KEY (id)
// Table: categories
//   FOREIGN KEY categories_company_id_fkey: FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
//   PRIMARY KEY categories_pkey: PRIMARY KEY (id)
// Table: companies
//   PRIMARY KEY companies_pkey: PRIMARY KEY (id)
// Table: company_memberships
//   FOREIGN KEY company_memberships_company_id_fkey: FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
//   FOREIGN KEY company_memberships_group_id_fkey: FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
//   PRIMARY KEY company_memberships_pkey: PRIMARY KEY (id)
//   CHECK company_memberships_role_check: CHECK ((role = ANY (ARRAY['Admin'::text, 'Manager'::text, 'Member'::text])))
//   UNIQUE company_memberships_user_id_company_id_key: UNIQUE (user_id, company_id)
//   FOREIGN KEY company_memberships_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: contracts
//   FOREIGN KEY contracts_company_id_fkey: FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
//   PRIMARY KEY contracts_pkey: PRIMARY KEY (id)
//   FOREIGN KEY contracts_supplier_id_fkey: FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
// Table: groups
//   FOREIGN KEY groups_company_id_fkey: FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
//   PRIMARY KEY groups_pkey: PRIMARY KEY (id)
// Table: locators
//   FOREIGN KEY locators_company_id_fkey: FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
//   PRIMARY KEY locators_pkey: PRIMARY KEY (id)
// Table: maintenances
//   FOREIGN KEY maintenances_asset_id_fkey: FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
//   FOREIGN KEY maintenances_company_id_fkey: FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
//   PRIMARY KEY maintenances_pkey: PRIMARY KEY (id)
//   FOREIGN KEY maintenances_supplier_id_fkey: FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
//   FOREIGN KEY maintenances_technician_id_fkey: FOREIGN KEY (technician_id) REFERENCES technicians(id) ON DELETE SET NULL
// Table: products
//   FOREIGN KEY products_brand_id_fkey: FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL
//   FOREIGN KEY products_category_id_fkey: FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
//   FOREIGN KEY products_company_id_fkey: FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
//   PRIMARY KEY products_pkey: PRIMARY KEY (id)
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
// Table: subscriptions
//   FOREIGN KEY subscriptions_company_id_fkey: FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
//   UNIQUE subscriptions_company_id_key: UNIQUE (company_id)
//   PRIMARY KEY subscriptions_pkey: PRIMARY KEY (id)
//   CHECK subscriptions_status_check: CHECK ((status = ANY (ARRAY['Active'::text, 'Inactive'::text, 'Suspended'::text, 'Trial'::text, 'Pending Payment'::text])))
// Table: suppliers
//   FOREIGN KEY suppliers_company_id_fkey: FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
//   PRIMARY KEY suppliers_pkey: PRIMARY KEY (id)
// Table: technicians
//   FOREIGN KEY technicians_company_id_fkey: FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
//   PRIMARY KEY technicians_pkey: PRIMARY KEY (id)
// Table: warranties
//   FOREIGN KEY warranties_asset_id_fkey: FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
//   FOREIGN KEY warranties_company_id_fkey: FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
//   PRIMARY KEY warranties_pkey: PRIMARY KEY (id)
// Table: warranty_suppliers
//   PRIMARY KEY warranty_suppliers_pkey: PRIMARY KEY (id)
//   FOREIGN KEY warranty_suppliers_supplier_id_fkey: FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
//   FOREIGN KEY warranty_suppliers_warranty_id_fkey: FOREIGN KEY (warranty_id) REFERENCES warranties(id) ON DELETE CASCADE
//   UNIQUE warranty_suppliers_warranty_id_supplier_id_key: UNIQUE (warranty_id, supplier_id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: asset_events
//   Policy "asset_events_policy" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM company_memberships cm   WHERE ((cm.company_id = asset_events.company_id) AND (cm.user_id = auth.uid()))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM company_memberships cm   WHERE ((cm.company_id = asset_events.company_id) AND (cm.user_id = auth.uid()))))
// Table: assets
//   Policy "Super admins can do all on assets" (ALL, PERMISSIVE) roles={public}
//     USING: is_super_admin()
//   Policy "Users can do all on assets in their companies" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = assets.company_id) AND (company_memberships.user_id = auth.uid()))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = assets.company_id) AND (company_memberships.user_id = auth.uid()))))
// Table: brands
//   Policy "Super admins can do all on brands" (ALL, PERMISSIVE) roles={public}
//     USING: is_super_admin()
//   Policy "Users can do all on brands in their companies" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = brands.company_id) AND (company_memberships.user_id = auth.uid()))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = brands.company_id) AND (company_memberships.user_id = auth.uid()))))
// Table: categories
//   Policy "Super admins can do all on categories" (ALL, PERMISSIVE) roles={public}
//     USING: is_super_admin()
//   Policy "Users can do all on categories in their companies" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = categories.company_id) AND (company_memberships.user_id = auth.uid()))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = categories.company_id) AND (company_memberships.user_id = auth.uid()))))
// Table: companies
//   Policy "Super admins can do all on companies" (ALL, PERMISSIVE) roles={public}
//     USING: is_super_admin()
//   Policy "Users can view companies they belong to" (SELECT, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = companies.id) AND (company_memberships.user_id = auth.uid()))))
// Table: company_memberships
//   Policy "Company admins can manage memberships" (ALL, PERMISSIVE) roles={public}
//     USING: (company_id IN ( SELECT get_admin_company_ids() AS get_admin_company_ids))
//     WITH CHECK: (company_id IN ( SELECT get_admin_company_ids() AS get_admin_company_ids))
//   Policy "Super admins can do all on memberships" (ALL, PERMISSIVE) roles={public}
//     USING: is_super_admin()
//   Policy "Users can view memberships of their companies" (SELECT, PERMISSIVE) roles={public}
//     USING: (company_id IN ( SELECT get_user_company_ids() AS get_user_company_ids))
// Table: contracts
//   Policy "contracts_policy" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = contracts.company_id) AND (company_memberships.user_id = auth.uid()))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = contracts.company_id) AND (company_memberships.user_id = auth.uid()))))
// Table: groups
//   Policy "groups_policy" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = groups.company_id) AND (company_memberships.user_id = auth.uid()))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = groups.company_id) AND (company_memberships.user_id = auth.uid()))))
// Table: locators
//   Policy "locators_policy" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = locators.company_id) AND (company_memberships.user_id = auth.uid()))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = locators.company_id) AND (company_memberships.user_id = auth.uid()))))
// Table: maintenances
//   Policy "maintenances_policy" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = maintenances.company_id) AND (company_memberships.user_id = auth.uid()))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = maintenances.company_id) AND (company_memberships.user_id = auth.uid()))))
// Table: products
//   Policy "products_policy" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = products.company_id) AND (company_memberships.user_id = auth.uid()))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = products.company_id) AND (company_memberships.user_id = auth.uid()))))
// Table: profiles
//   Policy "Super admins can do all on profiles" (ALL, PERMISSIVE) roles={public}
//     USING: is_super_admin()
//   Policy "Users can update their own profile" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (id = auth.uid())
//     WITH CHECK: (id = auth.uid())
//   Policy "Users can view profiles in same company" (SELECT, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM (company_memberships cm1      JOIN company_memberships cm2 ON ((cm1.company_id = cm2.company_id)))   WHERE ((cm1.user_id = auth.uid()) AND (cm2.user_id = profiles.id))))
//   Policy "Users can view their own profile" (SELECT, PERMISSIVE) roles={public}
//     USING: (id = auth.uid())
// Table: subscriptions
//   Policy "Super admins can do all on subscriptions" (ALL, PERMISSIVE) roles={public}
//     USING: is_super_admin()
//   Policy "Users can view their company subscriptions" (SELECT, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = subscriptions.company_id) AND (company_memberships.user_id = auth.uid()))))
// Table: suppliers
//   Policy "suppliers_policy" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = suppliers.company_id) AND (company_memberships.user_id = auth.uid()))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = suppliers.company_id) AND (company_memberships.user_id = auth.uid()))))
// Table: technicians
//   Policy "technicians_policy" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM company_memberships cm   WHERE ((cm.company_id = technicians.company_id) AND (cm.user_id = auth.uid()))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM company_memberships cm   WHERE ((cm.company_id = technicians.company_id) AND (cm.user_id = auth.uid()))))
// Table: warranties
//   Policy "warranties_policy" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = warranties.company_id) AND (company_memberships.user_id = auth.uid()))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = warranties.company_id) AND (company_memberships.user_id = auth.uid()))))
// Table: warranty_suppliers
//   Policy "warranty_suppliers_policy" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM (warranties w      JOIN company_memberships cm ON ((cm.company_id = w.company_id)))   WHERE ((w.id = warranty_suppliers.warranty_id) AND (cm.user_id = auth.uid()))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM (warranties w      JOIN company_memberships cm ON ((cm.company_id = w.company_id)))   WHERE ((w.id = warranty_suppliers.warranty_id) AND (cm.user_id = auth.uid()))))

// --- DATABASE FUNCTIONS ---
// FUNCTION get_admin_company_ids()
//   CREATE OR REPLACE FUNCTION public.get_admin_company_ids()
//    RETURNS SETOF uuid
//    LANGUAGE sql
//    SECURITY DEFINER
//   AS $function$
//     SELECT company_id FROM public.company_memberships WHERE user_id = auth.uid() AND role = 'Admin';
//   $function$
//
// FUNCTION get_user_company_ids()
//   CREATE OR REPLACE FUNCTION public.get_user_company_ids()
//    RETURNS SETOF uuid
//    LANGUAGE sql
//    SECURITY DEFINER
//   AS $function$
//     SELECT company_id FROM public.company_memberships WHERE user_id = auth.uid();
//   $function$
//
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.profiles (id, name, email, is_super_admin)
//     VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'), NEW.email, false);
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION is_super_admin()
//   CREATE OR REPLACE FUNCTION public.is_super_admin()
//    RETURNS boolean
//    LANGUAGE sql
//    SECURITY DEFINER
//   AS $function$
//     SELECT COALESCE(
//       (SELECT is_super_admin FROM public.profiles WHERE id = auth.uid()),
//       false
//     );
//   $function$
//

// --- INDEXES ---
// Table: assets
//   CREATE INDEX idx_assets_contract_id ON public.assets USING btree (contract_id)
// Table: company_memberships
//   CREATE UNIQUE INDEX company_memberships_user_id_company_id_key ON public.company_memberships USING btree (user_id, company_id)
// Table: subscriptions
//   CREATE UNIQUE INDEX subscriptions_company_id_key ON public.subscriptions USING btree (company_id)
// Table: warranty_suppliers
//   CREATE UNIQUE INDEX warranty_suppliers_warranty_id_supplier_id_key ON public.warranty_suppliers USING btree (warranty_id, supplier_id)
