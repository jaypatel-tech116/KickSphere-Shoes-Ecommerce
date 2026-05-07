import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useCartStore } from '../stores/cartStore'
import { usePlaceOrder, usePlaceRazorpayOrder, useVerifyRazorpay } from '../hooks/useOrders'

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Invalid phone'),
  address1: z.string().min(5, 'Required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'Required'),
  state: z.string().min(1, 'Required'),
  pincode: z.string().min(6, 'Invalid pincode').max(6),
})

function formatPrice(p) { return `₹${Number(p).toLocaleString('en-IN')}` }

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.querySelector('script[src*="razorpay"]')) { resolve(true); return }
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

export default function Checkout() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)
  const [payMethod, setPayMethod] = useState('COD')
  const [verifying, setVerifying] = useState(false)
  const placeOrder = usePlaceOrder()
  const placeRazorpay = usePlaceRazorpayOrder()
  const verifyRazorpay = useVerifyRazorpay()
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  useEffect(() => { document.title = 'Checkout | KickSphere' }, [])
  useEffect(() => { if (items.length === 0) navigate('/cart') }, [items, navigate])

  const subtotal = items.reduce((acc, i) => acc + (i.price || 0) * i.quantity, 0)
  const shipping = subtotal >= 999 ? 0 : 99
  const total = subtotal + shipping

  const buildAddress = (data) => ({
    firstName: data.firstName, lastName: data.lastName,
    email: data.email, phone: data.phone,
    street: data.address1 + (data.address2 ? `, ${data.address2}` : ''),
    city: data.city, state: data.state, zipcode: data.pincode, country: 'India',
  })

  const onSubmit = async (data) => {
    const address = buildAddress(data)
    const orderItems = items.map((i) => ({ productId: i.itemId, name: i.name, size: i.size, color: i.color, quantity: i.quantity, price: i.price }))
    if (payMethod === 'COD') {
      try {
        await placeOrder.mutateAsync({ items: orderItems, amount: total, address })
        toast.success('Order placed successfully!')
        clearCart()
        navigate('/orders')
      } catch (err) { toast.error(err.response?.data?.message || 'Order failed') }
    } else {
      const loaded = await loadRazorpayScript()
      if (!loaded) { toast.error('Razorpay SDK failed to load'); return }
      try {
        const { data: orderData } = await placeRazorpay.mutateAsync({ items: orderItems, amount: total, address })
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: 'INR',
          name: 'KickSphere',
          order_id: orderData.id || orderData.order_id,
          handler: async (response) => {
            setVerifying(true)
            try {
              await verifyRazorpay.mutateAsync(response)
              toast.success('Payment successful!')
              clearCart()
              navigate('/orders')
            } catch {
              toast.error('Payment verification failed')
            } finally {
              setVerifying(false)
            }
          },
          modal: {
            ondismiss: () => {
              // User closed the Razorpay popup — do nothing, no order was created
              toast('Payment cancelled. No order was placed.', { icon: '⚠️' })
            }
          },
          prefill: { name: `${data.firstName} ${data.lastName}`, email: data.email, contact: data.phone },
          theme: { color: '#E8000D' },
        }
        new window.Razorpay(options).open()
      } catch (err) { toast.error(err.response?.data?.message || 'Payment failed') }
    }
  }

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-[Bebas_Neue] text-4xl text-white tracking-wide mb-8">CHECKOUT</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Address */}
              <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-6">
                <h2 className="font-[Bebas_Neue] text-xl text-white tracking-wide mb-5">DELIVERY ADDRESS</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'First Name', name: 'firstName', placeholder: 'John', half: true },
                    { label: 'Last Name', name: 'lastName', placeholder: 'Doe', half: true },
                    { label: 'Email', name: 'email', placeholder: 'john@email.com' },
                    { label: 'Phone', name: 'phone', placeholder: '9876543210' },
                    { label: 'Address Line 1', name: 'address1', placeholder: 'House/Flat, Street' },
                    { label: 'Address Line 2 (Optional)', name: 'address2', placeholder: 'Landmark, Area' },
                    { label: 'City', name: 'city', placeholder: 'Mumbai', half: true },
                    { label: 'State', name: 'state', placeholder: 'Maharashtra', half: true },
                    { label: 'Pincode', name: 'pincode', placeholder: '400001' },
                  ].map((f) => (
                    <div key={f.name} className={f.half ? '' : 'col-span-2'}>
                      <label className="block text-[#A0A0A0] font-[Barlow] text-sm mb-1.5">{f.label}</label>
                      <input {...register(f.name)} placeholder={f.placeholder}
                        className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl px-4 py-3 text-white font-[Barlow] text-sm placeholder-[#A0A0A0] outline-none focus:border-[#E8000D] transition-colors" />
                      {errors[f.name] && <p className="text-[#E8000D] text-xs mt-1 font-[Barlow]">{errors[f.name].message}</p>}
                    </div>
                  ))}
                </div>
              </div>
              {/* Payment */}
              <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-6">
                <h2 className="font-[Bebas_Neue] text-xl text-white tracking-wide mb-5">PAYMENT METHOD</h2>
                <div className="space-y-3">
                  {[['COD','Cash on Delivery','Pay when your order arrives'],['Razorpay','Pay Online (Razorpay)','UPI, Cards, Net Banking & more']].map(([val,title,sub]) => (
                    <label key={val} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payMethod === val ? 'border-[#E8000D] bg-[#E8000D]/5' : 'border-[#1F1F1F] hover:border-[#E8000D]/40'}`}>
                      <input type="radio" value={val} checked={payMethod === val} onChange={() => setPayMethod(val)} className="hidden" />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${payMethod === val ? 'border-[#E8000D]' : 'border-[#1F1F1F]'}`}>
                        {payMethod === val && <div className="w-2 h-2 bg-[#E8000D] rounded-full" />}
                      </div>
                      <div>
                        <p className="text-white font-semibold font-[Barlow] text-sm">{title}</p>
                        <p className="text-[#A0A0A0] font-[Barlow] text-xs">{sub}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            {/* Summary */}
            <div>
              <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-6 sticky top-24">
                <h2 className="font-[Bebas_Neue] text-xl text-white tracking-wide mb-5">ORDER SUMMARY</h2>
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div key={`${item.itemId}-${item.size}`} className="flex gap-3 items-center">
                      <div className="w-12 h-12 bg-[#0A0A0A] rounded-lg overflow-hidden flex-none">
                        <img src={item.image || '/Small_Logo.png'} alt="" className="w-full h-full object-cover" onError={(e) => e.target.src='/Small_Logo.png'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-[Barlow] font-semibold line-clamp-1">{item.name || 'Product'}</p>
                        <p className="text-[#A0A0A0] text-xs font-[Barlow]">S:{item.size} · Qty:{item.quantity}</p>
                      </div>
                      <span className="text-white text-xs font-bold font-[Barlow]">{formatPrice((item.price||0)*item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 border-t border-[#1F1F1F] pt-4 mb-5">
                  <div className="flex justify-between text-[#A0A0A0] font-[Barlow] text-sm">
                    <span>Subtotal</span><span className="text-white">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#A0A0A0] font-[Barlow] text-sm">
                    <span>Shipping</span>
                    <span className={shipping===0?'text-green-400 font-semibold':'text-white'}>{shipping===0?'FREE':formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-[#1F1F1F] pt-2">
                    <span className="text-white font-[Barlow]">Total</span>
                    <span className="text-white font-[Barlow] text-xl">{formatPrice(total)}</span>
                  </div>
                </div>
                <motion.button type="submit" whileTap={{scale:0.97}}
                  disabled={placeOrder.isPending || placeRazorpay.isPending || verifying}
                  className="w-full bg-[#E8000D] hover:bg-[#FF1A1A] text-white font-[Barlow] font-bold py-4 rounded-xl transition-colors disabled:opacity-60 glow-red-sm">
                  {verifying
                    ? 'Verifying Payment...'
                    : (placeOrder.isPending || placeRazorpay.isPending)
                    ? 'Processing...'
                    : payMethod === 'COD'
                    ? 'Place Order (COD)'
                    : `Pay ${formatPrice(total)}`
                  }
                </motion.button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
