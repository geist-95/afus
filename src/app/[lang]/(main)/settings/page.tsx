"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getActiveSession, UserSession } from "@/lib/auth";
import { IconSettings, IconUser, IconMail, IconPhone, IconShieldLock } from "@tabler/icons-react";

export default function SettingsPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const active = await getActiveSession();
      if (!active) {
        router.push("/en");
        return;
      }
      setSession(active);
      setFullName(active.full_name || "");
      setPhone(active.phone_number || "");
      setLoading(false);
    }
    load();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setMessage("Profile updated successfully.");
      
      // Update local storage session mock
      if (session) {
        const updated = { ...session, full_name: fullName, phone_number: phone };
        localStorage.setItem("afus_session_user", JSON.stringify(updated));
        setSession(updated);
      }
    }, 800);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-neutral-50/30">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-neutral-800 tracking-tight">Account Settings</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Manage your personal information and preferences.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:px-8 md:py-8 max-w-6xl flex-1 space-y-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Secondary Sidebar */}
          <div className="w-full lg:w-64 shrink-0 space-y-1">
             <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors bg-neutral-100 text-neutral-900">
                <IconUser className="w-4 h-4" /> General Info
             </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900">
                <IconShieldLock className="w-4 h-4" /> Security
             </button>
          </div>

          {/* Main Form Content */}
          <div className="flex-1 w-full bg-white rounded-xl border border-neutral-200 p-6 md:p-8 min-h-[500px]">
            <h2 className="text-lg font-bold text-neutral-800 mb-6">General Information</h2>
            
            {message && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm font-medium">
                {message}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6 max-w-lg">
              
              <div className="space-y-2">
                <label className="block font-semibold text-neutral-800 text-sm">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-neutral-200 p-3 bg-white focus:outline-none focus:border-neutral-400 rounded-lg text-sm transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-neutral-800 text-sm">Email Address</label>
                <input
                  type="email"
                  value={session?.email || ""}
                  disabled
                  className="w-full border border-neutral-200 bg-neutral-50 text-neutral-500 rounded-lg p-3 outline-none cursor-not-allowed text-sm"
                />
                <p className="text-xs text-neutral-400 mt-1">Email address cannot be changed currently.</p>
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-neutral-800 text-sm">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-neutral-200 p-3 bg-white focus:outline-none focus:border-neutral-400 rounded-lg text-sm transition-colors"
                  placeholder="+212 600 000 000"
                />
              </div>

              <div className="pt-4 border-t border-neutral-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-neutral-800 hover:bg-black text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
