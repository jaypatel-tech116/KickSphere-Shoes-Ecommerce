import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Search, X, Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import api from '../lib/axios'

const productSchema = z.object({
  name: z.string().min(2),
  brand: z.string().min(1),
  description: z.string().min(10),
  price: z.coerce.number().min(1),
  category: z.enum(['Men', 'Women', 'Kids', 'Unisex']),
  subcategory: z.enum(['Sneakers', 'Formal', 'Sports', 'Casual', 'Boots']),
  material: z.string().optional(),
  sole: z.string().optional(),
  closure: z.string().optional(),
  bestseller: z.boolean().optional(),
})

const SIZES = [6, 7, 8, 9, 10, 11]
const PAGE_SIZE = 10

function formatPrice(p) { return `₹${Number(p).toLocaleString('en-IN')}` }

function ImageDropzone({ label, file, onDrop, required }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => onDrop(files[0]),
    accept: { 'image/*': [] },
    maxFiles: 1,
  })
  return (
    <div>
      <p className="text-[#A0A0A0] font-[Barlow] text-xs mb-1">{label}{required && <span className="text-[#E8000D]">*</span>}</p>
      <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${isDragActive ? 'border-[#E8000D] bg-[#E8000D]/5' : 'border-[#1F1F1F] hover:border-[#E8000D]/50'}`}>
        <input {...getInputProps()} />
        {file ? (
          <div className="relative">
            <img src={typeof file === 'string' ? file : URL.createObjectURL(file)} alt="" className="w-full h-24 object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Upload size={16} className="text-white" />
            </div>
          </div>
        ) : (
          <div className="h-24 flex flex-col items-center justify-center gap-1">
            <Upload size={18} className="text-[#A0A0A0]" />
            <p className="text-[#A0A0A0] font-[Barlow] text-xs">Drop or click</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Products() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [images, setImages] = useState({ image1: null, image2: null, image3: null, image4: null })
  const [stockMap, setStockMap] = useState({})
  const [colors, setColors] = useState([])
  const [colorInput, setColorInput] = useState('')

  useEffect(() => { document.title = 'Products | KickSphere Admin' }, [])

  const { data, isLoading } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: async () => { const res = await api.get('/product/listproduct'); return res.data },
  })

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { bestseller: false },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/product/removeproduct/${id}`),
    onSuccess: () => { toast.success('Product deleted'); queryClient.invalidateQueries({ queryKey: ['adminProducts'] }); setDeleteTarget(null) },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed'),
  })

  const openAddForm = () => {
    setEditing(null)
    reset({ bestseller: false })
    setImages({ image1: null, image2: null, image3: null, image4: null })
    setStockMap({})
    setColors([])
    setShowForm(true)
  }

  const openEditForm = (product) => {
    setEditing(product)
    reset({
      name: product.name, brand: product.brand, description: product.description,
      price: product.price, category: product.category, subcategory: product.subcategory,
      material: product.material, sole: product.sole, closure: product.closure,
      bestseller: product.bestseller || false,
    })
    setImages({ image1: product.image1 || null, image2: product.image2 || null, image3: product.image3 || null, image4: product.image4 || null })
    setStockMap(product.numberofproducts || {})
    setColors(product.colors || [])
    setShowForm(true)
  }

  const onSubmit = async (data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([k, v]) => formData.append(k, v))
    formData.append('sizes', JSON.stringify(Object.keys(stockMap).map(Number)))
    formData.append('numberofproducts', JSON.stringify(stockMap))
    formData.append('colors', JSON.stringify(colors))
    if (images.image1 instanceof File) formData.append('image1', images.image1)
    if (images.image2 instanceof File) formData.append('image2', images.image2)
    if (images.image3 instanceof File) formData.append('image3', images.image3)
    if (images.image4 instanceof File) formData.append('image4', images.image4)
    try {
      if (editing) {
        await api.put(`/product/updateproduct/${editing._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Product updated!')
      } else {
        await api.post('/product/addproduct', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Product added!')
      }
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] })
      setShowForm(false)
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed') }
  }

  const allProducts = data?.products || []
  const filtered = search ? allProducts.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase())) : allProducts
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const displayed = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="admin-page-container">
      <div className="flex items-center justify-between mb-5 gap-3">
        <div>
          <h1 className="font-[Bebas_Neue] text-3xl sm:text-4xl text-white tracking-wide">PRODUCTS</h1>
          <p className="text-[#A0A0A0] font-[Barlow] text-sm">{filtered.length} products</p>
        </div>
        <button onClick={openAddForm} className="bg-[#E8000D] hover:bg-[#FF1A1A] text-white font-[Barlow] font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl flex items-center gap-2 transition-colors text-sm flex-shrink-0">
          <Plus size={16} /> <span className="hidden sm:inline">Add Product</span><span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0A0]" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search products..."
          className="w-full bg-[#111] border border-[#1F1F1F] rounded-xl pl-9 pr-4 py-2.5 text-white font-[Barlow] text-sm placeholder-[#A0A0A0] outline-none focus:border-[#E8000D] transition-colors" />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-[#111] border border-[#1F1F1F] rounded-2xl overflow-hidden">
        <div className="responsive-table-container">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-[#1F1F1F]">
                {['Image','Name','Brand','Category','Price','Stock','Rating','',''].map((h,i) => (
                  <th key={i} className={`text-left px-4 py-3 text-[#A0A0A0] font-[Barlow] text-xs uppercase tracking-wider ${(i===2||i===3)?'hide-on-tablet':''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? Array.from({length:5}).map((_,i) => (
                <tr key={i} className="border-b border-[#1F1F1F]/50">
                  {Array.from({length:9}).map((_,j) => <td key={j} className={`px-4 py-3 ${(j===2||j===3)?'hide-on-tablet':''}`}><div className="skeleton h-4 rounded" /></td>)}
                </tr>
              )) : displayed.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-10 text-[#A0A0A0] font-[Barlow] text-sm">No products found</td></tr>
              ) : displayed.map((product) => (
                <tr key={product._id} className="border-b border-[#1F1F1F]/50 hover:bg-[#1F1F1F]/30 transition-colors">
                  <td className="px-4 py-3"><div className="w-10 h-10 bg-[#0A0A0A] rounded-lg overflow-hidden"><img src={product.image1} alt="" className="w-full h-full object-cover" onError={(e)=>{e.target.src='/Small_Logo.png';e.target.className='w-full h-full object-contain p-2 opacity-30'}} /></div></td>
                  <td className="px-4 py-3 text-white font-[Barlow] text-sm font-semibold max-w-[150px]"><p className="truncate">{product.name}</p>{product.bestseller&&<span className="text-[9px] bg-[#E8000D] text-white px-1.5 py-0.5 rounded font-semibold uppercase">Best</span>}</td>
                  <td className="px-4 py-3 text-[#A0A0A0] font-[Barlow] text-sm hide-on-tablet">{product.brand}</td>
                  <td className="px-4 py-3 text-[#A0A0A0] font-[Barlow] text-sm hide-on-tablet">{product.category}</td>
                  <td className="px-4 py-3 text-white font-[Barlow] text-sm font-semibold whitespace-nowrap">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3 text-[#A0A0A0] font-[Barlow] text-sm">{Object.values(product.numberofproducts||{}).reduce((a,b)=>a+Number(b),0)}</td>
                  <td className="px-4 py-3 text-[#A0A0A0] font-[Barlow] text-sm whitespace-nowrap">{(product.avgrating||0).toFixed(1)} ★</td>
                  <td className="px-4 py-3"><button onClick={()=>openEditForm(product)} className="text-[#A0A0A0] hover:text-white transition-colors p-1.5"><Pencil size={14} /></button></td>
                  <td className="px-4 py-3"><button onClick={()=>setDeleteTarget(product)} className="text-[#A0A0A0] hover:text-[#E8000D] transition-colors p-1.5"><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex flex-wrap gap-1.5 p-4 border-t border-[#1F1F1F]">
            {Array.from({length:totalPages}).map((_,i) => (
              <button key={i} onClick={()=>setPage(i+1)} className={`w-8 h-8 rounded-lg text-xs font-[Barlow] font-semibold transition-all ${page===i+1?'bg-[#E8000D] text-white':'bg-[#0A0A0A] text-[#A0A0A0] hover:text-white border border-[#1F1F1F]'}`}>{i+1}</button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {isLoading ? Array.from({length:4}).map((_,i)=><div key={i} className="skeleton h-24 rounded-2xl" />) :
        displayed.length===0 ? <div className="text-center py-10 text-[#A0A0A0] font-[Barlow] text-sm">No products found</div> :
        displayed.map((product) => (
          <div key={product._id} className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-3 flex gap-3 items-center">
            <div className="w-16 h-16 bg-[#0A0A0A] rounded-xl overflow-hidden flex-none">
              <img src={product.image1} alt="" className="w-full h-full object-cover" onError={(e)=>{e.target.src='/Small_Logo.png';e.target.className='w-full h-full object-contain p-2 opacity-30'}} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-white font-[Barlow] font-semibold text-sm truncate">{product.name}</p>
                  <p className="text-[#A0A0A0] font-[Barlow] text-xs">{product.brand} · {product.category}</p>
                </div>
                <div className="flex gap-0.5 flex-shrink-0">
                  <button onClick={()=>openEditForm(product)} className="text-[#A0A0A0] hover:text-white p-1.5 transition-colors"><Pencil size={13} /></button>
                  <button onClick={()=>setDeleteTarget(product)} className="text-[#A0A0A0] hover:text-[#E8000D] p-1.5 transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white font-[Barlow] font-bold text-sm">{formatPrice(product.price)}</span>
                <span className="text-[#A0A0A0] font-[Barlow] text-xs">Stock: {Object.values(product.numberofproducts||{}).reduce((a,b)=>a+Number(b),0)}</span>
                {product.bestseller&&<span className="text-[9px] bg-[#E8000D] text-white px-1.5 py-0.5 rounded font-semibold uppercase">Best</span>}
              </div>
            </div>
          </div>
        ))}
        {!isLoading && totalPages>1 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {Array.from({length:totalPages}).map((_,i)=>(
              <button key={i} onClick={()=>setPage(i+1)} className={`w-8 h-8 rounded-lg text-xs font-[Barlow] font-semibold transition-all ${page===i+1?'bg-[#E8000D] text-white':'bg-[#0A0A0A] text-[#A0A0A0] hover:text-white border border-[#1F1F1F]'}`}>{i+1}</button>
            ))}
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setShowForm(false)} className="fixed inset-0 bg-black/80 z-40" />
            <motion.div
              initial={{opacity:0, scale:0.95, y:20}} animate={{opacity:1, scale:1, y:0}} exit={{opacity:0, scale:0.95, y:20}}
              className="fixed inset-4 md:inset-8 bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-[Bebas_Neue] text-2xl text-white tracking-wide">{editing ? 'EDIT PRODUCT' : 'ADD PRODUCT'}</h2>
                  <button onClick={() => setShowForm(false)} className="text-[#A0A0A0] hover:text-white transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Images */}
                  <div>
                    <p className="font-[Bebas_Neue] text-white text-lg tracking-wide mb-3">PRODUCT IMAGES</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['image1','image2','image3','image4'].map((k, i) => (
                        <ImageDropzone key={k} label={`Image ${i+1}`} required={i===0} file={images[k]} onDrop={(f) => setImages((prev) => ({...prev, [k]: f}))} />
                      ))}
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[{name:'name',label:'Product Name'},{name:'brand',label:'Brand'},{name:'price',label:'Price (₹)',type:'number'},{name:'material',label:'Material'},{name:'sole',label:'Sole'},{name:'closure',label:'Closure'}].map((f) => (
                      <div key={f.name}>
                        <label className="block text-[#A0A0A0] font-[Barlow] text-sm mb-1.5">{f.label}</label>
                        <input type={f.type||'text'} {...register(f.name)}
                          className="w-full bg-[#111] border border-[#1F1F1F] rounded-xl px-4 py-2.5 text-white font-[Barlow] text-sm placeholder-[#A0A0A0] outline-none focus:border-[#E8000D] transition-colors" />
                        {errors[f.name] && <p className="text-[#E8000D] text-xs mt-1 font-[Barlow]">{errors[f.name].message}</p>}
                      </div>
                    ))}
                    <div className="md:col-span-2">
                      <label className="block text-[#A0A0A0] font-[Barlow] text-sm mb-1.5">Description</label>
                      <textarea {...register('description')} rows={3}
                        className="w-full bg-[#111] border border-[#1F1F1F] rounded-xl px-4 py-2.5 text-white font-[Barlow] text-sm placeholder-[#A0A0A0] outline-none focus:border-[#E8000D] transition-colors resize-none" />
                      {errors.description && <p className="text-[#E8000D] text-xs mt-1 font-[Barlow]">{errors.description.message}</p>}
                    </div>
                    <div>
                      <label className="block text-[#A0A0A0] font-[Barlow] text-sm mb-1.5">Category</label>
                      <select {...register('category')} className="w-full bg-[#111] border border-[#1F1F1F] rounded-xl px-4 py-2.5 text-white font-[Barlow] text-sm outline-none focus:border-[#E8000D] transition-colors">
                        {['Men','Women','Kids','Unisex'].map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#A0A0A0] font-[Barlow] text-sm mb-1.5">Subcategory</label>
                      <select {...register('subcategory')} className="w-full bg-[#111] border border-[#1F1F1F] rounded-xl px-4 py-2.5 text-white font-[Barlow] text-sm outline-none focus:border-[#E8000D] transition-colors">
                        {['Sneakers','Formal','Sports','Casual','Boots'].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Bestseller */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" {...register('bestseller')} className="w-4 h-4 accent-[#E8000D]" />
                    <span className="text-white font-[Barlow] text-sm font-semibold">Mark as Bestseller</span>
                  </label>

                  {/* Stock per size */}
                  <div>
                    <p className="font-[Bebas_Neue] text-white text-lg tracking-wide mb-3">STOCK PER SIZE</p>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {SIZES.map((size) => (
                        <div key={size}>
                          <label className="block text-[#A0A0A0] font-[Barlow] text-xs mb-1">UK {size}</label>
                          <input type="number" min={0} value={stockMap[size] || ''} onChange={(e) => setStockMap((prev) => ({...prev, [size]: Number(e.target.value)}))}
                            className="w-full bg-[#111] border border-[#1F1F1F] rounded-xl px-3 py-2 text-white font-[Barlow] text-sm outline-none focus:border-[#E8000D] transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <p className="font-[Bebas_Neue] text-white text-lg tracking-wide mb-3">COLORS</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {colors.map((c) => (
                        <span key={c} className="flex items-center gap-1.5 bg-[#111] border border-[#1F1F1F] rounded-full px-3 py-1">
                          <div className="w-3 h-3 rounded-full border border-[#1F1F1F]" style={{backgroundColor:c}} />
                          <span className="text-white font-[Barlow] text-xs capitalize">{c}</span>
                          <button type="button" onClick={() => setColors(colors.filter((x) => x !== c))} className="text-[#A0A0A0] hover:text-[#E8000D] transition-colors ml-1"><X size={10} /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input value={colorInput} onChange={(e) => setColorInput(e.target.value)} placeholder="Add color (e.g. red)"
                        className="flex-1 bg-[#111] border border-[#1F1F1F] rounded-xl px-4 py-2 text-white font-[Barlow] text-sm placeholder-[#A0A0A0] outline-none focus:border-[#E8000D] transition-colors max-w-xs" />
                      <button type="button" onClick={() => { if (colorInput.trim() && !colors.includes(colorInput.trim())) { setColors([...colors, colorInput.trim().toLowerCase()]); setColorInput('') }}}
                        className="bg-[#E8000D] hover:bg-[#FF1A1A] text-white font-[Barlow] text-sm px-4 py-2 rounded-xl transition-colors">Add</button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-[#1F1F1F] hover:border-[#E8000D] text-[#A0A0A0] hover:text-white font-[Barlow] font-semibold py-3 rounded-xl transition-all">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#E8000D] hover:bg-[#FF1A1A] text-white font-[Barlow] font-bold py-3 rounded-xl transition-colors disabled:opacity-60">
                      {isSubmitting ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setDeleteTarget(null)} className="fixed inset-0 bg-black/80 z-50" />
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
              className="fixed inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-96 top-1/2 -translate-y-1/2 bg-[#111] border border-[#1F1F1F] rounded-2xl p-6 z-50">
              <h3 className="font-[Bebas_Neue] text-xl text-white tracking-wide mb-2">DELETE PRODUCT</h3>
              <p className="text-[#A0A0A0] font-[Barlow] text-sm mb-5">Are you sure you want to delete <span className="text-white">{deleteTarget.name}</span>? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 border border-[#1F1F1F] text-[#A0A0A0] hover:text-white font-[Barlow] py-2.5 rounded-xl transition-all">Cancel</button>
                <button onClick={() => deleteMutation.mutate(deleteTarget._id)} disabled={deleteMutation.isPending} className="flex-1 bg-[#E8000D] text-white font-[Barlow] font-semibold py-2.5 rounded-xl disabled:opacity-60">
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
