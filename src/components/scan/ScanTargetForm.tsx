
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useScanTargets } from "@/hooks/use-scan-targets";

export function ScanTargetForm() {
  const [target, setTarget] = useState("");
  const [description, setDescription] = useState("");
  const { createScanTarget } = useScanTargets();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!target.trim()) return;
    
    createScanTarget.mutate(
      { target, description },
      {
        onSuccess: () => {
          setTarget("");
          setDescription("");
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Target</CardTitle>
        <CardDescription>
          Enter an IP address or hostname to scan for open ports and vulnerabilities
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="target" className="text-sm font-medium">
              Target IP or Hostname
            </label>
            <Input
              id="target"
              placeholder="e.g. 192.168.1.1 or example.com"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (Optional)
            </label>
            <Textarea
              id="description"
              placeholder="Add a note about this target"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={createScanTarget.isPending || !target.trim()}
          >
            {createScanTarget.isPending ? "Adding..." : "Add Target"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
