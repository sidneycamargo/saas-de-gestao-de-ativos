// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
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
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_memberships_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
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
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          is_super_admin?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_super_admin?: boolean
          name?: string
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
            foreignKeyName: "subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
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
// Table: profiles
//   id: uuid (not null)
//   name: text (not null)
//   email: text (not null)
//   is_super_admin: boolean (not null, default: false)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: subscriptions
//   id: uuid (not null, default: gen_random_uuid())
//   company_id: uuid (not null)
//   status: text (not null)
//   plan_name: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())

// --- CONSTRAINTS ---
// Table: companies
//   PRIMARY KEY companies_pkey: PRIMARY KEY (id)
// Table: company_memberships
//   FOREIGN KEY company_memberships_company_id_fkey: FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
//   PRIMARY KEY company_memberships_pkey: PRIMARY KEY (id)
//   CHECK company_memberships_role_check: CHECK ((role = ANY (ARRAY['Admin'::text, 'Member'::text])))
//   UNIQUE company_memberships_user_id_company_id_key: UNIQUE (user_id, company_id)
//   FOREIGN KEY company_memberships_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
// Table: subscriptions
//   FOREIGN KEY subscriptions_company_id_fkey: FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
//   UNIQUE subscriptions_company_id_key: UNIQUE (company_id)
//   PRIMARY KEY subscriptions_pkey: PRIMARY KEY (id)
//   CHECK subscriptions_status_check: CHECK ((status = ANY (ARRAY['Active'::text, 'Inactive'::text, 'Suspended'::text, 'Trial'::text, 'Pending Payment'::text])))

// --- ROW LEVEL SECURITY POLICIES ---
// Table: companies
//   Policy "Super admins can do all on companies" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.is_super_admin = true))))
//   Policy "Users can view companies they belong to" (SELECT, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = companies.id) AND (company_memberships.user_id = auth.uid()))))
// Table: company_memberships
//   Policy "Super admins can do all on memberships" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.is_super_admin = true))))
//   Policy "Users can view memberships of their companies" (SELECT, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM company_memberships my_cm   WHERE ((my_cm.company_id = company_memberships.company_id) AND (my_cm.user_id = auth.uid()))))
// Table: profiles
//   Policy "Super admins can do all on profiles" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles profiles_1   WHERE ((profiles_1.id = auth.uid()) AND (profiles_1.is_super_admin = true))))
//   Policy "Users can view profiles in same company" (SELECT, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM (company_memberships cm1      JOIN company_memberships cm2 ON ((cm1.company_id = cm2.company_id)))   WHERE ((cm1.user_id = auth.uid()) AND (cm2.user_id = profiles.id))))
//   Policy "Users can view their own profile" (SELECT, PERMISSIVE) roles={public}
//     USING: (id = auth.uid())
// Table: subscriptions
//   Policy "Super admins can do all on subscriptions" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.is_super_admin = true))))
//   Policy "Users can view their company subscriptions" (SELECT, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM company_memberships   WHERE ((company_memberships.company_id = subscriptions.company_id) AND (company_memberships.user_id = auth.uid()))))

// --- DATABASE FUNCTIONS ---
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

// --- INDEXES ---
// Table: company_memberships
//   CREATE UNIQUE INDEX company_memberships_user_id_company_id_key ON public.company_memberships USING btree (user_id, company_id)
// Table: subscriptions
//   CREATE UNIQUE INDEX subscriptions_company_id_key ON public.subscriptions USING btree (company_id)

