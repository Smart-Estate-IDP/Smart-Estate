import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-400 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Smart<span className="text-indigo-400">Estate</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India&apos;s 1st AI & Lawyer-Verified Real Estate Ecosystem. Eliminating real estate scams, title disputes, and unverified properties through guaranteed document auditing.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                RERA Compliant & Legal Insurance Ready
              </span>
            </div>
          </div>

          {/* Col 2: Marketplace */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Properties</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties" className="hover:text-indigo-400 transition-colors">
                  Verified Apartments
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-indigo-400 transition-colors">
                  Independent Villas
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-indigo-400 transition-colors">
                  Clear-Title Residential Plots
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-indigo-400 transition-colors">
                  List Your Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Legal & Verification</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#advantages" className="hover:text-indigo-400 transition-colors">
                  AI Deed Screening
                </a>
              </li>
              <li>
                <Link href="/lawyer" className="hover:text-indigo-400 transition-colors">
                  Find Legal Experts
                </Link>
              </li>
              <li>
                <a href="#advantages" className="hover:text-indigo-400 transition-colors">
                  Encumbrance Check
                </a>
              </li>
              <li>
                <a href="#advantages" className="hover:text-indigo-400 transition-colors">
                  Safe Escrow Payment
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Account & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Account & Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/signup" className="hover:text-indigo-400 transition-colors font-medium text-indigo-300">
                  Create Account (Sign Up)
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-400 transition-colors">
                  Client Portal Login
                </Link>
              </li>
              <li>
                <Link href="/lawyer" className="hover:text-indigo-400 transition-colors">
                  Join as Legal Advisor
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-indigo-400 transition-colors">
                  Admin Gateway
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SmartEstate Legal Platform Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Verification</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Legal Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
