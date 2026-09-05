import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#050714] via-[#0d0f28] via-[#1a103c] to-[#070618] text-slate-100 font-sans selection:bg-purple-500 selection:text-white overflow-hidden">
      {/* Background Atmospheric Glow Orbs */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-[30%] right-[-5%] w-[550px] h-[550px] bg-purple-600/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[60%] left-[-10%] w-[650px] h-[650px] bg-violet-600/15 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[25%] w-[700px] h-[700px] bg-sky-500/15 rounded-full blur-[170px] pointer-events-none animate-pulse-glow" />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/[0.03] border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-sky-400 p-[1px] shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950/90 rounded-[15px] flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
                SmartEstate
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-indigo-300/80">
                AI & Legal Verification
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link href="/properties" className="hover:text-white transition-colors py-1 relative group">
              Properties
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="/sell" className="hover:text-white transition-colors py-1 relative group">
              Sell Property
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="/lawyer" className="hover:text-white transition-colors py-1 relative group flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] animate-pulse" />
              Lawyer Directory
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="#verification" className="hover:text-white transition-colors py-1 relative group">
              How Verification Works
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-[0_0_25px_rgba(124,58,237,0.4)] border border-white/20 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-16 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-8 shadow-lg shadow-purple-950/30 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
            <span>Next-Gen Real Estate & Document Audit Platform</span>
          </div>

          {/* Centered Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
            The Future of Real Estate with{" "}
            <span className="bg-gradient-to-r from-sky-300 via-indigo-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(168,85,247,0.4)]">
              Instant Legal Security
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300/90 max-w-3xl mx-auto mt-6 leading-relaxed font-light">
            Discover verified luxury homes, request lawyer-backed document audits, and inspect title deeds before making key property investments.
          </p>

          {/* Prominent CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/properties"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-violet-600 text-white font-bold text-base shadow-[0_0_35px_rgba(147,51,234,0.5)] border border-white/20 hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore Verified Properties
            </Link>

            <Link
              href="/lawyer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel glass-panel-hover text-white font-semibold text-base flex items-center justify-center gap-2 border border-white/15"
            >
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Find Legal Advisor
            </Link>
          </div>

          {/* Futuristic Glass Search Filter Module */}
          <div className="mt-14 max-w-4xl mx-auto p-4 rounded-3xl glass-panel border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-purple-500/40 transition-colors">
                <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-300/80">Location</span>
                <input
                  type="text"
                  placeholder="e.g. Bangalore, Mumbai..."
                  className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-500 mt-1 font-medium"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-purple-500/40 transition-colors">
                <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-300/80">Property Type</span>
                <select className="w-full bg-transparent text-sm text-white focus:outline-none mt-1 font-medium cursor-pointer [&>option]:bg-slate-900">
                  <option value="ALL">All Types</option>
                  <option value="APARTMENT">Luxury Penthouse</option>
                  <option value="VILLA">Private Villa</option>
                  <option value="COMMERCIAL">Commercial Hub</option>
                </select>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-purple-500/40 transition-colors">
                <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-300/80">Title Status</span>
                <select className="w-full bg-transparent text-sm text-white focus:outline-none mt-1 font-medium cursor-pointer [&>option]:bg-slate-900">
                  <option value="VERIFIED">100% Lawyer Audited</option>
                  <option value="IN_PROGRESS">Verification In-Progress</option>
                </select>
              </div>

              <Link
                href="/properties"
                className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 border border-white/20 transition-all hover:scale-[1.02]"
              >
                Search Market
              </Link>
            </div>
          </div>

          {/* Central Hero Image with Floating Layered Glass Windows */}
          <div className="mt-20 relative max-w-5xl mx-auto">
            {/* Base Framing Visual */}
            <div className="relative rounded-3xl overflow-hidden glass-panel p-3 border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[21/9]">
                <Image
                  src="/hero.jpg"
                  alt="Modern Luxury Estate Visual"
                  fill
                  priority
                  className="object-cover scale-105 hover:scale-100 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050714] via-[#050714]/30 to-transparent" />
              </div>
            </div>

            {/* Overlapping Floating Glass Cards */}
            {/* Floating Card 1: Top Left (-2.5deg) */}
            <div className="absolute -top-10 -left-6 sm:-left-12 max-w-[280px] p-4 rounded-2xl glass-panel border border-white/20 shadow-2xl animate-float-slow -rotate-2.5 text-left backdrop-blur-3xl hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-bold text-lg">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Title Deed Verified</h4>
                  <p className="text-[10px] text-indigo-200/70">Adv. R. Sharma • Bar ID #89201</p>
                </div>
              </div>
              <div className="mt-3 text-[11px] text-slate-300 bg-white/[0.04] p-2 rounded-xl border border-white/10">
                "0 encumbrances found. Ownership history clear from 1994."
              </div>
            </div>

            {/* Floating Card 2: Top Right (2deg) */}
            <div className="absolute -top-8 -right-6 sm:-right-12 max-w-[270px] p-4 rounded-2xl glass-panel border border-white/20 shadow-2xl animate-float-delayed rotate-2 text-left backdrop-blur-3xl hidden md:block">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">AI Document Audit</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-2">
                Sale Deed & Encumbrance Certificate auto-scanned with 100% legal compliance score.
              </p>
              <div className="mt-2 text-[10px] text-purple-300 font-semibold">
                Status: Audit Ready →
              </div>
            </div>

            {/* Floating Card 3: Bottom Left (1.5deg) */}
            <div className="absolute -bottom-10 -left-4 sm:-left-8 max-w-[260px] p-4 rounded-2xl glass-panel border border-white/20 shadow-2xl animate-float-delayed rotate-1.5 text-left backdrop-blur-3xl hidden md:block">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Escrow Security</span>
                <span className="text-xs font-extrabold text-emerald-400">₹1,500</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1.5">
                Verification fee held safely in smart escrow until lawyer report delivery.
              </p>
            </div>

            {/* Floating Card 4: Bottom Right (-1.8deg) */}
            <div className="absolute -bottom-8 -right-4 sm:-right-8 max-w-[280px] p-4 rounded-2xl glass-panel border border-white/20 shadow-2xl animate-float-slow -rotate-1.8 text-left backdrop-blur-3xl hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 font-bold">
                  ⚖️
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Lawyer Request Accepted</h4>
                  <p className="text-[10px] text-slate-300">Adv. Ananya Roy • Rating ⭐ 4.9</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Spatial Glass Statistics Grid */}
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { metric: "3,500+", label: "Verified Listings", icon: "🏙️", color: "from-indigo-400 to-sky-300" },
                { metric: "450+", label: "Bar Certified Lawyers", icon: "⚖️", color: "from-purple-400 to-pink-300" },
                { metric: "99.8%", label: "Title Safety Score", icon: "🛡️", color: "from-emerald-400 to-teal-300" },
                { metric: "₹1,500", label: "Fixed Verification Fee", icon: "💎", color: "from-amber-300 to-yellow-200" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl glass-panel glass-panel-hover text-center border border-white/10 hover:border-white/25 transition-all"
                >
                  <span className="text-2xl mb-2 block">{stat.icon}</span>
                  <p className={`text-3xl sm:text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.metric}
                  </p>
                  <p className="text-xs font-medium text-slate-300 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Glass Property Cards */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">Curated Listings</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                Featured Verified Properties
              </h2>
            </div>
            <Link
              href="/properties"
              className="text-sm font-semibold text-purple-300 hover:text-white flex items-center gap-1.5"
            >
              View All Properties →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Skyline Glass Penthouse",
                location: "Indiranagar, Bangalore",
                price: "₹2.85 Crore",
                specs: "3 Beds • 3 Baths • 2,850 sq ft",
                img: "/penthouse.jpg",
                badge: "Title Verified",
              },
              {
                title: "Modern Architectural Villa",
                location: "Jubilee Hills, Hyderabad",
                price: "₹4.50 Crore",
                specs: "4 Beds • 5 Baths • 4,200 sq ft",
                img: "/hero.jpg",
                badge: "Legal Audit Passed",
              },
              {
                title: "Coastal Luxury Apartment",
                location: "Marine Drive, Mumbai",
                price: "₹3.20 Crore",
                specs: "2 Beds • 2 Baths • 1,950 sq ft",
                img: "/penthouse.jpg",
                badge: "Title Verified",
              },
            ].map((prop, idx) => (
              <div
                key={idx}
                className="group rounded-3xl glass-panel glass-panel-hover border border-white/15 overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={prop.img}
                    alt={prop.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full glass-pill border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {prop.badge}
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      {prop.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {prop.location}
                    </p>
                    <p className="text-xs text-indigo-200/70 mt-2">{prop.specs}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Price</span>
                      <p className="text-lg font-black text-white">{prop.price}</p>
                    </div>
                    <Link
                      href="/properties"
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-purple-600 text-white text-xs font-semibold transition-all border border-white/15"
                    >
                      Inspect Title
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Verification Matrix Steps */}
        <section id="verification" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-purple-400">Streamlined Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              How Legal Verification Protects You
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Upload Documents",
                desc: "Upload property Sale Deed, Title Deed, EC, or tax receipts to your private vault.",
              },
              {
                step: "02",
                title: "Choose Legal Expert",
                desc: "Compare registered lawyers by rating, experience, and transparent upfront fees.",
              },
              {
                step: "03",
                title: "Legal Inspection",
                desc: "Assigned lawyer audits government records, ownership history, and encumbrance logs.",
              },
              {
                step: "04",
                title: "Get Signed Report",
                desc: "Receive an official verification report approving or flagging any document discrepancies.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl glass-panel glass-panel-hover border border-white/15 text-left flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl font-black text-purple-400/60 block mb-2">{item.step}</span>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Roles Section */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Buyer */}
            <div className="p-8 rounded-3xl glass-panel glass-panel-hover border border-white/15 flex flex-col justify-between">
              <div>
                <span className="text-3xl">🏡</span>
                <h3 className="text-xl font-bold text-white mt-4">For Buyers</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Browse verified listings and hire legal experts to inspect title deeds before paying booking advances.
                </p>
              </div>
              <Link href="/properties" className="mt-6 text-xs font-bold text-purple-300 hover:text-white">
                Browse Marketplace →
              </Link>
            </div>

            {/* Seller */}
            <div className="p-8 rounded-3xl glass-panel glass-panel-hover border border-white/15 flex flex-col justify-between">
              <div>
                <span className="text-3xl">🔑</span>
                <h3 className="text-xl font-bold text-white mt-4">For Sellers</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  List your property with verified badges to attract serious buyers and close transactions faster.
                </p>
              </div>
              <Link href="/sell" className="mt-6 text-xs font-bold text-purple-300 hover:text-white">
                List Property →
              </Link>
            </div>

            {/* Lawyer */}
            <div className="p-8 rounded-3xl glass-panel glass-panel-hover border border-purple-500/30 bg-gradient-to-br from-purple-950/30 to-indigo-950/30 flex flex-col justify-between">
              <div>
                <span className="text-3xl">⚖️</span>
                <h3 className="text-xl font-bold text-white mt-4">For Legal Advisors</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Set your verification fees, receive legal audit requests online, and build your digital legal practice.
                </p>
              </div>
              <Link href="/signup?role=LAWYER" className="mt-6 text-xs font-bold text-purple-300 hover:text-white">
                Register as Lawyer →
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Futuristic Glass Footer */}
      <footer className="relative z-10 border-t border-white/10 backdrop-blur-2xl bg-white/[0.02] py-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="text-sm font-bold text-white">SmartEstate</span>
          </div>

          <p className="text-slate-400 text-center md:text-left max-w-md">
            © 2026 SmartEstate. All property legal audit reports are signed by verified legal advisors.
          </p>

          <div className="flex gap-6 text-slate-300">
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link>
            <Link href="/properties" className="hover:text-white transition-colors">Properties</Link>
            <Link href="/lawyer" className="hover:text-white transition-colors">Lawyers</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
