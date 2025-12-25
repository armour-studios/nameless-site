"use client";

import Card from "@/components/Card";
import { FaDiscord, FaTrophy, FaCalendar } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Standing {
  placement: number;
  entrant: {
    name: string;
  };
}

interface RecentEvent {
  id: number;
  name: string;
  startAt: number;
  state: string;
  videogame?: {
    name: string;
  };
  tournament?: {
    name: string;
  };
  standings?: {
    nodes: Standing[];
  };
}

export default function Home() {
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentResults();
  }, []);

  const fetchRecentResults = async () => {
    try {
      const response = await fetch('/api/tournaments?recent=true');
      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        // Get events that actually have standings/winners
        const eventsWithWinners = data.data.filter((e: RecentEvent) => e.standings?.nodes && e.standings.nodes.length > 0);
        setRecentEvents(eventsWithWinners);
      }
    } catch (error) {
      console.error('Error fetching recent results:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <main className="min-h-screen pt-8 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto text-white">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        {/* Main Hero */}
        <div className="lg:col-span-8 order-1 flex flex-col">
          <Card className="flex-1 flex flex-col justify-center items-start px-8 md:px-12 relative overflow-hidden group min-h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-transparent"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity"></div>

            <div className="relative z-10 max-w-2xl">
              <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4 font-[family-name:var(--font-heading)]">
                <span className="text-white block mb-2">NAMELESS</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                  ESPORTS
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed font-medium">
                The premier competitive experience. Join the elite and showcase your skills on the global stage.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="https://discord.com/invite/G9uMk2N9bY" target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2 px-8">
                  <FaDiscord /> JOIN DISCORD
                </a>
                <Link href="/events">
                  <button className="btn-outline px-8 cursor-pointer">
                    VIEW EVENTS
                  </button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Champions Sidebar */}
        <div className="lg:col-span-4 order-2 flex flex-col">
          <Card title="Recent Champions" centerTitle className="flex-1 border-pink-500/20 flex flex-col items-center">
            {loading ? (
              <div className="flex items-center justify-center flex-1">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
              </div>
            ) : (
              <div className="flex flex-col flex-1 w-full max-w-[320px] mx-auto text-center">
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar mb-6 flex-1">
                  {recentEvents.length > 0 ? (
                    recentEvents.map((event) => {
                      const winner = event.standings?.nodes[0];
                      if (!winner) return null;

                      return (
                        <div key={event.id} className="bg-white/5 p-4 rounded-xl flex flex-col gap-2 group/item hover:bg-white/10 transition-all border border-transparent hover:border-pink-500/30 items-center">
                          <div className="flex justify-between items-start w-full">
                            <div className="text-[10px] font-bold text-pink-500 uppercase tracking-widest">{event.videogame?.name || "Tournament"}</div>
                            <div className="text-[10px] text-gray-500">{formatDate(event.startAt)}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-black text-xs shadow-[0_0_10px_rgba(234,179,8,0.3)] flex-shrink-0">
                              1
                            </div>
                            <div className="font-bold text-white group-hover/item:text-pink-400 transition-colors truncate">
                              {winner.entrant.name}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 truncate w-full">
                            {event.tournament?.name || event.name}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white/5 rounded-xl border border-dashed border-white/10">
                      <FaTrophy className="text-4xl mb-3 opacity-20" />
                      <p className="font-medium">No recent winners found</p>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-6 border-t border-white/5">
                  <Link href="/events#past-events">
                    <button className="text-[10px] font-black text-white hover:text-pink-400 transition-colors w-full py-4 bg-white/5 rounded-lg border border-white/10 hover:border-pink-500/40 cursor-pointer uppercase tracking-widest">
                      View All Past Events →
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Featured CTA Grid - 2 Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Link href="/events" className="block">
          <Card className="h-64 relative overflow-hidden group cursor-pointer border-2 border-white/5 hover:border-pink-500/50 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-pink-600/40 z-10"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-20 h-full flex flex-col items-center justify-center text-center p-8">
              <div className="bg-pink-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4">Now Live</div>
              <h3 className="font-black text-3xl md:text-4xl mb-2 text-white font-[family-name:var(--font-heading)] drop-shadow-lg">
                SEASON 1: JAN-MAY 2026
              </h3>
              <p className="text-lg font-bold text-white/90 drop-shadow-md uppercase tracking-wider">ROCKET RUSH SERIES</p>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <span className="text-white font-black text-sm uppercase tracking-widest border-b-2 border-pink-500 pb-1">Enter Now</span>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/initiative" className="block">
          <Card className="h-64 relative overflow-hidden group cursor-pointer border-2 border-white/5 hover:border-purple-500/50 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 to-purple-600/40 z-10"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-20 h-full flex flex-col items-center justify-center text-center p-8">
              <div className="bg-purple-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4">Focus Point</div>
              <h3 className="font-black text-3xl md:text-4xl mb-2 text-white font-[family-name:var(--font-heading)] drop-shadow-lg">
                NAMELESS INITIATIVE LEAGUE
              </h3>
              <p className="text-lg font-bold text-white/90 drop-shadow-md">High School League coming soon..</p>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <span className="text-white font-black text-sm uppercase tracking-widest border-b-2 border-purple-500 pb-1">Learn More</span>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Featured Partner Section - Armour Studios */}
      <section className="mb-20">
        <p className="text-center text-xs font-black text-gray-500 uppercase tracking-[0.5em] mb-12">Featured Partner</p>

        <Card className="relative overflow-hidden border-white/5 bg-gradient-to-br from-blue-900/10 via-cyan-900/10 to-transparent">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-7 p-8 md:p-12 z-10">
              <a
                href="https://www.armour-studios.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 mb-6 group w-fit"
              >
                <div className="relative w-12 h-12 group-hover:scale-110 transition-transform">
                  <Image
                    src="/armour-logo.png"
                    alt="Armour Studios"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-3xl md:text-4xl font-black tracking-tighter group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all">
                  <span className="text-white">ARMOUR</span> <span className="text-gray-400">STUDIOS</span>
                </div>
              </a>

              <div className="inline-block bg-cyan-500/10 text-cyan-400 text-xs font-black uppercase tracking-[0.3em] px-4 py-2 rounded-lg mb-6 border border-cyan-500/20">
                Launching Early 2026
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">
                Build Your Esports & Gaming Business
              </h3>

              <p className="text-gray-300 mb-6 leading-relaxed">
                The premier freelance marketplace for the gaming industry. Sell your services, find sponsorships, discover jobs, and connect with opportunities—all in one platform built for gamers.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {['Jobs', 'Sponsorships', 'Courses', 'Marketplace'].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm font-bold text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    {feature}
                  </div>
                ))}
              </div>

              <a
                href="https://www.armour-studios.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border-2 border-cyan-500 hover:border-cyan-400 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all group"
              >
                Visit Armour Studios
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>

            {/* Right Visual */}
            <div className="lg:col-span-5 relative h-64 lg:h-auto overflow-hidden rounded-r-[2rem]">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/armour-logo.png"
                  alt="Armour Studios"
                  width={400}
                  height={400}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* News Preview Section */}
      <div className="mb-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-5xl font-black font-[family-name:var(--font-heading)] text-white">
            LATEST <span className="text-gradient">NEWS</span>
          </h2>
          <Link href="/news" className="text-pink-500 font-bold hover:text-white transition-colors flex items-center gap-2 group">
            View All News <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              id: 1,
              title: "Nameless Wins Winter Cup Championship",
              excerpt: "Our Rocket League team took home the championship trophy in an intense final against the league leaders.",
              date: "Dec 20, 2024",
              image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
            },
            {
              id: 2,
              title: "New Roster Announcement",
              excerpt: "We're excited to announce three new additions to our competitive Valorant roster for the upcoming season.",
              date: "Dec 15, 2024",
              image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
            },
            {
              id: 3,
              title: "Spring Season Registration Opens",
              excerpt: "Registration for the Spring 2025 tournament series opens next month. Don't miss your chance to compete.",
              date: "Dec 10, 2024",
              image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800",
            },
          ].map((article) => (
            <Link key={article.id} href="/news" className="group">
              <Card className="overflow-hidden p-0 border-white/5 hover:border-pink-500/50 transition-all h-full flex flex-col">
                <div className="h-56 w-full overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={800}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-pink-500 uppercase tracking-widest mb-3">
                    <FaCalendar /> {article.date}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-pink-400 transition-colors text-white leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="mt-auto text-pink-500 text-sm font-bold flex items-center gap-1">
                    Read More <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Community / Final CTA */}
      <section className="relative py-24 rounded-[2rem] overflow-hidden text-center bg-[#0a0014] border border-white/5 mb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-pink-500/5"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="inline-block bg-pink-500/10 text-pink-500 text-xs font-black uppercase tracking-[0.3em] px-4 py-2 rounded-lg mb-6 border border-pink-500/20">
            Join the movement
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-8 font-[family-name:var(--font-heading)] leading-none text-white">
            BECOME <span className="text-gradient">NAMELESS</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 leading-relaxed">
            Connect with thousands of players, access exclusive content, and carve your name into esports history.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="https://discord.com/invite/G9uMk2N9bY" target="_blank" rel="noopener noreferrer" className="btn-primary px-16 py-5 text-xl">
              JOIN DISCORD
            </a>
            <Link href="/our-vision" className="btn-outline px-16 py-5 text-xl">
              OUR VISION
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
