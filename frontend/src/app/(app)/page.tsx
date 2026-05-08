"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import RoomCard from "@/components/RoomCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeatureCard } from "@/components/FeatureCard";
import api from "@/lib/api";
import { CheckCircle, Wallet, Zap } from "lucide-react";
import { toast } from "sonner";

// ✅ Clean type
interface Room {
  id: number;
  _id: string;
  title: string;
  city: string;
  price: number;
  rent: number;
  images: string[];
  availability: "Available" | "Booked" | "Pending";
  amenities: string[];
}

interface PropertyApiItem {
  id: number;
  title: string;
  city: string;
  price: number;
  images?: string[];
  amenities?: string[];
}

export default function HomePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // ✅ Check auth (cookie-based)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/auth/me");
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get<PropertyApiItem[]>("/properties");

        // 🔥 map backend → RoomCard format
        const mapped = response.data.map((r) => ({
          _id: r.id.toString(),
          id: r.id,
          title: r.title,
          city: r.city,
          rent: r.price, // ✅ mapping
          price: r.price,
          images: r.images || [],
          availability: "Available" as const, // default
          amenities: r.amenities || [],
        }));

        setRooms(mapped);
        setFilteredRooms(mapped);
      } catch (err) {
        console.error("Rooms fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // ✅ Fetch favorites (only if logged in)
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchFavs = async () => {
      try {
        const response = await api.get("/auth/favorites");
        setFavorites(response.data);
      } catch (err) {
        console.error("Favorites fetch error:", err);
      }
    };

    fetchFavs();
  }, [isLoggedIn]);

  // ✅ Debounced search
  useEffect(() => {
    const delay = setTimeout(() => {
      if (!search.trim()) {
        setFilteredRooms(rooms);
      } else {
        setFilteredRooms(
          rooms.filter((room) =>
            room.city.toLowerCase().includes(search.toLowerCase())
          )
        );
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [search, rooms]);

  // ✅ Toggle favorite
  const toggleFavorite = async (propertyId: number) => {
    if (!isLoggedIn) {
      toast.error("Login required to save favorites ❤️");
      return;
    }

    try {
      if (favorites.includes(propertyId)) {
        await api.delete(`/favorites/${propertyId}`);
        setFavorites((prev) => prev.filter((id) => id !== propertyId));
      } else {
        await api.post(`/favorites/${propertyId}`);
        setFavorites((prev) => [...prev, propertyId]);
      }
    } catch (err) {
      console.error("Favorite toggle error:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen">

      {/* HERO */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-balance">
              Find Your <span className="text-primary">Perfect Room</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-md">
              Discover verified rooms across cities with ease. Safe, trusted, and affordable living spaces at your fingertips.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
              <Input
                placeholder="Search by city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 text-base"
              />
              <Button className="h-12 px-8 bg-primary hover:bg-primary/90 font-semibold">
                Search
              </Button>
            </div>
          </div>

          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-2xl"></div>
              <Image
                src="/hero-room.jpg"
                alt="Beautiful room interior"
                width={500}
                height={400}
                className="w-full h-auto rounded-2xl shadow-xl relative z-10"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ROOMS */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-3">Featured Rooms</h2>
          <p className="text-muted-foreground text-lg">Browse our curated selection of verified listings</p>
        </div>

        {loading || checkingAuth ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading rooms...</p>
            </div>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="flex justify-center items-center py-20 bg-muted/30 rounded-xl">
            <p className="text-muted-foreground">No rooms found. Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                isFavorite={favorites.includes(room.id)}
                isLoggedIn={isLoggedIn}
                onToggleFavorite={() => toggleFavorite(room.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-gradient-to-br from-muted/40 via-background to-muted/20 border-y border-border">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Why Choose RentAura?</h2>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            We&apos;re committed to making room hunting safe, transparent, and effortless for everyone.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg hover:border-primary/50 transition-all">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle size={32} className="text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Listings</h3>
              <p className="text-muted-foreground">Every room is thoroughly verified for your safety and peace of mind</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg hover:border-primary/50 transition-all">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                  <Wallet size={32} className="text-accent" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Best Prices</h3>
              <p className="text-muted-foreground">Transparent pricing with no hidden fees. You always get the best deal</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg hover:border-primary/50 transition-all">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Zap size={32} className="text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Quick Booking</h3>
              <p className="text-muted-foreground">Reserve your room in minutes with our simple, intuitive process</p>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Users Love</h2>
            <p className="text-muted-foreground text-lg">Join thousands of satisfied renters and landlords</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Chen",
                role: "Renter",
                review: "Found my perfect apartment in just 2 days. The verification process gave me peace of mind.",
                rating: 5
              },
              {
                name: "Marcus Johnson",
                role: "Room Owner",
                review: "RentAura made it so easy to list my spare room. Great tenants and reliable platform!",
                rating: 5
              },
              {
                name: "Emily Rodriguez",
                role: "Renter",
                review: "The interface is intuitive and I appreciate the transparent pricing. Highly recommend!",
                rating: 5
              }
            ].map((review, id) => (
              <Card key={id} className="border border-border bg-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i} className="text-accent">★</span>
                    ))}
                  </div>
                  <CardTitle className="text-lg">{review.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{review.review}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-background to-accent/10 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Are You a Room Owner?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start earning today by listing your room on RentAura. Reach thousands of verified renters looking for quality accommodation.
          </p>

          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-12" asChild>
            <Link href="/login">List Your Room Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
