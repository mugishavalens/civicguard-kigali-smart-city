import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Footer from './Footer';

type AuthMode = 'signin' | 'forgot';

export default function Login() {
  const { signIn, signInEmail, signUpEmail, resetPassword, user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [showRegister, setShowRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const [loginError, setLoginError] = useState('');
  const [loginInfo, setLoginInfo] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
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

  const strength = getPasswordStrength(registerData.password);

  React.useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const describeAuthError = (err: any) => {
    if (err.code === 'auth/email-already-in-use') return 'This email is already registered.';
    if (['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found'].includes(err.code)) {
      return 'Invalid email or password.';
    }
    return err.message?.replace('Firebase: ', '') || 'An error occurred';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginInfo('');

    if (mode === 'forgot') {
      setAuthLoading(true);
      try {
        await resetPassword(loginData.email);
        setLoginInfo('Password reset link sent to your email.');
        setMode('signin');
      } catch (err: any) {
        setLoginError(describeAuthError(err));
      } finally {
        setAuthLoading(false);
      }
      return;
    }

    setAuthLoading(true);
    try {
      await signInEmail(loginData.email, loginData.password);
    } catch (err: any) {
      setLoginError(describeAuthError(err));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }

    setAuthLoading(true);
    try {
      await signUpEmail(registerData.email, registerData.password, registerData.name, 'citizen');
      setRegisterSuccess('Account created — redirecting...');
    } catch (err: any) {
      setRegisterError(describeAuthError(err));
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="bg-main-bg">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-14">
        <section className="surface-card grid lg:grid-cols-[minmax(380px,470px)_1fr] !p-0 overflow-hidden min-h-[min(720px,calc(100vh-9rem))]">
          {/* Form panel */}
          <section className="p-8 sm:p-10 flex flex-col justify-center gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-main">
                {mode === 'forgot' ? 'Reset your password' : 'Welcome back to CivicGuard'}
              </h2>
              <p className="mt-2 flex items-center gap-1.5 flex-wrap text-text-light">
                {mode === 'forgot' ? (
                  <button type="button" onClick={() => setMode('signin')} className="text-accent-deep font-bold">
                    Back to login
                  </button>
                ) : (
                  <>
                    <span>Login to continue.</span>
                    <button type="button" onClick={() => setShowRegister(true)} className="text-accent-deep font-bold">
                      Create Account
                    </button>
                  </>
                )}
              </p>
            </div>

            <form onSubmit={handleLogin} className="grid gap-4">
              {loginError && (
                <div className="form-message flex items-center gap-2 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {loginError}
                </div>
              )}
              {loginInfo && (
                <div className="form-message flex items-center gap-2 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> {loginInfo}
                </div>
              )}

              <div className="field">
                <label>Email address</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>

              {mode !== 'forgot' && (
                <div className="field">
                  <label>Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input-field pr-12"
                      placeholder="********"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-accent-deep hover:opacity-70 transition-opacity"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'signin' && (
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="flex items-center gap-2 cursor-pointer text-text-light text-sm">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember me
                  </label>
                  <button type="button" onClick={() => setMode('forgot')} className="text-accent-deep font-bold text-sm">
                    Forgot Password?
                  </button>
                </div>
              )}

              <button type="submit" disabled={authLoading} className="btn-primary h-14 text-base disabled:opacity-60">
                {authLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : mode === 'forgot' ? (
                  'Send reset link'
                ) : (
                  'Login'
                )}
              </button>

              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => signIn('citizen')}
                  className="w-full h-14 flex items-center justify-center gap-3 bg-panel border border-border rounded-2xl font-bold text-text-main hover:bg-panel-soft transition-all"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                  Sign in with Google
                </button>
              )}
            </form>
          </section>

          {/* Art panel */}
          <aside className="hidden lg:block relative">
            <img
              src="https://ugandarwandagorillatours.com/wp-content/uploads/2019/09/Areial-View-Of-Kigali-1.jpg"
              alt="Urban smart city corridor with high-density buildings and traffic flow"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/70" />
            <div className="absolute left-8 right-8 bottom-8 text-white">
              <span className="text-xs font-black uppercase tracking-widest text-white/80">Kigali Smart City Initiative</span>
              <p className="mt-2 text-2xl sm:text-3xl font-bold leading-snug">
                Secure reporting for real urban incidents, faster response, and accountable follow-up.
              </p>
            </div>
          </aside>
        </section>
      </div>

      <Footer />

      {/* Register modal */}
      <AnimatePresence>
        {showRegister && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center p-4 sm:p-6"
            onClick={() => setShowRegister(false)}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 16 }}
              className="surface-card relative z-10 w-full max-w-md max-h-[calc(100vh-3rem)] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowRegister(false)}
                className="absolute top-3 right-4 text-2xl text-text-light hover:text-text-main"
                aria-label="Close create account form"
              >
                ×
              </button>

              <div className="mb-4">
                <h2 className="text-2xl font-bold text-text-main">Create Account</h2>
                <p className="mt-1 flex items-center gap-1.5 flex-wrap text-text-light">
                  <span>New to CivicGuard?</span>
                  <button type="button" onClick={() => setShowRegister(false)} className="text-accent-deep font-bold">
                    Sign In
                  </button>
                </p>
              </div>

              <form onSubmit={handleRegister} className="grid gap-4">
                {registerError && (
                  <div className="form-message flex items-center gap-2 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {registerError}
                  </div>
                )}
                {registerSuccess && (
                  <div className="form-message flex items-center gap-2 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> {registerSuccess}
                  </div>
                )}

                <div className="field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Your full name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="field">
                  <label>Email address</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="you@example.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="field">
                  <label>Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input-field pr-12"
                      placeholder="Create a strong password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-accent-deep hover:opacity-70 transition-opacity"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {registerData.password && (
                    <div className="pt-1">
                      <div className="grid grid-cols-4 gap-1.5 mb-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 rounded-full transition-all ${strength.score >= i ? 'bg-accent' : 'bg-border'}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-text-light">Password strength: {strength.label}</p>
                    </div>
                  )}
                </div>
                <div className="field">
                  <label>Confirm Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="input-field pr-12"
                      placeholder="Re-enter password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 text-accent-deep hover:opacity-70 transition-opacity"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={authLoading} className="btn-primary h-14 text-base disabled:opacity-60">
                  {authLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Create Account'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
