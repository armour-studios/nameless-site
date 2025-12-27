"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaSave, FaImage, FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import dynamic from 'next/dynamic';
import { BannerUpload } from "@/components/BannerCropper";

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function NewsEditor({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Unwrap params using React.use()
    const { id } = use(params);
    const isNew = id === 'new';

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        coverImage: "",
        featuredImage: "",
        bannerImage: "",
        category: "General",
        tags: [] as string[],
        published: false,
        metaTitle: "",
        metaDescription: "",
        keywords: ""
    });
    const [tagInput, setTagInput] = useState("");

    useEffect(() => {
        if (!isNew) {
            fetch(`/api/admin/news/${id}`)
                .then(res => res.json())
                .then(data => {
                    setFormData(data);
                    setFetching(false);
                });
        } else {
            setFetching(false);
        }
    }, [id, isNew]);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => {
            let newFormData = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            };

            // Auto-slug if it's a new article and title changed
            if (isNew && name === "title") {
                newFormData.slug = value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');
            }

            return newFormData;
        });
    };

    const handleContentChange = (content: string) => {
        setFormData(prev => ({ ...prev, content }));
    };

    const handleAddTag = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tagToRemove)
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'coverImage' | 'featuredImage' | 'bannerImage' = 'coverImage') => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const uploadData = new FormData();
        uploadData.append("file", file);

        setUploading(true);
        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: uploadData
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, [field]: data.url }));
            } else {
                alert("Upload failed");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Error uploading image");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const url = isNew ? "/api/admin/news" : `/api/admin/news/${id}`;
        const method = isNew ? "POST" : "PUT";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.refresh(); // Refresh the list page data
                router.push("/admin/news");
            } else {
                alert("Error saving article");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    if (fetching) return <div className="p-10 text-white">Loading editor...</div>;

    return (
        <main className="min-h-screen pt-8 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
            {/* Custom Quill Styles for Dark Mode */}
            <style jsx global>{`
                .ql-toolbar {
                    background: #1a1a1a;
                    border-color: rgba(255,255,255,0.1) !important;
                    border-top-left-radius: 0.75rem;
                    border-top-right-radius: 0.75rem;
                }
                .ql-container {
                    background: rgba(0,0,0,0.3);
                    border-color: rgba(255,255,255,0.1) !important;
                    border-bottom-left-radius: 0.75rem;
                    border-bottom-right-radius: 0.75rem;
                    font-size: 1rem;
                    color: #fff;
                    min-height: 400px;
                }
                .ql-stroke { stroke: #ccc !important; }
                .ql-fill { fill: #ccc !important; }
                .ql-picker { color: #ccc !important; }
                .ql-picker-options { background-color: #1a1a1a !important; color: #fff !important; }
                
                /* Tooltip Styling */
                .ql-tooltip {
                    background-color: #1a1a1a !important;
                    border: 1px solid rgba(255,255,255,0.2) !important;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5) !important;
                    border-radius: 8px !important;
                    color: #fff !important;
                    padding: 10px !important;
                    left: 50% !important;
                    transform: translateX(-50%);
                }
                .ql-tooltip input[type=text] {
                    background-color: rgba(0,0,0,0.3) !important;
                    border: 1px solid rgba(255,255,255,0.1) !important;
                    color: #fff !important;
                    border-radius: 4px !important;
                    padding: 6px !important;
                    outline: none !important;
                }
                .ql-tooltip input[type=text]:focus {
                    border-color: #ec4899 !important; /* Pink-500 */
                }
                .ql-tooltip a.ql-action::after {
                    color: #ec4899 !important;
                    font-weight: bold !important;
                }
                .ql-tooltip a.ql-remove::before {
                    color: #ef4444 !important; /* Red-500 */
                }
            `}</style>

            <Link href="/admin/news" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
                <FaArrowLeft /> Back to List
            </Link>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-[family-name:var(--font-heading)] font-black text-white">
                        {isNew ? "Create" : "Edit"} <span className="text-gradient">Article</span>
                    </h1>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-pink-500 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-pink-600 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <FaSave /> {loading ? "Saving..." : "Save Article"}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Editor */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <label className="block text-gray-400 font-bold mb-2 uppercase text-xs tracking-widest">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-[#0a0014] border border-white/10 rounded-xl p-4 text-white text-xl font-bold focus:border-pink-500 focus:outline-none"
                                placeholder="Article Title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 font-bold mb-2 uppercase text-xs tracking-widest">Slug (URL)</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                className="w-full bg-[#0a0014] border border-white/10 rounded-xl p-3 text-gray-300 font-mono text-sm focus:border-pink-500 focus:outline-none"
                                placeholder="auto-generated-from-title"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 font-bold mb-2 uppercase text-xs tracking-widest">Content</label>
                            <div className="bg-[#0a0014] rounded-xl overflow-hidden">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.content}
                                    onChange={handleContentChange}
                                    modules={modules}
                                    className="h-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Settings */}
                    <div className="space-y-6">
                        <div className="bg-[#0a0014] border border-white/10 rounded-2xl p-6 space-y-6">
                            <div>
                                <label className="block text-gray-400 font-bold mb-2 uppercase text-xs tracking-widest">Status</label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.published ? 'bg-green-500' : 'bg-gray-600'}`}>
                                        <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${formData.published ? 'translate-x-6' : ''}`}></div>
                                    </div>
                                    <span className="text-white font-medium">{formData.published ? "Published" : "Draft"}</span>
                                    <input
                                        type="checkbox"
                                        name="published"
                                        checked={formData.published}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div>
                                <label className="block text-gray-400 font-bold mb-2 uppercase text-xs tracking-widest">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 focus:outline-none"
                                >
                                    <option value="General">General</option>
                                    <option value="Rocket League">Rocket League</option>
                                    <option value="Business">Business</option>
                                    <option value="Coaching">Coaching</option>
                                    <option value="Scholarships">Scholarships</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-400 font-bold mb-2 uppercase text-xs tracking-widest">Excerpt</label>
                                <textarea
                                    name="excerpt"
                                    value={formData.excerpt || ""}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-pink-500 focus:outline-none"
                                    placeholder="Short summary..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-gray-400 font-bold mb-2 uppercase text-xs tracking-widest">Cover Image</label>

                                {formData.coverImage ? (
                                    <div className="relative rounded-xl overflow-hidden border border-white/10 group">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={formData.coverImage} alt="Preview" className="w-full h-auto" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, coverImage: "" }))}
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
                                            onChange={(e) => handleImageUpload(e, 'coverImage')}
                                            className="hidden"
                                            id="cover-upload"
                                        />
                                        <label htmlFor="cover-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                            {uploading ? (
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                                            ) : (
                                                <>
                                                    <FaCloudUploadAlt className="text-4xl text-gray-400" />
                                                    <span className="text-sm text-gray-300 font-bold">Click to Upload</span>
                                                    <span className="text-xs text-gray-500">JPG, PNG, WebP (Max 5MB)</span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Banner Image with Cropper */}
                            <div>
                                <label className="block text-gray-400 font-bold mb-2 uppercase text-xs tracking-widest">Banner Image</label>
                                <BannerUpload
                                    value={formData.bannerImage}
                                    onChange={(url) => setFormData(p => ({ ...p, bannerImage: url }))}
                                />
                            </div>
                        </div>

                        {/* SEO & Metadata Settings */}
                        <div className="bg-[#0a0014] border border-white/10 rounded-2xl p-8 space-y-8">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter">SEO & Metadata</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Meta Title</label>
                                        <span className={`text-[10px] font-mono ${formData.metaTitle.length > 60 ? 'text-red-500' : 'text-gray-500'}`}>
                                            {formData.metaTitle.length}/60 characters
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        name="metaTitle"
                                        value={formData.metaTitle}
                                        onChange={handleChange}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-pink-500 focus:outline-none transition-all"
                                        placeholder="Enter meta title..."
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Meta Description</label>
                                        <span className={`text-[10px] font-mono ${formData.metaDescription.length > 160 ? 'text-red-500' : 'text-gray-500'}`}>
                                            {formData.metaDescription.length}/160 characters
                                        </span>
                                    </div>
                                    <textarea
                                        name="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-pink-500 focus:outline-none transition-all resize-none"
                                        placeholder="SEO description (160 characters max)"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-gray-400 font-bold mb-2 uppercase text-[10px] tracking-widest">Tags</label>
                                    <div className="flex gap-2 mb-4">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleAddTag();
                                                }
                                            }}
                                            className="flex-1 bg-black/50 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-pink-500 focus:outline-none"
                                            placeholder="Add a tag and press Enter"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleAddTag()}
                                            className="px-6 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all uppercase text-xs"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map(tag => (
                                            <span key={tag} className="flex items-center gap-2 bg-pink-500/10 text-pink-500 px-3 py-1.5 rounded-lg text-xs font-bold border border-pink-500/20">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                                                    <FaTimes />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}
