// app/(dashboard)/devices/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Device } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { RefreshCcw, WifiOff, Wifi } from "lucide-react";

export default function DevicesPage() {
  const supabase = createClient();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDevices = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("devices").select("*");

    if (error) toast.error("Failed to load devices");
    else setDevices(data || []);

    setLoading(false);
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const deleteDevice = async (id: string) => {
    const { error } = await supabase.from("devices").delete().eq("id", id);
    if (error) return toast.error("Failed to delete device");
    toast.success("Device removed");
    loadDevices();
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Devices</h1>
        <Button onClick={loadDevices}>
          <RefreshCcw className="mr-2 w-4 h-4" /> Refresh
        </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : devices.length === 0 ? (
        <p className="text-gray-600">No devices registered yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devices.map((d) => (
            <Card key={d.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">{d.device_name}</p>
                <p className="text-xs text-gray-400 mt-1">{d.device_id}</p>
                <p className="text-sm mt-2">
                  {d.is_online ? (
                    <span className="flex items-center text-green-600 font-medium">
                      <Wifi className="w-4 h-4 mr-1" /> Online
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600 font-medium">
                      <WifiOff className="w-4 h-4 mr-1" /> Offline
                    </span>
                  )}
                </p>
              </div>

              <Button onClick={() => deleteDevice(d.id)} variant="danger">
                Delete
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
