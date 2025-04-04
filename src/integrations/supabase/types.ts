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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
