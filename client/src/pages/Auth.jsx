import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { GoogleLogin } from '@react-oauth/google'
import { useAuthStore } from '../stores/authStore'
import api from '../lib/axios'

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) })
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] })
const otpSchema = z.object({ otp: z.string().length(6, 'OTP must be 6 digits') })
const resetSchema = z.object({ email: z.string().email() })
const resetVerifySchema = z.object({ otp: z.string().length(6), newPassword: z.string().min(6) })

const tabs = ['Login', 'Register']

export default function Auth() {
  const navigate = useNavigate()
  const { setUser, isAuthenticated } = useAuthStore()
  const [tab, setTab] = useState('Login')
  const [otpStep, setOtpStep] = useState(false)
  const [regEmail, setRegEmail] = useState('')
  const [resetStep, setResetStep] = useState(1)
  const [resetEmail, setResetEmail] = useState('')
  const [showForgot, setShowForgot] = useState(false)

  useEffect(() => { document.title = 'Login | KickSphere' }, [])
  useEffect(() => { if (isAuthenticated) navigate('/') }, [isAuthenticated, navigate])

  const loginForm = useForm({ resolver: zodResolver(loginSchema) })
  const registerForm = useForm({ resolver: zodResolver(registerSchema) })
  const otpForm = useForm({ resolver: zodResolver(otpSchema) })
  const resetForm = useForm({ resolver: zodResolver(resetSchema) })
  const resetVerifyForm = useForm({ resolver: zodResolver(resetVerifySchema) })

  const handleLogin = async (data) => {
    try {
      const res = await api.post('/auth/login', data)
      setUser(res.data.user)
      toast.success('Welcome back!')
      navigate('/')
    } catch (err) { toast.error(err.response?.data?.message || 'Login failed') }
  }

  const handleRegister = async (data) => {
    try {
      await api.post('/auth/register', { name: data.name, email: data.email, password: data.password })
      setRegEmail(data.email)
      setOtpStep(true)
      toast.success('OTP sent to your email!')
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed') }
  }

  const handleOtp = async (data) => {
    try {
      await api.post('/auth/otpverify', { email: regEmail, otp: data.otp })
      toast.success('Account verified! Please login.')
      setOtpStep(false)
      setTab('Login')
    } catch (err) { toast.error(err.response?.data?.message || 'OTP verification failed') }
  }

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await api.post('/auth/glogin', { credential: credentialResponse.credential })
      setUser(res.data.user)
      toast.success('Welcome!')
      navigate('/')
    } catch (err) { toast.error(err.response?.data?.message || 'Google login failed') }
  }

  const handleResetStep1 = async (data) => {
    try {
      await api.post('/auth/resetotpgenerate', { email: data.email })
      setResetEmail(data.email)
      setResetStep(2)
      toast.success('OTP sent!')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to send OTP') }
  }

  const handleResetStep2 = async (data) => {
    try {
      await api.post('/auth/resetotpverify', { email: resetEmail, otp: data.otp, newPassword: data.newPassword })
      toast.success('Password reset! Please login.')
      setTab('Login')
      setResetStep(1)
    } catch (err) { toast.error(err.response?.data?.message || 'Reset failed') }
  }

  const InputField = ({ label, name, type='text', form, placeholder }) => (
    <div>
      <label className="block text-zinc-400 font-[Barlow] text-sm font-medium mb-2">{label}</label>
      <input type={type} placeholder={placeholder} {...form.register(name)}
        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3.5 text-white font-[Barlow] text-sm placeholder-zinc-600 outline-none focus:border-[#E8000D] focus:ring-1 focus:ring-[#E8000D] transition-all" />
      {form.formState.errors[name] && <p className="text-[#E8000D] text-xs font-[Barlow] mt-1.5">{form.formState.errors[name].message}</p>}
    </div>
  )

  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <img src="/logo.png" alt="KickSphere" className="h-16 mx-auto mb-2 object-contain" onError={(e)=>{e.target.src='/Small_Logo.png'}} />
          <p className="text-zinc-400 font-[Barlow] text-sm mt-2">Your ultimate sneaker destination</p>
        </div>

        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          {/* Tabs */}
          <div className="flex gap-1 bg-zinc-950 rounded-xl p-1.5 mb-8">
            {tabs.map((t) => (
              <button key={t} onClick={() => { setTab(t); setOtpStep(false); setResetStep(1); setShowForgot(false) }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-[Barlow] font-semibold transition-all ${tab === t ? 'bg-[#E8000D] text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}>
                {t}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* LOGIN */}
            {tab === 'Login' && (
              <motion.div key="login" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}}>
                <div className="flex justify-center">
                  <GoogleLogin onSuccess={handleGoogleLogin} onError={() => toast.error('Google login failed')} theme="filled_black" shape="pill" text="continue_with" />
                </div>
                <div className="relative my-7">
                  <div className="border-t border-zinc-800" />
                  <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-zinc-900 px-4 text-zinc-500 text-xs font-[Barlow] font-semibold tracking-wider">OR</span>
                </div>
                {!showForgot ? (
                  <>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                      <InputField label="Email" name="email" type="email" form={loginForm} placeholder="you@email.com" />
                      <div>
                        <InputField label="Password" name="password" type="password" form={loginForm} placeholder="••••••••" />
                        <div className="flex justify-end mt-1.5">
                          <button type="button" onClick={() => setShowForgot(true)} className="text-[#E8000D] hover:text-[#FF1A1A] text-xs font-[Barlow] font-medium transition-colors">
                            Forgot Password?
                          </button>
                        </div>
                      </div>
                      <button type="submit" disabled={loginForm.formState.isSubmitting}
                        className="w-full bg-[#E8000D] hover:bg-[#FF1A1A] text-white font-[Barlow] font-bold text-lg tracking-wide py-4 rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-[#E8000D]/20">
                        {loginForm.formState.isSubmitting ? 'Logging in...' : 'LOGIN TO YOUR ACCOUNT'}
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    {resetStep === 1 ? (
                      <div key="forgot1">
                        <p className="text-[#A0A0A0] font-[Barlow] text-sm mb-5 text-center">Enter your email to receive a password reset OTP.</p>
                        <form onSubmit={resetForm.handleSubmit(handleResetStep1)} className="space-y-4">
                          <InputField label="Email" name="email" type="email" form={resetForm} placeholder="you@email.com" />
                          <button type="submit" disabled={resetForm.formState.isSubmitting}
                            className="w-full bg-[#E8000D] hover:bg-[#FF1A1A] text-white font-[Barlow] font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60">
                            {resetForm.formState.isSubmitting ? 'Sending...' : 'Send OTP'}
                          </button>
                          <button type="button" onClick={() => setShowForgot(false)} className="w-full text-center text-zinc-500 hover:text-zinc-400 font-[Barlow] text-xs mt-2 transition-colors">
                            Back to Login
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div key="forgot2">
                        <p className="text-[#A0A0A0] font-[Barlow] text-sm mb-5 text-center">OTP sent to <span className="text-white">{resetEmail}</span></p>
                        <form onSubmit={resetVerifyForm.handleSubmit(handleResetStep2)} className="space-y-4">
                          <InputField label="OTP" name="otp" form={resetVerifyForm} placeholder="123456" />
                          <InputField label="New Password" name="newPassword" type="password" form={resetVerifyForm} placeholder="••••••••" />
                          <button type="submit" disabled={resetVerifyForm.formState.isSubmitting}
                            className="w-full bg-[#E8000D] hover:bg-[#FF1A1A] text-white font-[Barlow] font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60">
                            {resetVerifyForm.formState.isSubmitting ? 'Resetting...' : 'Reset Password'}
                          </button>
                        </form>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* REGISTER */}
            {tab === 'Register' && !otpStep && (
              <motion.div key="register" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}}>
                <div className="flex justify-center">
                  <GoogleLogin onSuccess={handleGoogleLogin} onError={() => toast.error('Google login failed')} theme="filled_black" shape="pill" text="continue_with" />
                </div>
                <div className="relative my-7">
                  <div className="border-t border-zinc-800" />
                  <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-zinc-900 px-4 text-zinc-500 text-xs font-[Barlow] font-semibold tracking-wider">OR</span>
                </div>
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                  <InputField label="Full Name" name="name" form={registerForm} placeholder="John Doe" />
                  <InputField label="Email" name="email" type="email" form={registerForm} placeholder="you@email.com" />
                  <InputField label="Password" name="password" type="password" form={registerForm} placeholder="••••••••" />
                  <InputField label="Confirm Password" name="confirmPassword" type="password" form={registerForm} placeholder="••••••••" />
                  <button type="submit" disabled={registerForm.formState.isSubmitting}
                    className="w-full bg-[#E8000D] hover:bg-[#FF1A1A] text-white font-[Barlow] font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60">
                    {registerForm.formState.isSubmitting ? 'Creating account...' : 'Create Account'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* OTP */}
            {tab === 'Register' && otpStep && (
              <motion.div key="otp" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                <p className="text-[#A0A0A0] font-[Barlow] text-sm mb-5 text-center">We sent a 6-digit OTP to <span className="text-white">{regEmail}</span></p>
                <form onSubmit={otpForm.handleSubmit(handleOtp)} className="space-y-4">
                  <InputField label="6-Digit OTP" name="otp" form={otpForm} placeholder="123456" />
                  <button type="submit" disabled={otpForm.formState.isSubmitting}
                    className="w-full bg-[#E8000D] hover:bg-[#FF1A1A] text-white font-[Barlow] font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60">
                    {otpForm.formState.isSubmitting ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </form>
                <button onClick={() => api.post('/auth/otpgenerate', { email: regEmail }).then(() => toast.success('OTP resent!'))}
                  className="w-full text-center text-[#A0A0A0] hover:text-white font-[Barlow] text-sm mt-3 transition-colors">
                  Resend OTP
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
