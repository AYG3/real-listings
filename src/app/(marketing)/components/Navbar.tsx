
import Link from 'next/link'
import { Search, Heart } from 'lucide-react'

export default function Navbar() {
  return (
    <div className="w-full font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
        <div className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight uppercase">
          ALARA ESTATE
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
          <Link href="#" className="text-gray-900 border-b-2 border-gray-900 pb-1 -mb-1">Home</Link>
          <Link href="/buy" className="hover:text-gray-900 transition-colors">Buy</Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">Rent</Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">Land</Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">Agents</Link>
        </div>
        <div className="flex items-center gap-6">
          <Search className="w-5 h-5 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors hidden sm:block" />
          <Heart className="w-5 h-5 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors hidden sm:block" />
          <div className="flex items-center gap-3">
            <Link className="px-5 py-2 text-sm font-semibold border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700"
            href='/signup'
            >
              Sign In
            </Link>
            <button className="px-5 py-2 text-sm font-semibold bg-[#114b3d] text-white rounded-md hover:bg-[#0d3b2f] transition-colors">
              List Property
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

