"use client";

import React, { useEffect, useState } from 'react';
import Card from '@/components/Card';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { FaGlobeAmericas, FaMapMarkerAlt } from 'react-icons/fa';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface Location {
    id: string | number;
    name: string;
    city: string;
    countryCode: string;
    lat: number;
    lng: number;
    eventCount: number;
}

interface GeographicHeatmapProps {
    locations: Location[];
}

export default function GeographicHeatmap({ locations }: GeographicHeatmapProps) {
    const [icon, setIcon] = useState<any>(null);

    useEffect(() => {
        // Fix for default marker icon issues in Leaflet + Next.js
        const L = require('leaflet');
        const customIcon = new L.Icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        setIcon(customIcon);
    }, []);

    // Empty state if no physical locations
    if (locations.length === 0) {
        return (
            <Card className="bg-gray-900/40 border-white/5 p-8 flex flex-col items-center justify-center h-[400px]">
                <FaGlobeAmericas className="text-5xl text-gray-700 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Global Presence</h3>
                <p className="text-gray-500 text-center max-w-xs">
                    Tournament locations will be mapped here. Currently, events appear to be 100% online.
                </p>
            </Card>
        );
    }

    return (
        <Card className="bg-gray-900/40 border-white/5 p-6 h-[400px]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white">Geographic Reach</h3>
                    <p className="text-xs text-gray-500">Distribution of physical tournament venues</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
                    <FaMapMarkerAlt />
                </div>
            </div>

            <div className="h-[280px] w-full rounded-xl overflow-hidden border border-white/10 z-0">
                <MapContainer
                    center={[20, 0]}
                    zoom={2}
                    scrollWheelZoom={false}
                    className="h-full w-full bg-[#0B0F1A]"
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {locations.map(loc => icon && (
                        <Marker
                            key={loc.id}
                            position={[loc.lat, loc.lng]}
                            icon={icon}
                        >
                            <Popup>
                                <div className="p-2">
                                    <h4 className="font-bold text-gray-900">{loc.name}</h4>
                                    <p className="text-xs text-gray-600">{loc.city}, {loc.countryCode}</p>
                                    <div className="mt-2 text-xs font-black text-indigo-600">
                                        {loc.eventCount} {loc.eventCount === 1 ? 'Event' : 'Events'}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            <div className="mt-4 flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
                {locations.slice(0, 5).map(loc => (
                    <div key={loc.id} className="flex-shrink-0">
                        <div className="text-[10px] text-gray-500 uppercase font-black">{loc.countryCode}</div>
                        <div className="text-xs font-bold text-white">{loc.city}</div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
