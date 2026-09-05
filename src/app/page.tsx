import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                SmartEstate
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-indigo-400">
                Legal Verification Included
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link href="/properties" className="hover:text-indigo-400 transition-colors">
              Buy Properties
            </Link>
            <Link href="/sell" className="hover:text-indigo-400 transition-colors">
              Sell Property
            </Link>
            <Link href="/lawyer" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Find Lawyers
            </Link>
            <Link href="#verification" className="hover:text-indigo-400 transition-colors">
              How Verification Works
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-12 pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950 -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              {/* Left Text */}
              <div className="lg:col-span-7 space-y-8 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>100% Lawyer Audited Real Estate Platform</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
                  Buy & Sell Properties with{" "}
                  <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-sky-300 bg-clip-text text-transparent">
                    Verified Legal Security
                  </span>
                </h1>

                <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                  Discover premium residential & commercial listings. Connect directly with registered legal advisors to inspect title deeds, encumbrance certificates, and land records before making any commitment.
                </p>

                {/* Search Box Card */}
                <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md">
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    <div className="flex flex-col px-3 py-2 bg-slate-950/60 rounded-xl border border-slate-800">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Location</label>
                      <input
                        type="text"
                        placeholder="City or location..."
                        className="bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-500 mt-1"
                      />
                    </div>

                    <div className="flex flex-col px-3 py-2 bg-slate-950/60 rounded-xl border border-slate-800">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Type</label>
                      <select className="bg-transparent text-sm text-white focus:outline-none mt-1 cursor-pointer [&>option]:bg-slate-900">
                        <option value="ALL">All Types</option>
                        <option value="APARTMENT">Apartment</option>
                        <option value="VILLA">Villa</option>
                        <option value="HOUSE">House</option>
                        <option value="PLOT">Plot</option>
                        <option value="COMMERCIAL">Commercial</option>
                      </select>
                    </div>

                    <div className="flex flex-col px-3 py-2 bg-slate-950/60 rounded-xl border border-slate-800">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Budget</label>
                      <select className="bg-transparent text-sm text-white focus:outline-none mt-1 cursor-pointer [&>option]:bg-slate-900">
                        <option value="">Any Budget</option>
                        <option value="50L">Under ₹50 Lakhs</option>
                        <option value="1CR">₹50L - ₹1 Crore</option>
                        <option value="2CR">₹1Cr - ₹3 Crore</option>
                        <option value="3CR+">₹3 Crore+</option>
                      </select>
                    </div>

                    <Link
                      href="/properties"
                      className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl py-3.5 px-6 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Search Homes
                    </Link>
                  </div>
                </div>

                {/* Quick Trust Badges */}
                <div className="pt-2 flex flex-wrap items-center gap-6 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Title Deed Audits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Verified Legal Experts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Zero Fraud Risk</span>
                  </div>
                </div>
              </div>

              {/* Right Hero Image Card */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-indigo-950/50 group">
                  <Image
                    src="/hero.jpg"
                    alt="Luxury Modern Estate"
                    width={800}
                    height={600}
                    priority
                    className="w-full h-[460px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Floating Legal Verification Badge */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl backdrop-blur-md flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-lg">
                        ✓
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">Title Verification Report</h4>
                        <p className="text-xs text-slate-400">Audited by Adv. R. Sharma • Bar Council Reg #89201</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                      VERIFIED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Statistics */}
        <section className="py-12 bg-slate-900/50 border-y border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="p-4">
                <p className="text-3xl sm:text-4xl font-extrabold text-white">3,500+</p>
                <p className="text-sm font-medium text-slate-400 mt-1">Properties Listed</p>
              </div>
              <div className="p-4">
                <p className="text-3xl sm:text-4xl font-extrabold text-indigo-400">450+</p>
                <p className="text-sm font-medium text-slate-400 mt-1">Verified Lawyers</p>
              </div>
              <div className="p-4">
                <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">99.8%</p>
                <p className="text-sm font-medium text-slate-400 mt-1">Title Safety Score</p>
              </div>
              <div className="p-4">
                <p className="text-3xl sm:text-4xl font-extrabold text-amber-400">₹1,500</p>
                <p className="text-sm font-medium text-slate-400 mt-1">Avg. Verification Fee</p>
              </div>
            </div>
          </div>
        </section>

        {/* Verification Workflow */}
        <section id="verification" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-2">Simple & Transparent</h2>
            <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              How Legal Document Verification Works
            </p>
            <p className="text-slate-400 mt-3 text-base">
              Protect yourself from title disputes, encumbrances, and illegal claims in 4 straightforward steps.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Upload Documents",
                desc: "Upload property Sale Deed, Title Deed, EC, or tax receipts securely to your dashboard.",
                icon: "📄",
              },
              {
                step: "02",
                title: "Choose Legal Expert",
                desc: "Compare registered lawyers by rating, experience, and transparent verification fees.",
                icon: "⚖️",
              },
              {
                step: "03",
                title: "Legal Inspection",
                desc: "Assigned lawyer audits government records, ownership history, and encumbrance logs.",
                icon: "🔍",
              },
              {
                step: "04",
                title: "Get Signed Report",
                desc: "Receive an official verification report approving or flagging any document discrepancies.",
                icon: "✅",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition-all hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase">Step {item.step}</span>
                <h3 className="text-lg font-bold text-white mt-1 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Roles CTA Section */}
        <section className="py-16 bg-slate-900/30 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Buyer */}
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between">
                <div>
                  <span className="text-2xl">🏡</span>
                  <h3 className="text-xl font-bold text-white mt-3">For Buyers</h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    Explore thousands of properties and hire legal advisors to verify title deeds before paying booking advances.
                  </p>
                </div>
                <Link
                  href="/properties"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Browse Marketplace →
                </Link>
              </div>

              {/* Seller */}
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between">
                <div>
                  <span className="text-2xl">🔑</span>
                  <h3 className="text-xl font-bold text-white mt-3">For Property Owners</h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    List your home or commercial plot with verified badges to attract serious buyers and close deals faster.
                  </p>
                </div>
                <Link
                  href="/sell"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  List Property →
                </Link>
              </div>

              {/* Lawyer */}
              <div className="p-8 rounded-3xl bg-slate-900 border border-indigo-900/50 hover:border-indigo-500/80 transition-all flex flex-col justify-between bg-gradient-to-br from-indigo-950/40 to-slate-900">
                <div>
                  <span className="text-2xl">⚖️</span>
                  <h3 className="text-xl font-bold text-white mt-3">For Lawyers & Legal Experts</h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    Set your own document verification fees, receive legal inspection requests, and earn income online.
                  </p>
                </div>
                <Link
                  href="/signup?role=LAWYER"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Register as Lawyer →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-12 text-sm text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="text-base font-bold text-white">SmartEstate</span>
          </div>

          <p className="text-xs text-slate-500 text-center md:text-left max-w-md">
            SmartEstate provides legal verification matching. Final verification reports are issued directly by licensed legal professionals.
          </p>

          <div className="flex gap-6">
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link>
            <Link href="/properties" className="hover:text-white transition-colors">Properties</Link>
            <Link href="/lawyer" className="hover:text-white transition-colors">Lawyer Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
