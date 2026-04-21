import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, AlertCircle, User, Briefcase, Mail, Lock, UserPlus, ArrowRight, Loader2, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type AuthMode = 'signin' | 'signup' | 'forgot';

export default function Login() {
  const { signIn, signInEmail, signUpEmail, resetPassword, user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [selectedRole, setSelectedRole] = useState<'citizen' | 'admin'>('citizen');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [resending, setResending] = useState(false);

  React.useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        setAuthError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setAuthError('Password must be at least 6 characters');
        return;
      }
    }

    setAuthLoading(true);
    try {
      if (mode === 'signin') {
        await signInEmail(formData.email, formData.password);
      } else if (mode === 'signup') {
        await signUpEmail(formData.email, formData.password, formData.name, selectedRole);
      } else {
        await resetPassword(formData.email);
        alert('Password reset link sent to your email.');
        setMode('signin');
      }
    } catch (err: any) {
      console.error("Auth error:", err.code, err.message);
      if (err.code === 'auth/email-already-in-use') {
        setAuthError('This email is already registered. Try signing in instead.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setAuthError('Invalid email or password. Please check your credentials.');
      } else if (err.code === 'auth/weak-password') {
        setAuthError('Password is too weak. Please use at least 6 characters.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in cancelled. Please try again.');
      } else {
        setAuthError(err.message?.replace('Firebase: ', '') || 'An error occurred during authentication');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-main-bg relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-border relative z-10"
      >
        {/* Auth Mode Switcher */}
        <div className="flex bg-slate-50/50 p-1 rounded-2xl border border-slate-100 mb-8">
          <button
            onClick={() => { setMode('signin'); setAuthError(''); }}
            className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              mode === 'signin' ? 'bg-white shadow-md text-accent ring-1 ring-slate-200' : 'text-text-light hover:text-text-main'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setAuthError(''); }}
            className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              mode === 'signup' ? 'bg-white shadow-md text-accent ring-1 ring-slate-200' : 'text-text-light hover:text-text-main'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="bg-accent p-4 rounded-2xl mb-4 shadow-lg shadow-accent/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-text-main text-center">
            {mode === 'signin' ? 'Welcome Back' : mode === 'signup' ? 'Start Your Journey' : 'Reset Password'}
            <span className="block text-accent text-sm mt-1">
              {selectedRole === 'admin' ? 'Administrative Portal' : 'Citizen Portal'}
            </span>
          </h1>
        </div>

        {/* Global Role Switcher */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 gap-3 mb-8 bg-slate-50/50 p-1.5 rounded-2xl border border-slate-100">
            <button
              type="button"
              onClick={() => setSelectedRole('citizen')}
              className={`py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-xs uppercase tracking-tight ${
                selectedRole === 'citizen' 
                  ? 'bg-white shadow-md text-accent ring-1 ring-slate-200' 
                  : 'text-text-light hover:text-text-main'
              }`}
            >
              <User className="w-4 h-4" />
              Citizen
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-xs uppercase tracking-tight ${
                selectedRole === 'admin' 
                  ? 'bg-white shadow-md text-accent ring-1 ring-slate-200' 
                  : 'text-text-light hover:text-text-main'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Admin
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.form 
            key={mode}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onSubmit={handleEmailAuth} 
            className="space-y-4"
          >
            {mode === 'signup' && (
              <div className="relative group">
                <UserPlus className={`absolute left-4 top-3.5 h-4 w-4 text-slate-400 transition-all duration-200 pointer-events-none ${formData.name ? 'text-accent opacity-50' : 'opacity-100'}`} />
                <input 
                  type="text" 
                  className="input-field pl-12"
                  placeholder="Full Name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            )}

            <div className="relative group">
              <Mail className={`absolute left-4 top-3.5 h-4 w-4 text-slate-400 transition-all duration-200 pointer-events-none ${formData.email ? 'text-accent opacity-50' : 'opacity-100'}`} />
              <input 
                type="email" 
                className="input-field pl-12"
                placeholder="Email Address"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-4">
                <div className="relative group">
                  <Lock className={`absolute left-4 top-3.5 h-4 w-4 text-slate-400 transition-all duration-200 pointer-events-none ${formData.password ? 'text-accent opacity-50' : 'opacity-100'}`} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="input-field pl-12 pr-12"
                    placeholder="Password"
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    onFocus={(e) => e.target.placeholder = ""}
                    onBlur={(e) => e.target.placeholder = "Password"}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3 text-slate-400 hover:text-accent transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {mode === 'signup' && (
                  <div className="relative group">
                    <Lock className={`absolute left-4 top-3.5 h-4 w-4 text-slate-400 transition-all duration-200 pointer-events-none ${formData.confirmPassword ? 'text-accent opacity-50' : 'opacity-100'}`} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="input-field pl-12"
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      onFocus={(e) => e.target.placeholder = ""}
                      onBlur={(e) => e.target.placeholder = "Confirm Password"}
                      required
                    />
                  </div>
                )}
              </div>
            )}

            {authError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {authError}
              </div>
            )}

            <button 
              type="submit"
              disabled={authLoading}
              className="w-full btn-primary h-12 flex items-center justify-center gap-2 group shadow-lg shadow-accent/20"
            >
              {authLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </motion.form>
        </AnimatePresence>

        <div className="mt-6 flex flex-col gap-3">
          {mode === 'signin' && (
            <>
              <button 
                onClick={() => setMode('forgot')}
                className="text-xs text-text-light hover:text-accent font-medium text-center transition-colors"
              >
                Forgot your password?
              </button>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-text-light font-bold">OR</span></div>
              </div>

              <button 
                onClick={() => signIn(selectedRole)}
                className="w-full h-11 flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
                <span className="text-sm">Continue with Google</span>
              </button>
            </>
          )}

          {mode === 'forgot' && (
            <button 
              onClick={() => setMode('signin')} 
              className="flex items-center justify-center gap-2 text-text-light hover:text-accent font-bold text-xs transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Login
            </button>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              By continuing, you acknowledge that CivicGuard is an official reporting system. Fraudulent reports may be subject to investigation.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
