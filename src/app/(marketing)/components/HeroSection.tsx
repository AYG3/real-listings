import Link from "next/link";
import { ChevronDown } from "lucide-react";
import Navbar from "./Navbar";

export default function HeroSection() {
  return (
    <div className="w-full font-sans">
      <Navbar/>
      {/* Hero Content */}
      <section className="relative w-full min-h-[600px] flex items-center justify-center px-4 py-20 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2075')" }}>
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="relative z-10 w-full max-w-[900px] bg-[#f2f1ef]/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl mt-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Find Your Perfect Property.
          </h1>
          <p className="text-gray-600 text-base md:text-lg mb-8 font-medium">
            Discover verified houses, apartments and land across Nigeria.
          </p>

          <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-sm border border-gray-100 p-2 gap-2 mb-8 content-stretch">
            <div className="flex-1 px-4 py-2 md:border-r border-gray-100">
              <label className="block text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-1">
                Location
              </label>
              <input 
                type="text" 
                placeholder="City, Neighborhood" 
                className="w-full text-sm outline-none text-gray-600 bg-transparent placeholder:text-gray-400" 
              />
            </div>
            
            <div className="flex-1 px-4 py-2 md:border-r border-gray-100 flex justify-between items-center cursor-pointer">
              <div>
                <label className="block text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-1">
                  Property Type
                </label>
                <div className="text-sm text-gray-600 font-medium">Any Type</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>

            <div className="flex-1 px-4 py-2 flex justify-between items-center cursor-pointer">
              <div>
                <label className="block text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-1">
                  Price Range
                </label>
                <div className="text-sm text-gray-600 font-medium">Any Price</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>

            <button className="bg-[#cca43b] hover:bg-[#b58e2a] text-white px-8 py-3 rounded-lg font-semibold transition-colors mt-2 md:mt-0">
              Search
            </button>
          </div>

          <div className="flex gap-8 md:gap-16 pt-2">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-[#114b3d]">1500+</div>
              <div className="text-[11px] font-semibold text-gray-500 uppercase mt-1">Properties</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-[#114b3d]">200+</div>
              <div className="text-[11px] font-semibold text-gray-500 uppercase mt-1">Verified Agents</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-[#114b3d]">25+</div>
              <div className="text-[11px] font-semibold text-gray-500 uppercase mt-1">Cities</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}