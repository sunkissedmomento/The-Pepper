// app/(dashboard)/settings/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "react-hot-toast";

export default function SettingsPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);

  const loadProfile = async () => {
    const { data, error } = await supabase.from("profiles").select("*").single();
    if (!error) setProfile(data);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const connectSpotify = () => {
    window.location.href = "/api/auth/spotify/connect";
  };

  const disconnectSpotify = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ spotify_access_token: null, spotify_refresh_token: null })
      .eq("id", profile.id);

    if (error) toast.error("Failed to disconnect Spotify");
    else {
      toast.success("Spotify disconnected");
      loadProfile();
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Spotify</h2>

        {profile?.spotify_access_token ? (
          <>
            <p className="text-green-600">Connected</p>
            <Button variant="danger" onClick={disconnectSpotify}>
              Disconnect Spotify
            </Button>
          </>
        ) : (
          <Button onClick={connectSpotify}>Connect Spotify</Button>
        )}
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Account</h2>
        <Button variant="danger" onClick={logout}>
          Logout
        </Button>
      </Card>
    </div>
  );
}
