import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="space-y-16 p-6 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Welcome to RentAura</h1>
        <p className="text-gray-600 text-lg md:text-xl">
          Find the perfect room, roommate, or rental property easily. Making rentals simple, safe, and fast!
        </p>
        <Button asChild className="mt-4 px-6 py-3">
          <Link href="/browse">Start Exploring</Link>
        </Button>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardContent className="text-center space-y-2">
            <Image src="/verified.png" alt="Rooms" width={60} height={60} className="mx-auto" />
            <h3 className="font-semibold text-lg">Verified Rooms</h3>
            <p className="text-gray-500 text-sm">
              All listings are verified for safety and accuracy.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardContent className="text-center space-y-2">
            <Image src="/trust.png" alt="Owners" width={60} height={60} className="mx-auto" />
            <h3 className="font-semibold text-lg">Trusted Owners</h3>
            <p className="text-gray-500 text-sm">
              Connect directly with verified property owners.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardContent className="text-center space-y-2">
            <Image src="/clock.png" alt="Support" width={60} height={60} className="mx-auto" />
            <h3 className="font-semibold text-lg">24/7 Support</h3>
            <p className="text-gray-500 text-sm">
              Our team is always ready to help you with your queries.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Team Section */}
      <section className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">Meet the Founder</h2>
        <div className="flex justify-center">
          <Card className="max-w-sm text-center hover:shadow-lg transition-shadow duration-300">
            <Image
              src="/me.jpeg"
              alt="Vivek Patel"
              width={300}
              height={300}
              className="rounded-full mx-auto"
            />
            <CardContent>
              <h3 className="font-semibold text-lg">Vivek Patel</h3>
              <p className="text-gray-500 text-sm">Founder & Developer</p>
            </CardContent>
          </Card>
        </div>
      </section>


      {/* Call-to-Action Section */}
      <section className="text-center space-y-4 py-12 bg-indigo-50 rounded-lg">
        <h2 className="text-3xl font-bold">Ready to find your next home?</h2>
        <p className="text-gray-600 text-lg">
          Browse rooms and connect with owners today!
        </p>
        <Button asChild className="mt-4 px-8 py-3">
          <Link href="/browse">Browse Rooms</Link>
        </Button>
      </section>
    </div>
  );
}
