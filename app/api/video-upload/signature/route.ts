
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary credentials are missing" },
        { status: 500 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "video-uploads";
    const context = `user_id=${userId}`;

    const paramsToSign = {
      timestamp,
      folder,
      context,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret
    );

    return NextResponse.json({
      signature,
      timestamp,
      folder,
      context,
      cloudName,
      apiKey,
    });

  } catch (error) {
    console.error("Signature generation failed:", error);

    return NextResponse.json(
      { error: "Could not generate upload signature" },
      { status: 500 }
    );
  }
}