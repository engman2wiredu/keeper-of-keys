
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Mock function to simulate scanning ports
// In a real implementation, you would use a proper port scanning library or service
async function scanPorts(target: string, portRange: number[] = [20, 21, 22, 23, 25, 53, 80, 443, 8080]) {
  console.log(`Scanning target: ${target} for ports: ${portRange.join(", ")}`);
  
  // This is a mock implementation that randomly determines if ports are open
  // In production, you would implement actual port scanning logic
  const results = [];
  
  for (const port of portRange) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Randomly determine if port is open (for demonstration)
    const isOpen = Math.random() > 0.7;
    const service = getServiceForPort(port);
    
    results.push({
      port_number: port,
      is_open: isOpen,
      protocol: "tcp",
      service: service,
      version: isOpen ? getRandomVersion(service) : null,
      details: isOpen ? `Port ${port} is open running ${service}` : `Port ${port} is closed`
    });
  }
  
  return results;
}

// Helper function to get service name based on port number
function getServiceForPort(port: number): string {
  const commonPorts: Record<number, string> = {
    20: "FTP Data",
    21: "FTP Control",
    22: "SSH",
    23: "Telnet",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    443: "HTTPS",
    8080: "HTTP Alternate"
  };
  
  return commonPorts[port] || "Unknown";
}

// Helper function to generate random version strings for services
function getRandomVersion(service: string): string {
  const versions: Record<string, string[]> = {
    "SSH": ["OpenSSH_7.9p1", "OpenSSH_8.2p1", "OpenSSH_8.4p1"],
    "HTTP": ["Apache/2.4.41", "nginx/1.18.0", "Microsoft-IIS/10.0"],
    "HTTPS": ["Apache/2.4.41 (SSL)", "nginx/1.18.0 (SSL)", "Microsoft-IIS/10.0 (SSL)"],
    "FTP Control": ["vsftpd 3.0.3", "ProFTPD 1.3.6", "FileZilla Server 0.9.60"],
    "SMTP": ["Postfix 3.4.13", "Microsoft Exchange", "Exim 4.94"]
  };
  
  const serviceVersions = versions[service] || ["1.0.0", "2.0.0", "3.0.0"];
  return serviceVersions[Math.floor(Math.random() * serviceVersions.length)];
}

// Mock function to scan for vulnerabilities on open ports
// In a real implementation, you would use a vulnerability database or service
function scanForVulnerabilities(port: number, service: string, version: string) {
  // Only generate vulnerabilities for some ports to make demo data more realistic
  if (Math.random() > 0.7) {
    return [];
  }
  
  const vulnerabilities = [];
  const severities = ["Low", "Medium", "High", "Critical"];
  
  // Generate 0-3 random vulnerabilities
  const vulnCount = Math.floor(Math.random() * 4);
  
  for (let i = 0; i < vulnCount; i++) {
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const cveYear = 2020 + Math.floor(Math.random() * 5);
    const cveNumber = 1000 + Math.floor(Math.random() * 9000);
    const cveId = `CVE-${cveYear}-${cveNumber}`;
    
    vulnerabilities.push({
      cve_id: cveId,
      severity: severity,
      title: `${service} ${version} Vulnerability`,
      description: `This is a ${severity.toLowerCase()} severity vulnerability affecting ${service} ${version} on port ${port}.`,
      recommendation: `Update ${service} to the latest version or restrict access to port ${port}.`
    });
  }
  
  return vulnerabilities;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  
  // Get Supabase client
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  const supabaseClient = createClient(
    "https://wxahemerhoapxqfussfs.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4YWhlbWVyaG9hcHhxZnVzc2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2OTk2NTYsImV4cCI6MjA1OTI3NTY1Nn0.2bVF9HcdMekfGak-BleceuEyIPHmBkhFnf7yyENBAyQ",
    {
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    }
  );
  
  try {
    if (req.method === 'POST') {
      const { scanTargetId } = await req.json();
      
      // Validate input
      if (!scanTargetId) {
        return new Response(JSON.stringify({ error: 'Missing scanTargetId parameter' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Get the scan target
      const { data: scanTarget, error: targetError } = await supabaseClient
        .from('scan_targets')
        .select('*')
        .eq('id', scanTargetId)
        .single();
      
      if (targetError || !scanTarget) {
        return new Response(JSON.stringify({ error: targetError?.message || 'Scan target not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Update scan target status to 'scanning'
      await supabaseClient
        .from('scan_targets')
        .update({ scan_status: 'scanning', updated_at: new Date().toISOString() })
        .eq('id', scanTargetId);
      
      // Start the scan
      const startTime = Date.now();
      const portResults = await scanPorts(scanTarget.target);
      const scanDuration = Math.floor((Date.now() - startTime) / 1000);
      
      // Create scan result
      const openPortsCount = portResults.filter(p => p.is_open).length;
      const { data: scanResult, error: resultError } = await supabaseClient
        .from('scan_results')
        .insert({
          scan_target_id: scanTargetId,
          total_ports_scanned: portResults.length,
          open_ports: openPortsCount,
          scan_duration: scanDuration,
          scan_status: 'completed'
        })
        .select()
        .single();
      
      if (resultError) {
        throw resultError;
      }
      
      // Insert port data
      let totalVulnerabilities = 0;
      for (const portData of portResults) {
        const { data: portRecord, error: portError } = await supabaseClient
          .from('ports')
          .insert({
            scan_result_id: scanResult.id,
            port_number: portData.port_number,
            protocol: portData.protocol,
            service: portData.service,
            is_open: portData.is_open,
            version: portData.version,
            details: portData.details
          })
          .select()
          .single();
        
        if (portError) {
          console.error('Error inserting port data:', portError);
          continue;
        }
        
        // If port is open, scan for vulnerabilities
        if (portData.is_open && portData.service && portData.version) {
          const vulnerabilities = scanForVulnerabilities(
            portData.port_number,
            portData.service,
            portData.version
          );
          
          totalVulnerabilities += vulnerabilities.length;
          
          for (const vuln of vulnerabilities) {
            await supabaseClient
              .from('vulnerability_findings')
              .insert({
                port_id: portRecord.id,
                scan_result_id: scanResult.id,
                cve_id: vuln.cve_id,
                severity: vuln.severity,
                title: vuln.title,
                description: vuln.description,
                recommendation: vuln.recommendation
              });
          }
        }
      }
      
      // Update the scan result with vulnerability count
      await supabaseClient
        .from('scan_results')
        .update({ vulnerabilities_found: totalVulnerabilities })
        .eq('id', scanResult.id);
      
      // Update scan target with completion info
      await supabaseClient
        .from('scan_targets')
        .update({
          scan_status: 'completed',
          updated_at: new Date().toISOString(),
          last_scan_at: new Date().toISOString()
        })
        .eq('id', scanTargetId);
      
      return new Response(JSON.stringify({
        message: 'Scan completed successfully',
        scanResultId: scanResult.id,
        openPorts: openPortsCount,
        vulnerabilitiesFound: totalVulnerabilities
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(JSON.stringify({ error: error.message || 'An unknown error occurred' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
