
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useScanTargets } from "@/hooks/use-scan-targets";
import { Loader2, Play, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export function ScanTargetList() {
  const { 
    scanTargets, 
    isLoadingScanTargets, 
    startScan, 
    deleteScanTarget,
    isScanning
  } = useScanTargets();
  const navigate = useNavigate();

  if (isLoadingScanTargets) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!scanTargets || scanTargets.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="text-center py-4">
            <p className="text-muted-foreground">No scan targets found. Add your first target to start scanning.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Your Scan Targets</CardTitle>
        <CardDescription>Manage and run scans on your targets</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Target</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Scan</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scanTargets.map((target) => (
              <TableRow key={target.id} onClick={() => navigate(`/scan-results/${target.id}`)} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{target.target}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {target.description || "—"}
                </TableCell>
                <TableCell>
                  <ScanStatusBadge status={target.scan_status} />
                </TableCell>
                <TableCell>
                  {target.last_scan_at 
                    ? format(new Date(target.last_scan_at), "PPp") 
                    : "Never"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={target.scan_status === "scanning" || isScanning}
                      onClick={() => startScan.mutate(target.id)}
                    >
                      {startScan.isPending && startScan.variables === target.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => deleteScanTarget.mutate(target.id)}
                      disabled={deleteScanTarget.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ScanStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "pending":
      return <Badge variant="outline">Pending</Badge>;
    case "scanning":
      return <Badge variant="secondary">Scanning</Badge>;
    case "completed":
      return <Badge variant="success">Completed</Badge>;
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
