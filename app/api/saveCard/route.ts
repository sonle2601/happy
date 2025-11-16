import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@/app/generated/prisma/client';

cloudinary.config({
  cloud_name: 'dtxkcvzg4',
  api_key: '925467188465943',
  api_secret: 'I3kRnKEiuwLH4WJXoZ2hm2hySwo',
});

type CardBody = {
  imageData?: string;
  audioData?: string;
  message?: string;
  name?: string;
};

async function uploadBase64ToCloudinary(
  base64Data: string,
  folder: string,
  resourceType: 'image' | 'video'
) {
  // Upload base64 trực tiếp lên Cloudinary
  const result = await cloudinary.uploader.upload(base64Data, {
    folder,
    resource_type: resourceType,
  });

  return result.secure_url;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CardBody;

    const prisma = new PrismaClient();

    let imageUrl: string | null = null;
    let audioUrl: string | null = null;

    if (body.imageData) {
      // Kiểm tra nếu là data URL, giữ nguyên logic parseDataUrl
      let base64String = body.imageData;
      const matches = body.imageData.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        base64String = `data:${matches[1]};base64,${matches[2]}`;
      } else {
        base64String = `data:image/jpeg;base64,${body.imageData}`;
      }

      imageUrl = await uploadBase64ToCloudinary(
        base64String,
        'cards/images',
        'image'
      );
    }

    if (body.audioData) {
      let base64String = body.audioData;
      const matches = body.audioData.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        base64String = `data:${matches[1]};base64,${matches[2]}`;
      } else {
        // Nếu không phải data URL, giả sử là base64 thuần, thêm tiền tố
        base64String = `data:audio/mpeg;base64,${body.audioData}`;
      }

      // Quan trọng: Dùng 'video' cho audio
      audioUrl = await uploadBase64ToCloudinary(
        base64String,
        'cards/audio',
        'video'
      );
    }

    const created = await prisma.user.create({
      data: {
        name: body.name ?? null,
        image: imageUrl ?? null, // Lưu URL Cloudinary
        audio: audioUrl ?? null, // Lưu URL Cloudinary
        messages: body.message ?? null,
      },
    });

    console.log('Created entry:', created);

    return NextResponse.json({ ok: true, entry: created });
  } catch (err: unknown) {
    console.error('saveCard error', err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
