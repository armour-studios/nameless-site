'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageTitle from './PageTitle';

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
  videoUrl: string;
}

interface YouTubeFeedProps {
  centered?: boolean;
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

export default function YouTubeFeed({ centered }: YouTubeFeedProps) {
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

  if (loading || videos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-10 pt-12 border-t border-white/5">
      <div className={centered ? "flex flex-col items-center" : "flex items-center justify-between"}>
        <PageTitle
          title="LATEST"
          highlight="BROADCASTS"
          description=""
          centered={centered}
          className="!mb-0"
        />
        <Link href="/services" className={`${centered ? "mt-4" : ""} text-pink-500 font-bold hover:text-white transition-colors flex items-center gap-2 group text-sm uppercase tracking-widest`}>
          View All <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {videos.map((video) => (
          <motion.a
            key={video.id}
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            variants={itemVariants}
            className="group"
          >
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-pink-500/30 transition-all flex flex-col h-full shadow-2xl">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-pink-500 flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform">
                    <span className="text-white text-xl ml-1">▶</span>
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 group-hover:text-pink-500 transition-colors mb-4">
                  {video.title}
                </h3>
                <div className="mt-auto pt-4 flex justify-between items-center border-t border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{video.channelTitle}</span>
                  <span className="text-[10px] font-bold text-white/20">{new Date(video.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}
