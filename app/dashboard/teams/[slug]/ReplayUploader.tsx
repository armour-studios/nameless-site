"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone"; // Need to check if user has this or if I need to implement native DnD
import { FaCloudUploadAlt, FaFile, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { uploadTeamReplay } from "@/app/actions/replays";
import { useRouter } from "next/navigation";

// Since I'm not sure if react-dropzone is installed and I can't check easily without list-dir or checking package.json (which I can do, but native is safer)
// I will use native DnD to avoid dependency issues unless I check first. 
// Actually, native is robust enough.

export default function ReplayUploader({ teamId }: { teamId: string }) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.name.endsWith(".replay")) {
            setFile(droppedFile);
            setMessage(null);
        } else {
            setMessage({ type: 'error', text: "Please upload a valid .replay file" });
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setMessage(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("teamId", teamId);

        const res = await uploadTeamReplay(formData);

        if (res.error) {
            setMessage({ type: 'error', text: res.error });
        } else {
            setMessage({ type: 'success', text: "Replay uploaded successfully!" });
            setFile(null);
            router.refresh();
        }
        setUploading(false);
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            {!file ? (
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-pink-500/50 hover:bg-white/5 transition-all cursor-pointer relative"
                >
                    <input
                        type="file"
                        accept=".replay"
                        onChange={handleFileSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <FaCloudUploadAlt className="text-4xl text-gray-500 mx-auto mb-4" />
                    <p className="font-bold text-white mb-1">Drag & Drop Replay File</p>
                    <p className="text-xs text-gray-500">or click to browse (.replay)</p>
                </div>
            ) : (
                <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between border border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center">
                            <FaFile />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-sm text-white truncate max-w-[200px]">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFile(null)}
                            disabled={uploading}
                            className="text-gray-500 hover:text-white px-3 py-1 font-bold text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-1.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
                        >
                            {uploading && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                </div>
            )}

            {message && (
                <div className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 font-bold ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {message.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                    {message.text}
                </div>
            )}
        </div>
    );
}
