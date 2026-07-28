export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Side: Testimonials */}
          <div className="w-full lg:w-1/2 space-y-6 relative z-10">
            {/* Review 1 */}
            <div className="bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-50 relative">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <img 
                    src="https://ui-avatars.com/api/?name=Silvia+Jenny&background=f1f5f9&color=333" 
                    alt="Silvia Jenny" 
                    className="w-12 h-12 rounded-full object-cover" 
                  />
                  <div className="font-bold text-sm text-gray-900">Silvia Jenny</div>
                </div>
                <div className="text-[#327a69] text-5xl opacity-80 font-serif leading-none absolute top-6 right-6">"</div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                Lorem ipsum aktiga syressa ogong i delig intrast. Nänämäsk ilingar, surdegshotell ares. Bloggbavning trigt, berek, innan pansexuell, mabil klubb. Misa agnostigram. Tis senade banade treskapet inklusive krod.
              </p>
            </div>
            
            {/* Review 2 */}
            <div className="bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-50 relative ml-0 lg:ml-12">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <img 
                    src="https://ui-avatars.com/api/?name=Jonathan+Rick&background=f1f5f9&color=333" 
                    alt="Jonathan Rick" 
                    className="w-12 h-12 rounded-full object-cover" 
                  />
                  <div className="font-bold text-sm text-gray-900">Jonathan Rick</div>
                </div>
                <div className="text-[#327a69] text-5xl opacity-80 font-serif leading-none absolute top-6 right-6">"</div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                Euronat näd i mytagen kågäbel om än lasigförsamhet. Dasade poras komins. Dangen nytus jäoligt spebud. Surs auriosk lagöd krympfation inle nypat. Bilsurfa.
              </p>
            </div>
          </div>

          {/* Right Side: Text & Circular Elements */}
          <div className="w-full lg:w-1/2 relative min-h-[400px] flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#113a30] uppercase tracking-wider mb-6 leading-[1.1]">
              TRUST OUR<br/>CUSTOMER
            </h2>
            <p className="text-[15px] font-semibold text-gray-800 max-w-sm mb-10 leading-relaxed">
              Our customers are happy in our service. As so, they have left some valuable testimonial for you to verify
            </p>
            
            <div>
              <button className="bg-[#1c4b40] text-white px-8 py-3.5 rounded-full text-sm font-bold hover:bg-[#113028] transition-colors shadow-lg shadow-[#1c4b40]/20 tracking-wide">
                See all
              </button>
            </div>

            {/* Decorative background semi-circles overlay */}
            <div className="absolute -bottom-20 -right-20 pointer-events-none opacity-40">
              <div className="w-96 h-96 border-[40px] border-[#edf3f1] rounded-full relative">
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-[40px] border-[#dae8e4] rounded-full"></div>
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 text-center mt-2 h-8 bg-[#de8d54] rounded-full shadow-md z-20 translate-x-[60px] -translate-y-[80px]"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}