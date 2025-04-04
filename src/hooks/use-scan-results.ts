
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScanResult, Port, Vulnerability } from "@/types/scan";

export function useScanResults(scanTargetId?: string) {
  // Fetch the latest scan result for a target
  const {
    data: scanResult,
    isLoading: isLoadingScanResult,
    error: scanResultError,
  } = useQuery({
    queryKey: ["scanResult", scanTargetId],
    queryFn: async () => {
      if (!scanTargetId) return null;

      const { data, error } = await supabase
        .from("scan_results")
        .select("*")
        .eq("scan_target_id", scanTargetId)
        .order("scan_date", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code === "PGRST116") {
        // No results found
        return null;
      }
      
      if (error) throw error;
      return data as ScanResult;
    },
    enabled: !!scanTargetId,
  });

  // Fetch ports for a scan result
  const {
    data: ports,
    isLoading: isLoadingPorts,
    error: portsError,
  } = useQuery({
    queryKey: ["ports", scanResult?.id],
    queryFn: async () => {
      if (!scanResult?.id) return [];

      const { data, error } = await supabase
        .from("ports")
        .select("*")
        .eq("scan_result_id", scanResult.id)
        .order("port_number", { ascending: true });

      if (error) throw error;
      return data as Port[];
    },
    enabled: !!scanResult?.id,
  });

  // Fetch vulnerabilities for a scan result
  const {
    data: vulnerabilities,
    isLoading: isLoadingVulnerabilities,
    error: vulnerabilitiesError,
  } = useQuery({
    queryKey: ["vulnerabilities", scanResult?.id],
    queryFn: async () => {
      if (!scanResult?.id) return [];

      const { data, error } = await supabase
        .from("vulnerability_findings")
        .select("*")
        .eq("scan_result_id", scanResult.id);

      if (error) throw error;
      return data as Vulnerability[];
    },
    enabled: !!scanResult?.id,
  });

  // Helper function to get vulnerabilities for a specific port
  const getVulnerabilitiesForPort = (portId: string) => {
    if (!vulnerabilities) return [];
    return vulnerabilities.filter(v => v.port_id === portId);
  };

  return {
    scanResult,
    isLoadingScanResult,
    scanResultError,
    ports,
    isLoadingPorts,
    portsError,
    vulnerabilities,
    isLoadingVulnerabilities,
    vulnerabilitiesError,
    getVulnerabilitiesForPort,
    isLoading: isLoadingScanResult || isLoadingPorts || isLoadingVulnerabilities,
  };
}
