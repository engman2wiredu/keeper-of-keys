
import { ScanTargetForm } from "@/components/scan/ScanTargetForm";
import { ScanTargetList } from "@/components/scan/ScanTargetList";
import { isAuthenticated } from "@/lib/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/signin");
    }
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Port Scanner Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ScanTargetForm />
        </div>
        <div className="md:col-span-2">
          <ScanTargetList />
        </div>
      </div>
    </div>
  );
}
