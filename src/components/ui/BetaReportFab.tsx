'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getActiveSession, UserSession } from '@/lib/auth';
import { submitBetaReport } from '@/lib/supabase';
import { IconBug, IconX, IconSend } from '@tabler/icons-react';

export default function BetaReportFab() {
  const [isOpen, setIsOpen] = useState(false);
  const [problem, setProblem] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [session, setSession] = useState<UserSession | null>(null);
  
  const pathname = usePathname() || '/';

  useEffect(() => {
    async function loadUser() {
      const user = await getActiveSession();
      setSession(user);
    }
    loadUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mocking API call payload
    const payload = {
      page: pathname,
      problem,
      user_id: session?.id || 'anonymous',
      user_name: session?.full_name || 'Anonymous',
      user_email: session?.email || 'N/A',
      role: session?.role || 'N/A'
    };
    
    console.log('Submitting Beta Report:', payload);
    
    // Submit to Supabase DB (with fallback to local storage)
    await submitBetaReport(payload);
    
    // Fake network request delay just for UI smoothing
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    setIsSubmitting(false);
    setSuccess(true);
    
    // Close modal after success
    setTimeout(() => {
      setIsOpen(false);
      setSuccess(false);
      setProblem('');
    }, 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 bg-[#663399] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#52297a] transition-transform hover:scale-105"
      >
        <IconBug className="w-5 h-5" />
        <span className="font-semibold text-sm">Beta Report</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-4 border-b border-neutral-100 bg-neutral-50">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <IconBug className="w-5 h-5 text-[#663399]" />
                Report an Issue
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-black transition-colors p-1"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {success ? (
                <div className="py-8 text-center flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <IconSend className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg">Report Submitted!</h4>
                  <p className="text-neutral-500 text-sm">Thank you for helping us improve.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider">Page URL</label>
                    <input 
                      type="text" 
                      value={pathname} 
                      readOnly 
                      className="w-full bg-neutral-100 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-600 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider">Describe the Problem</label>
                    <textarea 
                      required
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      placeholder="What went wrong or what could be better?"
                      className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm text-black outline-none focus:border-[#663399] focus:ring-1 focus:ring-[#663399] min-h-[120px] resize-none"
                    />
                  </div>
                  
                  <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100 text-xs text-neutral-500 flex items-start gap-2">
                    <IconBug className="w-4 h-4 shrink-0 text-neutral-400" />
                    <p>Your account information (if logged in) will be automatically attached to this report.</p>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting || !problem.trim()}
                    className="mt-2 w-full bg-[#663399] text-white py-2.5 rounded-lg font-bold hover:bg-[#52297a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Submit Report'
                    )}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
