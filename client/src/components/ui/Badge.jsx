const statusColors = {
  'Order Placed': 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
  'Packing': 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
  'Shipped': 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
  'Out for delivery': 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
  'Delivered': 'bg-green-500/10 text-green-400 border border-green-500/30',
  'Cancelled': 'bg-red-500/10 text-red-400 border border-red-500/30',
  'Paid': 'bg-green-500/10 text-green-400 border border-green-500/30',
  'Pending': 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
}

export default function Badge({ text, className = '' }) {
  const colorClass = statusColors[text] || 'bg-gray-500/10 text-gray-400 border border-gray-500/30'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-[Barlow] ${colorClass} ${className}`}>
      {text}
    </span>
  )
}
