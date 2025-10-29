import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Shield, Zap, Database } from "lucide-react";
import Navbar from "@/components/Navbar";

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
        <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
          <div className="container mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Task Management
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                Made Simple
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A full-stack application demonstrating authentication, CRUD
              operations, and scalable architecture for modern web development
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/auth">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-indigo-500 text-indigo-500 hover:bg-indigo-100"
                >
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-gray-100/50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Core Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="p-6 bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-lg"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Create your account and start managing tasks efficiently
            </p>
            <Link href="/auth">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-indigo-500 shadow-md hover:bg-gray-100"
              >
                Sign Up Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 px-4 bg-white">
        <div className="container mx-auto text-center text-gray-600">
          <p>© 2025 TaskFlow.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
