import { ArrowRight, MapPin } from 'lucide-react';

export default function BestDealsSection() {
  const deals = [
    { 
      id: 1, 
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600", 
      price: "$1000", 
      sqft: "1000sq", 
      bed: "3 Bed", 
      bath: "2 Bath", 
      location: "123 Street, NY" 
    },
    { 
      id: 2, 
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=600", 
      price: "$1500", 
      sqft: "1250sq", 
      bed: "4 Bed", 
      bath: "3 Bath", 
      location: "51 Street, NY" 
    },
    { 
      id: 3, 
      image: "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&q=80&w=600", 
      price: "$500", 
      sqft: "900sq", 
      bed: "2 Bed", 
      bath: "2 Bath", 
      location: "93 Street, NY" 
    },
    { 
      id: 4, 
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600", 
      price: "$2000", 
      sqft: "2500sq", 
      bed: "5 Bed", 
      bath: "5 Bath", 
      location: "111 Street, NY" 
    },
  ];

  return (
    <section className="py-20 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12 border-b border-gray-200 pb-4">
          <h2 className="text-[28px] md:text-3xl font-bold text-gray-900 uppercase tracking-wide">
            BEST DEAL FOR YOU
          </h2>
          <a href="#" className="flex items-center text-[13px] font-bold text-[#1c6454] hover:text-[#114b3d] transition-colors uppercase tracking-wider">
            View all <ArrowRight className="w-4 h-4 ml-1.5" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {deals.map(deal => (
            <div key={deal.id} className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] pb-4 flex flex-col group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
              <div className="relative mb-5 overflow-hidden">
                <img 
                  src={deal.image} 
                  alt="Room View" 
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute bottom-0 left-0 bg-white px-4 py-2 text-lg font-bold text-gray-900">
                  {deal.price}
                </div>
              </div>
              
              <div className="px-5">
                <div className="flex gap-4 text-[13px] font-semibold text-gray-400 mb-3 border-b border-gray-100 pb-3">
                  <span>{deal.sqft}</span>
                  <span>{deal.bed}</span>
                  <span>{deal.bath}</span>
                </div>
                <div className="flex items-center text-[13px] font-medium text-gray-500">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 opacity-70" /> 
                  {deal.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}