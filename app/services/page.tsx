'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import { motion } from 'framer-motion';
import { FaMicrophone, FaCamera, FaStar, FaUsers, FaCheckCircle, FaFire, FaArrowRight, FaGamepad, FaBroadcastTower } from 'react-icons/fa';
import Link from 'next/link';
import PageTitle from '@/components/PageTitle';

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
  videoUrl: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const servicePackages = [
  {
    id: 'casting',
    name: 'Casting & Commentary',
    icon: FaMicrophone,
    color: 'purple',
    accent: 'from-purple-500/20 to-transparent',
    features: [
      '30+ professional casters',
      'Multiple commentary styles',
      'Real-time production coordination',
      'Multi-language support',
      'Custom talent matching'
    ]
  },
  {
    id: 'production',
    name: 'Full Production',
    icon: FaCamera,
    color: 'cyan',
    accent: 'from-cyan-500/20 to-transparent',
    features: [
      'Production coordinators',
      'Technical stream management',
      'Custom overlays & graphics',
      'Multi-platform streaming',
      'Real-time technical support'
    ]
  },
  {
    id: 'social',
    name: 'Social Media',
    icon: FaStar,
    color: 'pink',
    accent: 'from-pink-500/20 to-transparent',
    features: [
      '2+ dedicated coordinators',
      'Live updates & engagement',
      'Content creation & editing',
      'Community management',
      'Multi-platform management'
    ]
  },
  {
    id: 'tournament',
    name: 'Tournament Admin',
    icon: FaFire,
    color: 'orange',
    accent: 'from-orange-500/20 to-transparent',
    features: [
      'Experienced tournament admins',
      'Bracket management & seeding',
      'Rules enforcement',
      'Player/Team management',
      'Schedule optimization'
    ]
  }
];

const teamStats = [
  { number: '30+', label: 'Professional Casters', icon: FaMicrophone, color: 'text-purple-400' },
  { number: '2+', label: 'Social Media Coordinators', icon: FaStar, color: 'text-pink-400' },
  { number: '8+', label: 'Tournament Admins', icon: FaFire, color: 'text-orange-400' },
  { number: '10+', label: 'Production Coordinators', icon: FaCamera, color: 'text-cyan-400' }
];

export default function ServicesPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/youtube-feed');
        if (response.ok) {
          const data = await response.json();
          setVideos(data.videos.slice(0, 6) || []);
        }
      } catch (error) {
        console.error('Failed to fetch YouTube videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <main className="min-h-screen pb-20 px-4 md:px-8 max-w-[1600px] mx-auto space-y-24">
      <PageTitle
        title="OUR"
        highlight="SERVICES"
        description="Comprehensive production and management solutions to elevate your esports tournaments and events."
      />

      {/* Premium Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-[#0a0014] border border-white/10 rounded-[3rem] overflow-hidden group">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-10 md:p-16 space-y-8 flex flex-col justify-center">
              <div className="inline-flex items-center gap-3 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-xl">
                <FaBroadcastTower className="text-purple-400 text-xs animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">Professional Excellence</span>
              </div>
              <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.85] font-[family-name:var(--font-heading)]">COMPLETE <br /><span className="text-purple-500">PRODUCTION</span></h2>
              <p className="text-white/40 text-lg md:text-xl font-medium leading-relaxed">
                From world-class casting to turnkey community management, we provide everything needed to transform your vision into a professional broadcast.
              </p>
              <div className="flex flex-wrap gap-6 pt-4">
                <Link href="#services" className="px-12 py-5 bg-white text-black hover:bg-purple-500 hover:text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-2xl">
                  Explore Services
                </Link>
                <Link href="/contact" className="px-12 py-5 bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 backdrop-blur-md">
                  Get A Quote
                </Link>
              </div>
            </div>
            <div className="relative min-h-[400px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070"
                alt="Production Desk"
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-50 transition-all duration-[2s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-[#0a0014] via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Team Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {teamStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={itemVariants}>
              <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 text-center space-y-6 hover:bg-white/[0.05] transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Icon className={`text-3xl ${stat.color}`} />
                </div>
                <div>
                  <div className="text-5xl font-black text-white tracking-tighter mb-1 font-[family-name:var(--font-heading)]">{stat.number}</div>
                  <div className="text-white/20 text-xs font-black uppercase tracking-widest">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Service Packages */}
      <motion.section
        id="services"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-12"
      >
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
            <FaUsers className="text-2xl text-purple-500" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">SERVICE <span className="text-purple-500">PACKAGES</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicePackages.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div key={service.id} variants={itemVariants}>
                <div className="h-full bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 md:p-12 space-y-8 relative overflow-hidden group hover:bg-white/[0.05] transition-all">
                  <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${service.accent} blur-3xl -mr-32 -mt-32 opacity-20 pointer-events-none`} />

                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className={`text-3xl text-${service.color}-400`} />
                    </div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight font-[family-name:var(--font-heading)] mt-2">{service.name}</h3>
                  </div>

                  <ul className="space-y-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-4 group/item">
                        <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center group-hover/item:border-white/20 transition-colors">
                          <FaCheckCircle className={`text-[10px] text-${service.color}-500`} />
                        </div>
                        <span className="text-white/60 text-sm font-medium leading-relaxed group-hover/item:text-white transition-colors">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Latest Broadcasts */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-12"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <FaCamera className="text-2xl text-red-500" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">LATEST <span className="text-red-500">BROADCASTS</span></h2>
          </div>
          <Link href="https://youtube.com/@namelessesports" target="_blank" className="hidden sm:flex items-center gap-3 text-white/40 font-black uppercase tracking-[0.3em] text-[10px] hover:text-white transition-colors group">
            Watch All <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[300px] rounded-[2rem] bg-white/5 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <motion.a
                key={video.id}
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="group relative overflow-hidden rounded-[2rem] bg-white/[0.03] border border-white/10 transition-all hover:bg-white/[0.05] h-full flex flex-col">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                        <FaBroadcastTower className="text-2xl" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 inline-block px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white/60">
                      {video.channelTitle}
                    </div>
                  </div>
                  <div className="p-8 space-y-4 flex-1">
                    <h4 className="font-black text-white uppercase tracking-tight text-lg line-clamp-2 leading-tight">
                      {video.title}
                    </h4>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/20">
                      {new Date(video.publishedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-12 text-center">
            <p className="text-white/40 font-medium">No live broadcasts archived at this time.</p>
          </div>
        )}
      </motion.section>

      {/* CTA Section */}
      <motion.div
        id="contact"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <div className="bg-gradient-to-br from-[#1a0a2e] to-[#0a0014] border border-white/10 rounded-[3rem] p-12 md:p-24 text-center space-y-10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <h2 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-8">ELEVATE YOUR <br /><span className="text-purple-500">EVENT</span></h2>
          <p className="text-white/40 text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-12">
            Contact us today to discuss how we can transform your tournament into a professional broadcast experience.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/contact" className="px-12 py-5 bg-white text-black hover:bg-purple-500 hover:text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-2xl flex items-center gap-3">
              Get in Touch <FaArrowRight />
            </Link>
            <a href="mailto:contact@namelessesports.com" className="px-12 py-5 bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 backdrop-blur-md">
              Email Us
            </a>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
