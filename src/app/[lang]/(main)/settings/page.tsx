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
    <div className="w-full bg-[#FAFAFA] min-h-screen pb-20">
      <div className="bg-[#111827] text-white py-12 mb-8">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <IconSettings className="w-8 h-8 text-[#E8583F]" />
            <h1 className="text-3xl font-bold">Account Settings</h1>
          </div>
          <p className="text-neutral-400">Manage your personal information and preferences.</p>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-[250px] flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <nav className="flex flex-col">
                <button className="flex items-center gap-3 px-4 py-3 bg-[#E8583F]/10 text-[#E8583F] font-semibold border-l-4 border-[#E8583F] text-left">
                  <IconUser className="w-5 h-5" />
                  General Info
                </button>
                <button className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:bg-neutral-50 transition-colors text-left border-l-4 border-transparent hover:border-neutral-200">
                  <IconShieldLock className="w-5 h-5" />
                  Security
                </button>
              </nav>
            </div>
          </div>

          {/* Main Form Content */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 md:p-8">
            <h2 className="text-xl font-bold text-black mb-6">General Information</h2>
            
            {message && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm font-medium">
                {message}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6 max-w-lg">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                  <IconUser className="w-4 h-4 text-neutral-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                  <IconMail className="w-4 h-4 text-neutral-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={session?.email || ""}
                  disabled
                  className="w-full border border-neutral-200 bg-neutral-50 text-neutral-500 rounded-lg px-4 py-2.5 outline-none cursor-not-allowed"
                />
                <p className="text-[11px] text-neutral-400 mt-1">Email address cannot be changed currently.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                  <IconPhone className="w-4 h-4 text-neutral-400" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="+212 600 000 000"
                />
              </div>

              <div className="pt-4 border-t border-neutral-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary text-white px-8 py-2.5 rounded-full font-bold hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
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
