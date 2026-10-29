"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";

function VideoUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setSuccess("");
        setError("");

        if (!file) {
            setError("Please select a video file.");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError("File size must be less than 100 MB.");
            return;
        }

        setIsUploading(true);

        // Save the form reference before awaiting the request.
        const form = e.currentTarget;

        try {
            const formData = new FormData();

            formData.append("file", file);
            formData.append("title", title);
            formData.append("description", description);
            formData.append("originalSize", file.size.toString());

            const response = await axios.post(
                "/api/video-upload",
                formData
            );

            if (response.status >= 200 && response.status < 300) {
                // Show success message.
                setSuccess("Video uploaded successfully!");

                // Clear controlled input states.
                setTitle("");
                setDescription("");
                setFile(null);

                // Clear the browser's form fields and file picker.
                form.reset();
            }
        } catch (err) {
            console.error("Video upload failed:", err);

            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.error ??
                    "Video upload failed. Please try again."
                );
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl p-4">
            <h1 className="mb-6 text-2xl font-bold">
                Upload Video
            </h1>

            {/* Success message */}
            {success && (
                <div
                    role="status"
                    aria-live="polite"
                    className="mb-5 rounded-lg border border-green-300 bg-green-100 p-4 text-green-800"
                >
                    <p className="font-semibold">
                        ✓ {success}
                    </p>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div
                    role="alert"
                    className="mb-5 rounded-lg border border-red-300 bg-red-100 p-4 text-red-800"
                >
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                {/* Video title */}
                <div>
                    <label
                        htmlFor="title"
                        className="label"
                    >
                        <span className="label-text">
                            Title
                        </span>
                    </label>

                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        className="input input-bordered w-full"
                        placeholder="Enter video title"
                        required
                        disabled={isUploading}
                    />
                </div>

                {/* Video description */}
                <div>
                    <label
                        htmlFor="description"
                        className="label"
                    >
                        <span className="label-text">
                            Description
                        </span>
                    </label>

                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        className="textarea textarea-bordered w-full"
                        placeholder="Enter video description"
                        rows={4}
                        disabled={isUploading}
                    />
                </div>

                {/* Video file */}
                <div>
                    <label
                        htmlFor="file"
                        className="label"
                    >
                        <span className="label-text">
                            Video File (Max 100 MB)
                        </span>
                    </label>

                    <input
                        id="file"
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                            setFile(
                                e.target.files?.[0] ?? null
                            )
                        }
                        className="file-input file-input-bordered w-full"
                        required
                        disabled={isUploading}
                    />

                    {file && (
                        <p className="mt-2 text-sm text-gray-500">
                            Selected: {file.name} (
                            {(file.size / (1024 * 1024)).toFixed(2)} MB)
                        </p>
                    )}
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={isUploading}
                >
                    {isUploading ? (
                        <>
                            <span className="loading loading-spinner loading-sm" />
                            Uploading video...
                        </>
                    ) : (
                        "Upload Video"
                    )}
                </button>
            </form>
        </div>
    );
}

export default VideoUpload;