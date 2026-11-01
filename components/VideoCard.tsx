
"use client";

import React, { useState, useCallback } from "react";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import {
    Download,
    Clock,
    FileDown,
    FileUp,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { filesize } from "filesize";
import { Video } from "@/types";

dayjs.extend(relativeTime);

interface VideoCardProps {
    video: Video;
    onDownload: (url: string, title: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
    video,
    onDownload,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [previewError, setPreviewError] = useState(false);

    // Generate video thumbnail
    const getThumbnailUrl = useCallback((publicId: string) => {
        return getCldImageUrl({
            src: publicId,
            width: 400,
            height: 225,
            crop: "fill",
            gravity: "auto",
            format: "jpg",
            quality: "auto",
            assetType: "video",
        });
    }, []);

    // Generate optimized MP4 download URL
    const getFullVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            rawTransformations: [
                "q_auto:good,f_mp4,vc_h264",
            ],
        });
    }, []);

    // Generate optimized preview video URL
    const getPreviewVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 400,
            height: 225,
            rawTransformations: [
                "q_auto:good",
                "e_preview:duration_15:max_seg_9:min_seg_dur_1",
            ],
        });
    }, []);

    // Format file size
    const formatSize = useCallback((size: number) => {
        return filesize(size);
    }, []);

    // Convert seconds into mm:ss format
    const formatDuration = useCallback((seconds: number) => {
        if (!Number.isFinite(seconds) || seconds <= 0) {
            return "0:00";
        }

        const totalSeconds = Math.floor(seconds);
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;

        return `${minutes}:${remainingSeconds
            .toString()
            .padStart(2, "0")}`;
    }, []);

    // Get file sizes from database
    const originalSize = Number(video.originalSize) || 0;
    const compressedSize = Number(video.compressedSize) || 0;

    // Calculate compression percentage
    const compressionPercentage =
        originalSize > 0
            ? Math.round(
                (1 - compressedSize / originalSize) * 100
            )
            : 0;

    const handlePreviewError = () => {
        setPreviewError(true);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        setPreviewError(false);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Video Thumbnail / Preview */}
            <figure className="aspect-video relative">

                {isHovered ? (
                    previewError ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <p className="text-red-500">
                                Preview not available
                            </p>
                        </div>
                    ) : (
                        <video
                            src={getPreviewVideoUrl(video.publicId)}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                            onError={handlePreviewError}
                        />
                    )
                ) : (
                    <img
                        src={getThumbnailUrl(video.publicId)}
                        alt={video.title}
                        className="w-full h-full object-cover"
                    />
                )}

                {/* Video Duration */}
                <div className="absolute bottom-2 right-2 bg-base-100 bg-opacity-70 px-2 py-1 rounded-lg text-sm flex items-center">
                    <Clock size={16} className="mr-1" />
                    {formatDuration(Number(video.duration))}
                </div>

            </figure>

            {/* Video Details */}
            <div className="card-body p-4">

                <h2 className="card-title text-lg font-bold">
                    {video.title}
                </h2>

                <p className="text-sm text-base-content opacity-70 mb-4">
                    {video.description}
                </p>

                <p className="text-sm text-base-content opacity-70 mb-4">
                    Uploaded {dayjs(video.createdAt).fromNow()}
                </p>

                {/* Original and Compressed Sizes */}
                <div className="grid grid-cols-2 gap-4 text-sm">

                    <div className="flex items-center">
                        <FileUp
                            size={18}
                            className="mr-2 text-primary"
                        />

                        <div>
                            <div className="font-semibold">
                                Original
                            </div>

                            <div>
                                {formatSize(originalSize)}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <FileDown
                            size={18}
                            className="mr-2 text-secondary"
                        />

                        <div>
                            <div className="font-semibold">
                                Compressed
                            </div>

                            <div>
                                {formatSize(compressedSize)}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Compression Percentage and Download */}
                <div className="flex justify-between items-center mt-4">

                    <div className="text-sm font-semibold">
                        Compression:{" "}

                        <span className="text-accent">
                            {compressionPercentage}%
                        </span>
                    </div>

                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                            onDownload(
                                getFullVideoUrl(video.publicId),
                                video.title
                            )
                        }
                        aria-label={`Download ${video.title}`}
                    >
                        <Download size={16} />
                    </button>

                </div>

            </div>
        </div>
    );
};

export default VideoCard;
