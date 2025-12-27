import Card from "@/components/Card";
import { FaDiscord, FaTrophy, FaCalendar, FaGamepad, FaUsers, FaMedal, FaChartLine, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { getAllNews } from "@/utils/news";
import RecentChampions from "@/components/homepage/RecentChampions";
import YouTubeFeed from "@/components/YouTubeFeed";
import ThemedHomeHero from "@/components/homepage/ThemedHomeHero";
import { fetchNamelessTournaments } from "@/lib/startgg";
import PageTitle from "@/components/PageTitle";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch news articles from RSS feed
  const allNews = await getAllNews();
  const latestNews = allNews.slice(0, 4);

  // Fetch Stats Data
  const tournaments = await fetchNamelessTournaments();

  // Calculate Stats
  const totalEvents = tournaments.length;
  // Use a fallback/estimation if attendees not available or 0, but ideally sum them up
  const totalPlayers = tournaments.reduce((sum, t) => sum + (t.numAttendees || 0), 0);
  const totalTeams = tournaments.reduce((sum, t) => sum + (t.events?.reduce((s, e) => s + (e.numEntrants || 0), 0) || 0), 0);
  const totalMoney = 1000; // Hardcoded from previous value or calculate if possible

  return (
    <main className="min-h-screen pt-8 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto text-white space-y-24">

      {/* Hero Section */}
      <ThemedHomeHero />

      {/* Stats Grid - Themed & Centered Content */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {[
          { label: "Total Events", value: totalEvents, icon: FaCalendar, color: "pink", bg: "group-hover:bg-pink-500/10", text: "group-hover:text-pink-500", border: "hover:border-pink-500/30", iconColor: "text-white/20 group-hover:text-pink-500" },
          { label: "Active Players", value: totalPlayers > 0 ? totalPlayers.toLocaleString() : "1,250+", icon: FaUsers, color: "purple", bg: "group-hover:bg-purple-500/10", text: "group-hover:text-purple-500", border: "hover:border-purple-500/30", iconColor: "text-white/20 group-hover:text-purple-500" },
          { label: "Teams Registered", value: totalTeams > 0 ? totalTeams.toLocaleString() : "350+", icon: FaGamepad, color: "cyan", bg: "group-hover:bg-cyan-500/10", text: "group-hover:text-cyan-500", border: "hover:border-cyan-500/30", iconColor: "text-white/20 group-hover:text-cyan-500" },
          { label: "Prize Pool Awarded", value: `$${totalMoney.toLocaleString()}+`, icon: FaMedal, color: "yellow", bg: "group-hover:bg-yellow-500/10", text: "group-hover:text-yellow-500", border: "hover:border-yellow-500/30", iconColor: "text-white/20 group-hover:text-yellow-500" }
        ].map((stat, i) => (
          <div key={i} className={`bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-10 hover:bg-white/[0.04] ${stat.border} transition-all group flex flex-col items-center text-center space-y-6`}>
            <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center ${stat.bg} transition-all`}>
              <stat.icon className={`text-3xl ${stat.iconColor} transition-colors`} />
            </div>
            <div>
              <div className={`text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${stat.text} transition-colors`}>{stat.label}</div>
              <div className="text-3xl md:text-4xl font-black text-white font-[family-name:var(--font-heading)]">
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Programs - FULL WIDTH */}
      <div className="pt-4">
        <PageTitle
          title="FEATURED"
          highlight="PROGRAMS"
          description="Explore our flagship competitive series and educational initiatives."
          centered
          className="mb-12"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Link href="/esports/events" className="block group">
            <div className="h-[450px] relative overflow-hidden rounded-[3rem] border border-white/5 group-hover:border-pink-500 transition-all backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-900/60 to-purple-900/60 z-10"></div>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200')] bg-cover bg-center group-hover:scale-105 transition-transform duration-[2s]"></div>
              <div className="relative z-20 h-full flex flex-col items-center justify-center text-center p-12">
                <div className="bg-pink-600 text-white text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-full mb-8 shadow-2xl">Now Live</div>
                <h3 className="font-black text-5xl md:text-7xl mb-6 text-white font-[family-name:var(--font-heading)] drop-shadow-2xl tracking-tighter leading-none">
                  ROCKET <br />RUSH
                </h3>
                <p className="text-lg font-bold text-white/80 uppercase tracking-[0.2em] mb-12">Season 1 Open For Registration</p>
                <span className="px-12 py-5 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-pink-500 hover:text-white transition-all transform active:scale-[0.98] text-xs shadow-2xl">Enter Now</span>
              </div>
            </div>
          </Link>

          <Link href="/initiative/program-deck" className="block group">
            <div className="h-[450px] relative overflow-hidden rounded-[3rem] border border-white/5 group-hover:border-cyan-500 transition-all backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-cyan-900/60 z-10"></div>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200')] bg-cover bg-center group-hover:scale-105 transition-transform duration-[2s]"></div>
              <div className="relative z-20 h-full flex flex-col items-center justify-center text-center p-12">
                <div className="bg-cyan-600 text-white text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-full mb-8 shadow-2xl">Coming Soon</div>
                <h3 className="font-black text-5xl md:text-7xl mb-6 text-white font-[family-name:var(--font-heading)] drop-shadow-2xl tracking-tighter leading-none">
                  INITIATIVE <br />LEAGUE
                </h3>
                <p className="text-lg font-bold text-white/80 uppercase tracking-[0.2em] mb-12">National High School Circuit</p>
                <span className="px-12 py-5 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-cyan-500 hover:text-white transition-all transform active:scale-[0.98] text-xs shadow-2xl">Learn More</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Featured Partner - HORIZONTAL */}
      <div className="pt-4">
        <div className="bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-[4rem] p-10 md:p-20 relative overflow-hidden group hover:border-cyan-500/20 transition-all">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[130px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="space-y-10 text-center lg:text-left order-2 lg:order-1">
              <div className="space-y-6">
                <p className="text-cyan-500 font-black uppercase tracking-[0.4em] text-[10px]">Official Technology Partner</p>
                <div className="space-y-4">
                  <h3 className="text-4xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase font-[family-name:var(--font-heading)] leading-none">
                    ARMOUR <br className="hidden md:block" /> STUDIOS
                  </h3>
                  <div className="h-[2px] w-48 bg-gradient-to-r from-cyan-500 to-transparent rounded-full mx-auto lg:mx-0"></div>
                </div>
              </div>

              <p className="text-gray-400 text-lg md:text-2xl font-bold leading-relaxed max-w-2xl mx-auto lg:mx-0">
                The premier freelance marketplace for the gaming industry. Find sponsorships, jobs, and opportunities built for gamers.
              </p>

              <div className="pt-4">
                <a
                  href="https://www.armour-studios.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 px-14 py-6 bg-white text-black hover:bg-cyan-500 hover:text-white rounded-2xl font-black uppercase tracking-[0.3em] transition-all shadow-2xl text-[10px] group/btn"
                >
                  Visit Website <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="w-48 h-48 md:w-64 md:h-64 lg:w-96 lg:h-96 relative group-hover:scale-110 transition-transform duration-1000">
                <Image
                  src="/armour-logo.png"
                  alt="Armour Studios"
                  fill
                  className="object-contain drop-shadow-[0_0_60px_rgba(6,182,212,0.4)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News & Broadcasts Area - CENTERED STACK */}
      <div className="space-y-32">
        {/* News Section */}
        <section>
          <div className="flex flex-col items-center mb-16">
            <PageTitle
              title="LATEST"
              highlight="NEWS"
              description="Stay updated with the latest from the Nameless Esports ecosystem."
              centered
              className="!mb-0"
            />
            <Link href="/news" className="mt-8 text-pink-500 font-black uppercase tracking-[0.4em] text-[10px] border border-pink-500/20 px-8 py-3 rounded-full hover:bg-pink-500 hover:text-white transition-all flex items-center gap-3 group">
              View All News <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {latestNews.map((article) => (
              <a key={article.id} href={article.link} target="_blank" rel="noopener noreferrer" className="group block">
                <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-pink-500/50 transition-all flex flex-col h-full hover:bg-white/[0.04]">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-10 flex flex-col justify-between flex-1 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-[10px] font-black text-pink-500 uppercase tracking-[0.3em]">
                        <FaCalendar className="text-xs" /> {article.date}
                      </div>
                      <h3 className="text-2xl font-black group-hover:text-pink-400 transition-colors text-white uppercase tracking-tight leading-tight font-[family-name:var(--font-heading)]">
                        {article.title}
                      </h3>
                      <p className="text-gray-400 text-sm font-medium leading-relaxed line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>
                    <div className="pt-6 border-t border-white/5 group-hover:border-pink-500/20 transition-colors">
                      <div className="text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 group-hover:gap-4 transition-all">
                        Read Story <FaArrowRight className="text-pink-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Broadcasts Section */}
        <YouTubeFeed centered />

        {/* Champions Section */}
        <section>
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-sm font-black text-white uppercase tracking-[0.4em] flex items-center gap-4 mb-8">
              <span className="w-12 h-[1px] bg-white/10" />
              LATEST <span className="text-pink-500">CHAMPIONS</span>
              <span className="w-12 h-[1px] bg-white/10" />
            </h2>
          </div>
          <div className="max-w-6xl mx-auto">
            <RecentChampions hideHeader />
          </div>
        </section>
      </div>

      {/* Footer CTA */}
      <section className="relative py-32 rounded-[4rem] overflow-hidden text-center border border-white/5 group">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/10 via-purple-900/10 to-indigo-900/10 opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-12">
          <h2 className="text-5xl md:text-8xl font-black font-[family-name:var(--font-heading)] leading-none text-white drop-shadow-2xl tracking-tighter uppercase">
            BECOME <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">NAMELESS</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 font-bold leading-relaxed max-w-2xl mx-auto">
            Ready to compete? Join our network of elite competitors and start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8">
            <Link href="/esports" className="px-16 py-6 bg-white text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-pink-500 hover:text-white transition-all shadow-2xl transform hover:scale-105 active:scale-95 text-[10px]">
              Start Competing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
