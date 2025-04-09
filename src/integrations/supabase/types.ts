export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ports: {
        Row: {
          details: string | null
          id: string
          is_open: boolean | null
          port_number: number
          protocol: string | null
          scan_result_id: string
          service: string | null
          version: string | null
        }
        Insert: {
          details?: string | null
          id?: string
          is_open?: boolean | null
          port_number: number
          protocol?: string | null
          scan_result_id: string
          service?: string | null
          version?: string | null
        }
        Update: {
          details?: string | null
          id?: string
          is_open?: boolean | null
          port_number?: number
          protocol?: string | null
          scan_result_id?: string
          service?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ports_scan_result_id_fkey"
            columns: ["scan_result_id"]
            isOneToOne: false
            referencedRelation: "scan_results"
            referencedColumns: ["id"]
          },
        ]
      }
      "ports table": {
        Row: {
          created_at: string
          id: string
          port_number: number | null
          protocol: string | null
          scan_id: string | null
          service: string | null
          state: string | null
          version: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          port_number?: number | null
          protocol?: string | null
          scan_id?: string | null
          service?: string | null
          state?: string | null
          version?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          port_number?: number | null
          protocol?: string | null
          scan_id?: string | null
          service?: string | null
          state?: string | null
          version?: string | null
        }
        Relationships: []
      }
      scan_results: {
        Row: {
          id: string
          open_ports: number | null
          scan_date: string | null
          scan_duration: number | null
          scan_status: string | null
          scan_target_id: string
          total_ports_scanned: number | null
          vulnerabilities_found: number | null
        }
        Insert: {
          id?: string
          open_ports?: number | null
          scan_date?: string | null
          scan_duration?: number | null
          scan_status?: string | null
          scan_target_id: string
          total_ports_scanned?: number | null
          vulnerabilities_found?: number | null
        }
        Update: {
          id?: string
          open_ports?: number | null
          scan_date?: string | null
          scan_duration?: number | null
          scan_status?: string | null
          scan_target_id?: string
          total_ports_scanned?: number | null
          vulnerabilities_found?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scan_results_scan_target_id_fkey"
            columns: ["scan_target_id"]
            isOneToOne: false
            referencedRelation: "scan_targets"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_targets: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          last_scan_at: string | null
          scan_status: string | null
          target: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          last_scan_at?: string | null
          scan_status?: string | null
          target: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          last_scan_at?: string | null
          scan_status?: string | null
          target?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          status: string | null
          target: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          target?: string
          user_id?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          target?: string
          user_id?: string
        }
        Relationships: []
      }
      vulnerabilities: {
        Row: {
          created_at: string | null
          cve_id: string | null
          description: string | null
          id: number
          port_id: string
          severity: string | null
        }
        Insert: {
          created_at?: string | null
          cve_id?: string | null
          description?: string | null
          id?: number
          port_id?: string
          severity?: string | null
        }
        Update: {
          created_at?: string | null
          cve_id?: string | null
          description?: string | null
          id?: number
          port_id?: string
          severity?: string | null
        }
        Relationships: []
      }
      vulnerability_findings: {
        Row: {
          cve_id: string | null
          description: string | null
          id: string
          port_id: string | null
          recommendation: string | null
          scan_result_id: string
          severity: string | null
          title: string
        }
        Insert: {
          cve_id?: string | null
          description?: string | null
          id?: string
          port_id?: string | null
          recommendation?: string | null
          scan_result_id: string
          severity?: string | null
          title: string
        }
        Update: {
          cve_id?: string | null
          description?: string | null
          id?: string
          port_id?: string | null
          recommendation?: string | null
          scan_result_id?: string
          severity?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "vulnerability_findings_port_id_fkey"
            columns: ["port_id"]
            isOneToOne: false
            referencedRelation: "ports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vulnerability_findings_scan_result_id_fkey"
            columns: ["scan_result_id"]
            isOneToOne: false
            referencedRelation: "scan_results"
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
