
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useScanResults } from "@/hooks/use-scan-results";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown, ChevronRight, AlertTriangle, Shield } from "lucide-react";
import { format } from "date-fns";

export function ScanResultDetails({ scanTargetId }: { scanTargetId: string }) {
  const {
    scanResult,
    ports,
    isLoading,
    getVulnerabilitiesForPort,
  } = useScanResults(scanTargetId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!scanResult) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-4">
            <p className="text-muted-foreground">No scan results found for this target. Run a scan to see results.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const openPorts = ports?.filter(port => port.is_open) || [];
  const closedPorts = ports?.filter(port => !port.is_open) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scan Summary</CardTitle>
          <CardDescription>
            Scan completed on {format(new Date(scanResult.scan_date), "PPpp")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard 
              title="Duration" 
              value={`${scanResult.scan_duration} sec`} 
              icon={<Shield className="h-5 w-5" />}
            />
            <StatCard 
              title="Total Ports" 
              value={scanResult.total_ports_scanned.toString()} 
              icon={<Shield className="h-5 w-5" />}
            />
            <StatCard 
              title="Open Ports" 
              value={scanResult.open_ports.toString()} 
              icon={<Shield className="h-5 w-5 text-orange-500" />}
            />
            <StatCard 
              title="Vulnerabilities" 
              value={scanResult.vulnerabilities_found.toString()} 
              icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
            />
          </div>
        </CardContent>
      </Card>

      {openPorts.length > 0 && (
        <PortsTable 
          title="Open Ports" 
          description="Ports that are open and potentially accessible"
          ports={openPorts}
          getVulnerabilitiesForPort={getVulnerabilitiesForPort}
        />
      )}

      {closedPorts.length > 0 && (
        <PortsTable 
          title="Closed Ports" 
          description="Ports that are closed or filtered"
          ports={closedPorts}
          showVulnerabilities={false}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-muted/50 p-4 rounded-lg flex flex-col">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon}
        <span>{title}</span>
      </div>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}

function PortsTable({ 
  title, 
  description, 
  ports, 
  showVulnerabilities = true,
  getVulnerabilitiesForPort 
}: { 
  title: string; 
  description: string; 
  ports: any[]; 
  showVulnerabilities?: boolean;
  getVulnerabilitiesForPort?: (portId: string) => any[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Port</TableHead>
              <TableHead>Protocol</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Version</TableHead>
              {showVulnerabilities && <TableHead>Vulnerabilities</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {ports.map((port) => {
              const vulnerabilities = getVulnerabilitiesForPort?.(port.id) || [];
              
              return (
                <React.Fragment key={port.id}>
                  <TableRow>
                    <TableCell>{port.port_number}</TableCell>
                    <TableCell>{port.protocol}</TableCell>
                    <TableCell>{port.service || "—"}</TableCell>
                    <TableCell>{port.version || "—"}</TableCell>
                    {showVulnerabilities && (
                      <TableCell>
                        {vulnerabilities.length > 0 ? (
                          <Collapsible>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{vulnerabilities.length}</Badge>
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent>
                              <div className="mt-2 space-y-3">
                                {vulnerabilities.map((vuln) => (
                                  <VulnerabilityCard key={vuln.id} vulnerability={vuln} />
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        ) : (
                          "None found"
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function VulnerabilityCard({ vulnerability }: { vulnerability: any }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold">{vulnerability.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{vulnerability.cve_id || "No CVE"}</p>
          </div>
          <SeverityBadge severity={vulnerability.severity} />
        </div>
        <p className="text-sm mt-2">{vulnerability.description}</p>
        {vulnerability.recommendation && (
          <div className="mt-2 bg-muted/50 p-2 rounded text-sm">
            <span className="font-semibold">Recommendation:</span> {vulnerability.recommendation}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SeverityBadge({ severity }: { severity?: string }) {
  if (!severity) return <Badge variant="outline">Unknown</Badge>;
  
  switch (severity.toLowerCase()) {
    case "critical":
      return <Badge className="bg-red-500">Critical</Badge>;
    case "high":
      return <Badge className="bg-orange-500">High</Badge>;
    case "medium":
      return <Badge className="bg-yellow-500">Medium</Badge>;
    case "low":
      return <Badge className="bg-blue-500">Low</Badge>;
    default:
      return <Badge variant="outline">{severity}</Badge>;
  }
}
