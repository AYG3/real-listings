export default function FooterSection() {
  return (
    <footer className="bg-[#113a30] pt-16 pb-8 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Section */}
        <div className="flex flex-col md:flex-row items-end justify-between border-b border-white/10 pb-12 mb-12 gap-8 md:gap-0">
          <h2 className="text-3xl font-bold w-full md:w-1/2 pr-0 md:pr-10 leading-snug">
            Get all our news and offers in one place
          </h2>
          
          <div className="w-full md:w-5/12 flex flex-col sm:flex-row gap-0 sm:gap-3 bg-white sm:bg-transparent rounded-sm sm:rounded-none overflow-hidden sm:overflow-visible">
            <input 
              type="text" 
              placeholder="Enter your email" 
              className="flex-1 bg-white px-5 py-4 text-sm text-gray-900 outline-none w-full sm:rounded-sm border-none" 
            />
            <button className="bg-transparent border border-white/30 text-white px-8 py-4 sm:py-0 text-sm font-semibold hover:bg-white/10 transition-colors w-full sm:w-auto h-full sm:rounded-sm">
              Subscribe
            </button>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Description */}
          <div className="lg:col-span-2 pr-0 lg:pr-12">
            <div className="flex items-center gap-3 mb-6">
              {/* Logo shape representation */}
              <div className="flex flex-col gap-1 w-6 items-start">
                <div className="w-full h-1 bg-white"></div>
                <div className="w-4 h-1 bg-white"></div>
                <div className="w-2 h-1 bg-white"></div>
              </div>
              <span className="text-xl font-bold tracking-widest uppercase">TRUST-ESTATE</span>
            </div>
            <p className="text-[13px] text-white/60 leading-loose font-medium max-w-sm">
              A place where you can find your dream home. We provide all kinds of estate service personalized just for you.
            </p>
          </div>

          {/* About Us */}
          <div>
            <h4 className="font-bold mb-6 text-sm">About Us</h4>
            <ul className="space-y-4 text-[13px] text-white/50 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Our Services</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Become a Partner</a></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-bold mb-6 text-sm">Community</h4>
            <ul className="space-y-4 text-[13px] text-white/50 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Token</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Discussion</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Voting</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold mb-6 text-sm">Social Media</h4>
            <ul className="space-y-4 text-[13px] text-white/50 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}