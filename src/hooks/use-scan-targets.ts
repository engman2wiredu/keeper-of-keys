
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScanTarget } from "@/types/scan";
import { toast } from "@/hooks/use-toast";

export function useScanTargets() {
  const queryClient = useQueryClient();
  const [isScanning, setIsScanning] = useState(false);

  // Fetch all scan targets for the current user
  const {
    data: scanTargets,
    isLoading: isLoadingScanTargets,
    error: scanTargetsError,
    refetch: refetchScanTargets
  } = useQuery({
    queryKey: ["scanTargets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scan_targets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ScanTarget[];
    },
  });

  // Create a new scan target
  const createScanTarget = useMutation({
    mutationFn: async (newTarget: { target: string; description?: string }) => {
      const { data, error } = await supabase
        .from("scan_targets")
        .insert({
          target: newTarget.target,
          description: newTarget.description,
          scan_status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scanTargets"] });
      toast({
        title: "Success",
        description: "Scan target created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create scan target: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete a scan target
  const deleteScanTarget = useMutation({
    mutationFn: async (targetId: string) => {
      const { error } = await supabase
        .from("scan_targets")
        .delete()
        .eq("id", targetId);

      if (error) throw error;
      return targetId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scanTargets"] });
      toast({
        title: "Success",
        description: "Scan target deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete scan target: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Start a scan
  const startScan = useMutation({
    mutationFn: async (targetId: string) => {
      setIsScanning(true);
      
      try {
        // Update the scan status to scanning
        const { error: updateError } = await supabase
          .from("scan_targets")
          .update({ scan_status: "scanning", updated_at: new Date().toISOString() })
          .eq("id", targetId);

        if (updateError) throw updateError;

        // Call the port scanner edge function
        const { data, error } = await supabase.functions.invoke("port-scanner", {
          body: { scanTargetId: targetId },
        });

        if (error) throw error;
        return data;
      } finally {
        setIsScanning(false);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["scanTargets"] });
      queryClient.invalidateQueries({ queryKey: ["scanResults"] });
      toast({
        title: "Scan Completed",
        description: `Found ${data.openPorts} open ports and ${data.vulnerabilitiesFound} vulnerabilities`,
      });
    },
    onError: (error) => {
      toast({
        title: "Scan Failed",
        description: `Failed to complete scan: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    scanTargets,
    isLoadingScanTargets,
    scanTargetsError,
    refetchScanTargets,
    createScanTarget,
    deleteScanTarget,
    startScan,
    isScanning,
  };
}
