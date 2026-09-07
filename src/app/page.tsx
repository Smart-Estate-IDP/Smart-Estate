import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-3xl font-bold tracking-tight">SmartEstate</h1>
        <p className="text-slate-400 text-sm">
          Welcome! Click below to create an account.
        </p>
        <div>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg transition-all"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

