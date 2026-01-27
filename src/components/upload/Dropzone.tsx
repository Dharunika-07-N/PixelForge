"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface DropzoneProps {
    onUpload: (file: File) => void;
}

export default function Dropzone({ onUpload }: DropzoneProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const droppedFile = acceptedFiles[0];
        if (droppedFile) {
            setFile(droppedFile);
            const objectUrl = URL.createObjectURL(droppedFile);
            setPreview(objectUrl);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".webp"],
        },
        multiple: false,
    });

    const removeFile = () => {
        setFile(null);
        setPreview(null);
    };

    const handleUpload = () => {
        if (file) {
            onUpload(file);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {!preview ? (
                <div
                    {...getRootProps()}
                    className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all p-12 text-center
            ${isDragActive ? "border-blue-500 bg-blue-500/10" : "border-gray-800 hover:border-gray-700 bg-gray-900/50"}`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Upload your Design</h3>
                        <p className="text-gray-400 mb-2">Drag and drop or click to browse</p>
                        <p className="text-xs text-gray-500">Supports PNG, JPG, JPEG, WEBP (Max 10MB)</p>
                    </div>
                </div>
            ) : (
                <div className="relative rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden shadow-2xl">
                    <div className="aspect-video relative bg-black/40">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-contain"
                        />
                        <button
                            onClick={removeFile}
                            className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-red-500/80 rounded-full transition-all backdrop-blur-md"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                    <div className="p-6 flex justify-between items-center bg-gray-900/80 backdrop-blur-xl border-t border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600/20 rounded-lg">
                                <ImageIcon className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white truncate max-w-[200px]">{file?.name}</p>
                                <p className="text-xs text-gray-500">{(file?.size! / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <button
                            onClick={handleUpload}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-blue-600/20"
                        >
                            Process Image
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
