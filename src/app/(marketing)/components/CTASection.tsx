import { ChevronRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-16 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between mt-12 gap-12 lg:gap-0">
          
          {/* Left Text */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 uppercase tracking-tight mb-4">
              NOT SURE YET?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 font-medium">
              Let us help you out
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button className="w-full sm:w-auto bg-[#1c4b40] text-white px-8 py-3.5 rounded-full text-sm font-bold hover:bg-[#113028] transition-colors flex items-center justify-center gap-2">
                Request a quote <ChevronRight className="w-4 h-4" strokeWidth={3} />
              </button>
              
              <span className="text-[13px] font-bold text-gray-400 uppercase">or</span>
              
              <button className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 px-8 py-3.5 rounded-full text-sm font-bold hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center gap-2">
                See catalogue <ChevronRight className="w-4 h-4" strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Right Mock Skyscraper Image Area */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end pr-0 lg:pr-16 relative">
            <div className="relative">
              <div className="w-48 sm:w-64 h-[280px] sm:h-[350px] bg-sky-50 rounded-t-full border-[10px] border-white shadow-2xl overflow-hidden relative z-10 flex border-b-0 justify-center pb-0">
                {/* Simplified Building Graphic representing the image */}
                <div className="absolute bottom-0 w-3/4 h-[80%] bg-[#1c4b40] rounded-t-lg mx-auto flex gap-1 p-2">
                  <div className="flex-1 bg-white/20 h-full rounded-sm"></div>
                  <div className="flex-1 bg-white/20 h-full mt-4 rounded-sm"></div>
                  <div className="flex-1 bg-white/20 h-full mt-2 rounded-sm"></div>
                  <div className="flex-1 bg-white/20 h-[80%] rounded-sm"></div>
                </div>
              </div>
              
              {/* Decorative circle matching design */}
              <div className="absolute top-1/4 -right-8 w-24 h-24 rounded-full border-[6px] border-[#de8d54] z-0"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}