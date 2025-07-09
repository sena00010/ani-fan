"use client";
import { useEffect } from "react";
import { X } from "lucide-react";

interface ImageZoomModalProps {
    imageUrl: string;
    onClose: () => void;
}

const ImageZoomModal: React.FC<ImageZoomModalProps> = ({ imageUrl, onClose }) => {
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center"
            onClick={onClose}
        >
            <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <img
                    src={imageUrl}
                    alt="Zoomed Image"
                    className="max-w-full max-h-[90vh] object-contain rounded-md shadow-lg"
                />
                <button
                    onClick={onClose}
                    className="absolute -top-4 -right-4 bg-white/10 backdrop-blur p-2 rounded-full hover:bg-white/20 transition"
                >
                    <X className="w-6 h-6 text-white" />
                </button>
            </div>
        </div>
    );
};

export default ImageZoomModal;
