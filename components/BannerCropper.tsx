'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { FaCrop, FaCheck, FaTimes, FaImage } from 'react-icons/fa';

interface BannerCropperProps {
    onComplete: (croppedImageUrl: string) => void;
    onCancel: () => void;
    imageUrl: string;
}

// Helper to create cropped image
async function getCroppedImg(imageSrc: string, pixelCrop: { x: number; y: number; width: number; height: number }): Promise<string> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Could not get canvas context');

    // Set canvas size to desired output (21:9 aspect ratio, 1260x540)
    canvas.width = 1260;
    canvas.height = 540;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        canvas.width,
        canvas.height
    );

    return canvas.toDataURL('image/jpeg', 0.9);
}

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', reject);
        image.crossOrigin = 'anonymous';
        image.src = url;
    });
}

export default function BannerCropper({ onComplete, onCancel, imageUrl }: BannerCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

    const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        if (!croppedAreaPixels) return;
        try {
            const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels);
            onComplete(croppedImage);
        } catch (e) {
            console.error('Error cropping image:', e);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <FaCrop className="text-pink-500" />
                    <span className="text-white font-bold">Crop Banner Image</span>
                    <span className="text-gray-500 text-sm">(21:9 aspect ratio)</span>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg flex items-center gap-2 hover:bg-gray-600 transition-colors"
                    >
                        <FaTimes /> Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg flex items-center gap-2 hover:bg-pink-600 hover:text-black transition-colors"
                    >
                        <FaCheck /> Apply Crop
                    </button>
                </div>
            </div>

            {/* Cropper Area */}
            <div className="flex-1 relative">
                <Cropper
                    image={imageUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={21 / 9}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    style={{
                        containerStyle: { background: '#000' },
                        cropAreaStyle: { border: '2px solid #ec4899' }
                    }}
                />
            </div>

            {/* Zoom Control */}
            <div className="p-4 border-t border-white/10 flex items-center justify-center gap-4">
                <span className="text-gray-400 text-sm">Zoom:</span>
                <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-64 accent-pink-500"
                />
                <span className="text-white text-sm w-12">{Math.round(zoom * 100)}%</span>
            </div>
        </div>
    );
}

// Upload button component for Banner with crop
interface BannerUploadProps {
    value: string;
    onChange: (url: string) => void;
}

export function BannerUpload({ value, onChange }: BannerUploadProps) {
    const [tempImage, setTempImage] = useState<string | null>(null);
    const [showCropper, setShowCropper] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setTempImage(reader.result as string);
            setShowCropper(true);
        };
        reader.readAsDataURL(file);
    };

    const handleCropComplete = async (croppedImage: string) => {
        // Convert base64 to blob and upload
        try {
            const blob = await fetch(croppedImage).then(r => r.blob());
            const formData = new FormData();
            formData.append('file', blob, 'banner.jpg');

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                onChange(data.url);
            } else {
                console.error('Upload response not ok:', res.status);
                alert('Failed to upload banner image');
            }
        } catch (e) {
            console.error('Upload failed:', e);
            alert('Failed to upload banner image');
        }

        setShowCropper(false);
        setTempImage(null);
    };

    const handleCancel = () => {
        setShowCropper(false);
        setTempImage(null);
    };

    return (
        <>
            {showCropper && tempImage && (
                <BannerCropper
                    imageUrl={tempImage}
                    onComplete={handleCropComplete}
                    onCancel={handleCancel}
                />
            )}

            {value ? (
                <div className="relative rounded-xl overflow-hidden border border-white/10 group">
                    <img src={value} alt="Banner Preview" className="w-full h-auto" />
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <FaTimes />
                    </button>
                </div>
            ) : (
                <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-pink-500/50 transition-colors">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="banner-upload-crop"
                    />
                    <label htmlFor="banner-upload-crop" className="cursor-pointer flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center">
                            <FaImage className="text-2xl text-pink-500" />
                        </div>
                        <div>
                            <span className="text-white font-bold block">Upload Banner Image</span>
                            <span className="text-xs text-gray-500">21:9 aspect ratio • Auto-crop</span>
                        </div>
                    </label>
                </div>
            )}
        </>
    );
}
