export default function ServicesSection() {
  const services = [
    { 
      id: '01', 
      title: 'RESIDENTIAL SALES', 
      desc: 'Connect with a lender to see if a lower interest rate can save you money on your mortgage. Refinancing also gives you the opportunity to take cash out depending on how much equity you have built into your home.' 
    },
    { 
      id: '02', 
      title: 'RENTAL SERVICES', 
      desc: 'The room rental agreement. This type of contract outlines the rules and responsibilities required of the tenant and landlord who will be sharing a space together.' 
    },
    { 
      id: '03', 
      title: 'OFF MARKET SALES', 
      desc: 'Find out how your home measures up with homes that are for sale or recently sold. Compare market value, listing price, features and size in My Home.' 
    },
    { 
      id: '04', 
      title: 'COMMERCIAL SALES', 
      desc: 'Determine the cost of selling your home with our Net Proceeds calculator. Looking for a local real estate agent or thinking about selling your home for cash?' 
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left Image Component */}
          <div className="w-full lg:w-1/2 relative pr-8 pt-8 px-4 sm:px-0">
            {/* The decorative circle element from the design */}
            <div className="absolute top-0 right-0 w-24 h-24 border-[6px] border-[#3e8675] rounded-bl-full border-t-0 border-r-0 -mt-2 -mr-2 hidden sm:block"></div>
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000" 
              alt="Modern Building Architecture" 
              className="w-full h-auto object-cover rounded-sm shadow-sm relative z-10" 
            />
          </div>

          {/* Right Content Component */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-[34px] font-bold text-gray-900 mb-6 uppercase tracking-wider">
              Our Services
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-12 font-medium max-w-lg leading-relaxed">
              There are many service we provide to our clients to achieve cent percent satisfaction of their properties
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12 relative">
              {/* Decorative partial circle */}
              <div className="absolute hidden lg:block -right-10 top-1/2 transform -translate-y-1/2 w-16 h-16 border-[5px] border-[#29685a] rounded-tl-full border-b-0 border-r-0"></div>

              {services.map((srv) => (
                <div key={srv.id} className="relative">
                  <div className="text-3xl font-extrabold text-gray-900 mb-3">{srv.id}</div>
                  <h3 className="text-[13px] font-bold text-gray-900 mb-3 uppercase tracking-wide">
                    {srv.title}
                  </h3>
                  <p className="text-xs md:text-[13px] text-gray-500 leading-relaxed text-justify font-medium">
                    {srv.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}