
import { ScanResultDetails } from "@/components/scan/ScanResultDetails";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/auth";
import { useScanTargets } from "@/hooks/use-scan-targets";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";

export default function ScanResultsPage() {
  const navigate = useNavigate();
  const { targetId } = useParams<{ targetId: string }>();
  const { scanTargets, isLoadingScanTargets, startScan, isScanning } = useScanTargets();
  const [currentTarget, setCurrentTarget] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/signin");
      return;
    }

    if (!targetId) {
      navigate("/dashboard");
      return;
    }
  }, [navigate, targetId]);

  useEffect(() => {
    if (scanTargets && targetId) {
      const target = scanTargets.find(t => t.id === targetId);
      if (target) {
        setCurrentTarget(target);
      }
    }
  }, [scanTargets, targetId]);

  const handleStartScan = () => {
    if (targetId) {
      startScan.mutate(targetId);
    }
  };

  if (isLoadingScanTargets || !currentTarget) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">{currentTarget.target}</h1>
          {currentTarget.description && (
            <p className="text-muted-foreground mt-1">{currentTarget.description}</p>
          )}
        </div>
        <Button
          onClick={handleStartScan}
          disabled={currentTarget.scan_status === "scanning" || isScanning}
        >
          {isScanning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Run New Scan
            </>
          )}
        </Button>
      </div>

      <ScanResultDetails scanTargetId={targetId} />
    </div>
  );
}
