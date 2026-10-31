
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 100 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      title,
      description,
      publicId,
      originalSize,
    } = body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      title.length > 200 ||
      typeof description !== "string" ||
      typeof publicId !== "string" ||
      !publicId.trim() ||
      typeof originalSize !== "number" ||
      !Number.isSafeInteger(originalSize) ||
      originalSize <= 0 ||
      originalSize > MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        { error: "Invalid video information" },
        { status: 400 }
      );
    }

    if (
      !process.env.CLOUDINARY_API_SECRET ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    ) {
      return NextResponse.json(
        { error: "Cloudinary configuration is missing" },
        { status: 500 }
      );
    }

    // Verify the actual uploaded video with Cloudinary.
    const result = await cloudinary.api.resource(publicId, {
      resource_type: "video",
      context: true,
    });

    // Verify ownership.
    if (result.context?.custom?.user_id !== userId) {
      return NextResponse.json(
        { error: "Video ownership verification failed" },
        { status: 403 }
      );
    }

    // Enforce actual uploaded file size.
    if (result.bytes > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Video exceeds the 100 MB limit" },
        { status: 400 }
      );
    }

    const video = await prisma.video.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        publicId: result.public_id,
        originalSize: String(originalSize),
        compressedSize: String(result.bytes),
        duration: result.duration || 0,
      },
    });

    return NextResponse.json(video, {
      status: 201,
    });

  } catch (error) {
    console.error("Video metadata save failed:", error);

    return NextResponse.json(
      { error: "Could not save video information" },
      { status: 500 }
    );
  }
}
