
export interface ScanTarget {
  id: string;
  user_id: string;
  target: string;
  description?: string;
  scan_status: 'pending' | 'scanning' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  last_scan_at?: string;
}

export interface ScanResult {
  id: string;
  scan_target_id: string;
  scan_date: string;
  total_ports_scanned: number;
  open_ports: number;
  vulnerabilities_found: number;
  scan_status: 'completed' | 'failed';
  scan_duration: number;
}

export interface Port {
  id: string;
  scan_result_id: string;
  port_number: number;
  protocol: string;
  service?: string;
  is_open: boolean;
  version?: string;
  details?: string;
}

export interface Vulnerability {
  id: string;
  port_id?: string;
  scan_result_id: string;
  cve_id?: string;
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
  title: string;
  description?: string;
  recommendation?: string;
}
