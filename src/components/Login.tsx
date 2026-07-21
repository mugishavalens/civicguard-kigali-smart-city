import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Eye, EyeOff, Loader2, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type AuthMode = 'signin' | 'signup' | 'forgot';

export default function Login() {
  const { signIn, signInEmail, signUpEmail, resetPassword, user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: 'none', score: 0 };
    let score = 0;
    if (pass.length > 5) score = 1;
    if (pass.length > 8 && /[A-Z]/.test(pass)) score = 2;
    if (pass.length > 10 && /[0-9]/.test(pass)) score = 3;
    if (pass.length > 12 && /[^A-Za-z0-9]/.test(pass)) score = 4;
    
    const labels = ['none', 'very weak', 'weak', 'fair', 'strong'];
    return { label: labels[score], score };
  };

  const strength = getPasswordStrength(formData.password);

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
    }

    setAuthLoading(true);
    try {
      if (mode === 'signin') {
        await signInEmail(formData.email, formData.password);
      } else if (mode === 'signup') {
        await signUpEmail(formData.email, formData.password, formData.name, 'citizen');
      } else {
        await resetPassword(formData.email);
        alert('Password reset link sent to your email.');
        setMode('signin');
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setAuthError('This email is already registered.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setAuthError('Invalid email or password.');
      } else {
        setAuthError(err.message?.replace('Firebase: ', '') || 'An error occurred');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center font-sans antialiased">
      <div className="max-w-7xl w-full grid lg:grid-cols-[1fr_1.1fr] min-h-screen">
        
        {/* Left Part: Authentication Form */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-sm mx-auto lg:mx-0"
          >
            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-[2.5rem] font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-2">
                {mode === 'signin' ? 'Welcome Back!' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
              </h1>

              <div className="flex p-1 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setAuthError(''); }}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                    mode === 'signin' ? 'bg-white dark:bg-slate-800 shadow-sm text-[#D946EF]' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setAuthError(''); }}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                    mode === 'signup' ? 'bg-white dark:bg-slate-800 shadow-sm text-[#10B981]' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {mode === 'signup' && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-400">Full Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/40 text-slate-900 dark:text-white focus:outline-none focus:border-[#10B981] transition-all placeholder:text-slate-400"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-400">Email address</label>
                    <input
                      type="email"
                      className={`w-full px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/40 text-slate-900 dark:text-white focus:outline-none focus:border-[${mode === 'signup' ? '#10B981' : '#D946EF'}] transition-all placeholder:text-slate-400`}
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>

                  {mode !== 'forgot' && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-400">Password</label>
                      <div className="relative flex items-center">
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`w-full px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/40 text-slate-900 dark:text-white focus:outline-none focus:border-[${mode === 'signup' ? '#10B981' : '#D946EF'}] transition-all placeholder:text-slate-400`}
                          placeholder={mode === 'signup' ? "Create a strong password" : "********"}
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute right-4 p-1 ${mode === 'signup' ? 'text-[#10B981]' : 'text-[#D946EF]'} hover:opacity-70 transition-opacity`}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      {mode === 'signup' && formData.password && (
                        <div className="pt-2">
                          <div className="grid grid-cols-4 gap-2 mb-1.5">
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                  strength.score >= i ? 'bg-[#10B981]' : 'bg-slate-100 dark:bg-slate-800'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-[13px] text-slate-400">
                            Password strength: <span className="font-medium">{strength.label}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {mode === 'signup' && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-400">Confirm Password</label>
                      <div className="relative flex items-center">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/40 text-slate-900 dark:text-white focus:outline-none focus:border-[#10B981] transition-all placeholder:text-slate-400"
                          placeholder="Re-enter password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 p-1 text-[#10B981] hover:opacity-70 transition-opacity"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {mode === 'signin' && (
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2.5 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-slate-200 text-[#D946EF] focus:ring-[#D946EF]"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <span className="text-sm font-semibold text-slate-400 transition-colors">Remember for 30 days</span>
                      </label>
                      <button 
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-sm font-bold text-[#D946EF]"
                      >
                        Forget password
                      </button>
                    </div>
                  )}

                  {authError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 rounded-xl text-red-600 dark:text-red-400 text-[13px] font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {authError}
                    </div>
                  )}

                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={authLoading}
                      className={`w-full h-14 rounded-2xl font-bold text-white transition-all active:scale-[0.98] ${
                        mode === 'signup' ? 'bg-[#10B981] shadow-lg shadow-emerald-100' : 'bg-[#D946EF] shadow-lg shadow-fuchsia-100'
                      }`}
                    >
                      {authLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create Account' : 'Reset Password')}
                    </button>

                    {mode === 'signin' && (
                      <button 
                        type="button"
                        onClick={() => signIn('citizen')}
                        className="w-full h-14 mt-4 flex items-center justify-center gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        <span className="text-base">Sign in with Google</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </form>

            <div className="mt-16 pt-8 border-t border-slate-50 dark:border-slate-800 text-center lg:text-left">
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                © {new Date().getFullYear()} CivicGuard Kigali • Official Republic of Rwanda Portal
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Part: Related Image (Modern Kigali Architecture) */}
        <div className="hidden lg:block relative overflow-hidden p-6">
          <div className="h-full w-full relative rounded-[2.5rem] overflow-hidden shadow-2xl">
            <img
              src="https://ugandarwandagorillatours.com/wp-content/uploads/2019/09/Areial-View-Of-Kigali-1.jpg"
              alt="Kigali City Life"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
            <div className="absolute bottom-12 left-12 right-12 text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                    <Shield className="w-5 h-5 text-[#D946EF]" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 tracking-widest">Digital Civic Governance</span>
                </div>
                <h2 className="text-5xl font-bold mb-4 leading-tight tracking-tight">Kigali Smart City <br/><span className="text-[#D946EF] italic">CivicGuard</span> Portal</h2>
                <p className="text-white/80 text-lg leading-relaxed max-w-lg">
                  Join the official network connecting citizens and district authorities for a more responsive and safer community.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
