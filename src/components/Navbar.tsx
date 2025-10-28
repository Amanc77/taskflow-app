import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          TaskFlow
        </Link>
        <div className="flex gap-4">
          <Link
            href="/auth"
            className="text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/auth"
            className="text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
