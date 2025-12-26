'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import { motion } from 'framer-motion';
import { FaMicrophone, FaCamera, FaStar, FaUsers, FaCheckCircle, FaFire } from 'react-icons/fa';
import Link from 'next/link';

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
    color: 'from-purple-400 to-pink-500',
    accentColor: 'purple',
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
    color: 'from-cyan-400 to-blue-500',
    accentColor: 'cyan',
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
    color: 'from-pink-400 to-red-500',
    accentColor: 'pink',
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
    color: 'from-yellow-400 to-orange-500',
    accentColor: 'yellow',
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
  { number: '8+', label: 'Tournament Admins', icon: FaFire, color: 'text-yellow-400' },
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
    <main className="min-h-screen pb-10 sm:pb-20 px-3 sm:px-4 md:px-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12 pt-6 sm:pt-8"
      >
        <h1 className="text-3xl sm:text-4xl md:text-7xl font-[family-name:var(--font-heading)] font-black text-white uppercase tracking-tighter">
          OUR <span className="text-gradient">SERVICES</span>
        </h1>
        <div className="h-[2px] flex-1 bg-gradient-to-r from-purple-500 to-transparent"></div>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <Card className="relative overflow-hidden p-0 border-white/10 bg-[#0a1128]">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 p-6 sm:p-8 md:p-12 z-10 flex flex-col justify-center">
              <div className="inline-block bg-purple-500/10 text-purple-400 text-xs font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] px-3 sm:px-4 py-2 rounded-lg mb-4 sm:mb-6 border border-purple-500/20 w-fit">
                Professional Services
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 sm:mb-6 text-white font-[family-name:var(--font-heading)] leading-none">
                COMPLETE <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">ESPORTS PRODUCTION</span>
              </h2>
              <p className="text-base sm:text-xl text-gray-300 mb-3 sm:mb-4 leading-relaxed max-w-2xl font-medium">
                From casting to community management, we provide <strong className="text-white">comprehensive production services</strong> to elevate your tournaments and events.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <Link href="#services" className="btn-primary px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg text-center">
                  Explore Services
                </Link>
                <a href="#contact" className="btn-outline px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg text-center">
                  Get a Quote
                </a>
              </div>
            </div>
            <div className="lg:col-span-5 relative h-80 lg:h-auto overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a1128] via-transparent to-transparent z-10 hidden lg:block"></div>
              <img
                src="https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=1000"
                alt="Esports Production"
                className="w-full h-full object-cover grayscale opacity-40"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <FaMicrophone className="text-[12rem] text-purple-500/20" />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Team Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-20"
      >
        {teamStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={itemVariants}>
              <Card className="text-center py-10 bg-white/5 border-white/5 group hover:border-purple-500/30 transition-all">
                <div className={`p-4 bg-purple-500/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-500/20 transition-all`}>
                  <Icon className={`text-4xl ${stat.color}`} />
                </div>
                <div className="text-5xl font-black text-white mb-2 font-[family-name:var(--font-heading)]">{stat.number}</div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Services Packages */}
      <motion.div
        id="services"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-4xl font-black mb-8 text-white font-[family-name:var(--font-heading)]">
          <FaUsers className="inline mr-4 text-purple-400" />
          Service Packages
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {servicePackages.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Card className={`bg-gradient-to-br from-${service.accentColor}-900/10 to-pink-900/10 border-${service.accentColor}-500/20 group hover:border-${service.accentColor}-500/50 transition-all`}>
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`p-3 bg-${service.accentColor}-500/10 rounded-lg group-hover:bg-${service.accentColor}-500/20 transition-all`}>
                      <Icon className={`text-2xl text-${service.accentColor}-400`} />
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold text-${service.accentColor}-400`}>{service.name}</h3>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <FaCheckCircle className={`text-${service.accentColor}-400 mt-1 flex-shrink-0`} />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Latest Broadcasts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-4xl font-black mb-2 text-white font-[family-name:var(--font-heading)]">
          Latest Broadcasts
        </h2>
        <p className="text-gray-400 mb-8">Check out our recent broadcasts and production highlights</p>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading videos...</div>
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
                <Card className="group overflow-hidden cursor-pointer bg-white/5 border-white/5 hover:border-purple-500/30 transition-all h-full">
                  <div className="relative w-full pt-[56.25%] overflow-hidden bg-black/50">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-purple-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-2xl text-white ml-1">▶</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-sm text-purple-400 mb-2">{video.channelTitle}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              </motion.a>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 bg-white/5 border-white/5">
            <p className="text-gray-400">No videos available at the moment. Check back soon!</p>
          </Card>
        )}
      </motion.div>

      {/* CTA Section */}
      <motion.div
        id="contact"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30 text-center py-12 md:py-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4 text-white font-[family-name:var(--font-heading)]">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Elevate Your Event?</span>
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us today to discuss how we can make your tournament unforgettable with our comprehensive production services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary px-10 py-4 text-lg">
              Get in Touch
            </Link>
            <a href="mailto:contact@namelessesports.com" className="btn-outline px-10 py-4 text-lg">
              Email Us
            </a>
          </div>
        </Card>
      </motion.div>
    </main>
  );
}
