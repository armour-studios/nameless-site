'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
      staggerChildren: 0.1
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

export default function YouTubeFeed() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/youtube-feed');
        if (response.ok) {
          const data = await response.json();
          setVideos(data.videos.slice(0, 3) || []);
        }
      } catch (error) {
        console.error('Failed to fetch YouTube videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading || videos.length === 0) {
    return null;
  }

  return (
    <div className="mb-20">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl md:text-5xl font-black font-[family-name:var(--font-heading)] text-white">
          LATEST <span className="text-gradient">BROADCASTS</span>
        </h2>
        <Link href="/services" className="text-pink-500 font-bold hover:text-white transition-colors flex items-center gap-2 group">
          View All <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {videos.map((video) => (
          <motion.a
            key={video.id}
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            variants={itemVariants}
          >
            <Card className="overflow-hidden p-0 border-white/5 hover:border-purple-500/50 transition-all h-full flex flex-col group">
              <div className="relative w-full pt-[56.25%] overflow-hidden bg-black/50">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-purple-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-2xl text-white ml-1">▶</span>
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors text-white leading-tight line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  {video.channelTitle}
                </p>
                <div className="mt-auto text-gray-500 text-xs font-bold flex items-center gap-1">
                  {new Date(video.publishedAt).toLocaleDateString()}
                </div>
              </div>
            </Card>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}
