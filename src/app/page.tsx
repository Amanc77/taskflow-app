import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Zap, Database } from "lucide-react";

const Landing = () => {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-indigo-500" />,
      title: "Secure Authentication",
      description:
        "JWT-based authentication with password hashing and protected routes",
    },
    {
      icon: <Database className="h-8 w-8 text-indigo-500" />,
      title: "Full CRUD Operations",
      description:
        "Create, read, update, and delete tasks with real-time database sync",
    },
    {
      icon: <Zap className="h-8 w-8 text-indigo-500" />,
      title: "Scalable Architecture",
      description: "Built with modern tech stack designed for production scale",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <section className="relative py-14 px-4 md:py-20 bg-gradient-to-br from-indigo-100 to-purple-100">
          <div className="max-w-6xl mx-auto text-center px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Task Management
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                Made Simple
              </span>
            </h1>

            <p className="text-base md:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              A full-stack application demonstrating authentication, CRUD
              operations, and scalable architecture for modern web development.
            </p>

            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg px-5 py-2"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/auth">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-indigo-500 text-indigo-500 hover:bg-indigo-50 px-5 py-2"
                >
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-gray-100/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-800">
              Core Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="p-6 bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-lg"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-sm md:text-base mb-6 opacity-90 max-w-xl mx-auto">
              Create your account and start managing tasks efficiently
            </p>
            <Link href="/auth">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-indigo-500 shadow-md hover:bg-gray-100 px-5 py-2"
              >
                Sign Up Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>© {new Date().getFullYear()} TaskFlow.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
