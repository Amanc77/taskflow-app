import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b px-4 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-primary">
          TaskFlow
        </Link>
        <div className="space-x-4">
          <Link
            href="/auth"
            className="text-muted-foreground hover:text-primary"
          >
            Login
          </Link>
          <Link href="/auth" className="text-primary">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
