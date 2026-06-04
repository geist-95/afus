'use client';

import React, { useState, useEffect } from 'react';
import { loginUser, registerUser } from '@/lib/auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

export default function LoginModal({ isOpen, onClose, lang }: LoginModalProps) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset state and lock body scroll when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsRegisterMode(false);
      setEmail('');
      setPassword('');
      setFullName('');
      setError('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegisterMode && !fullName)) {
      setError(lang === 'fr' ? 'Veuillez remplir tous les champs.' : lang === 'ar' ? 'الرجاء ملء جميع الحقول.' : 'Please fill all fields.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      if (isRegisterMode) {
        await registerUser({
          email,
          password,
          fullName,
          phone: '',
          role: 'buyer'
        });
      } else {
        await loginUser(email, password);
      }
      onClose();
      window.location.reload(); // Reload to reflect the new session across the app
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const t = {
    login: lang === 'fr' ? 'Connexion' : lang === 'ar' ? 'تسجيل الدخول' : 'Sign in',
    register: lang === 'fr' ? "S'inscrire" : lang === 'ar' ? 'إنشاء حساب' : 'Register',
    email: lang === 'fr' ? 'Adresse email' : lang === 'ar' ? 'البريد الإلكتروني' : 'Email address',
    password: lang === 'fr' ? 'Mot de passe' : lang === 'ar' ? 'كلمة المرور' : 'Password',
    stayConnected: lang === 'fr' ? 'Rester connecté' : lang === 'ar' ? 'البقاء متصلاً' : 'Stay signed in',
    forgotPassword: lang === 'fr' ? 'Mot de passe oublié ?' : lang === 'ar' ? 'هل نسيت كلمة المرور؟' : 'Forgot password?',
    signInBtn: lang === 'fr' ? 'Se connecter' : lang === 'ar' ? 'تسجيل الدخول' : 'Sign in',
    registerBtn: lang === 'fr' ? "S'inscrire" : lang === 'ar' ? 'إنشاء حساب' : 'Register',
    trouble: lang === 'fr' ? "Vous n'arrivez pas à vous connecter ?" : lang === 'ar' ? 'هل تواجه مشكلة في تسجيل الدخول؟' : 'Trouble signing in?',
    or: lang === 'fr' ? 'OU' : lang === 'ar' ? 'أو' : 'OR',
    fullName: lang === 'fr' ? 'Nom complet' : lang === 'ar' ? 'الاسم الكامل' : 'Full name',
    continueGoogle: lang === 'fr' ? 'Continuer avec Google' : lang === 'ar' ? 'المتابعة باستخدام Google' : 'Continue with Google',
    terms: lang === 'fr' ? "En cliquant sur Se connecter ou Continuer avec Google, vous acceptez de respecter les Conditions d'utilisation et le Règlement concernant la confidentialité." : lang === 'ar' ? "بالنقر على تسجيل الدخول أو المتابعة باستخدام Google، فإنك توافق على شروط الاستخدام وسياسة الخصوصية." : "By clicking Sign in or Continue with Google, you agree to our Terms of Use and Privacy Policy.",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md">
        {/* Close Button Outside Modal */}
        <button 
          onClick={onClose}
          className="absolute -right-12 top-0 text-white/80 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="bg-white arabic-frame w-full p-6 shadow-xl overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pr-4">
          <h2 className="text-2xl font-bold text-black">
            {isRegisterMode ? t.register : t.login}
          </h2>
          <button 
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-sm font-bold border border-black/20 rounded-full px-4 py-1.5 hover:bg-neutral-50 transition-colors text-black"
          >
            {isRegisterMode ? t.login : t.register}
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {isRegisterMode && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-black block">{t.fullName}</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-black transition-colors"
                disabled={loading}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-black block">{t.email}</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-black transition-colors"
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-black block">{t.password}</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-black transition-colors"
              disabled={loading}
            />
          </div>

          {!isRegisterMode && (
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 border-2 border-black rounded bg-white group-hover:bg-neutral-50">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <svg className="w-3.5 h-3.5 text-white peer-checked:text-black absolute pointer-events-none" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-sm text-black">{t.stayConnected}</span>
              </label>
              <button type="button" className="text-sm text-black underline hover:no-underline underline-offset-2">
                {t.forgotPassword}
              </button>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-[#222222] text-white rounded-full py-3 font-bold hover:bg-black transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? '...' : isRegisterMode ? t.registerBtn : t.signInBtn}
          </button>

          {!isRegisterMode && (
            <div className="text-center pt-2">
              <button type="button" className="text-sm text-black underline hover:no-underline underline-offset-2">
                {t.trouble}
              </button>
            </div>
          )}
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-neutral-500 font-medium">{t.or}</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-3 border border-black/20 rounded-full py-2.5 hover:bg-neutral-50 transition-colors text-black font-bold text-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            {t.continueGoogle}
          </button>
        </div>

        <div className="mt-8 text-xs text-neutral-500 leading-relaxed text-center px-4">
          {t.terms}
        </div>
      </div>
    </div>
  </div>
  );
}
