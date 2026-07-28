import { Heart, MapPin, BedDouble, Bath, Square } from 'lucide-react';

export default function FeaturedPropertiesSection() {
  const properties = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
      tag: "For Sale",
      price: "₦150,000,000",
      title: "Ikoyi Luxury Villa",
      location: "Ikoyi, Lagos",
      beds: 4,
      baths: 5,
      sqft: "4,500"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
      tag: "For Rent",
      price: "₦5,000,000 / yr",
      title: "Victoria Island Penthouse",
      location: "Victoria Island, Lagos",
      beds: 3,
      baths: 3.5,
      sqft: "2,800"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800",
      tag: "For Sale",
      price: "₦85,000,000",
      title: "Maitama Executive Home",
      location: "Maitama, Abuja",
      beds: 5,
      baths: 6,
      sqft: "6,000"
    }
  ];

  return (
    <section className="py-20 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Featured Properties
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {properties.map((prop) => (
            <div key={prop.id} className="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col">
              <div className="relative h-60">
                <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-[#114b3d] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                  {prop.tag}
                </div>
                <button className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md rounded-full hover:bg-black/30 transition shadow-sm">
                  <Heart className="w-4 h-4 text-white" strokeWidth={2.5} />
                </button>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="text-2xl font-bold text-gray-900 mb-1">{prop.price}</div>
                <h3 className="text-[17px] font-bold text-gray-800 mb-2">{prop.title}</h3>
                
                <div className="flex items-center text-gray-500 text-sm mb-6 font-medium">
                  <MapPin className="w-4 h-4 mr-1.5" />
                  {prop.location}
                </div>
                
                <div className="flex items-center justify-between text-gray-600 text-sm mb-6 font-medium">
                  <div className="flex items-center"><BedDouble className="w-4 h-4 mr-2"/> {prop.beds} Beds</div>
                  <div className="flex items-center"><Bath className="w-4 h-4 mr-2"/> {prop.baths} Baths</div>
                  <div className="flex items-center"><Square className="w-4 h-4 mr-2"/> {prop.sqft} sqft</div>
                </div>
                
                <div className="mt-auto">
                  <button className="w-full py-3 text-sm font-bold text-gray-800 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}