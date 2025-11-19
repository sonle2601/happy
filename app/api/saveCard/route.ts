import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@/app/generated/prisma/client';

cloudinary.config({
  cloud_name: 'dtxkcvzg4',
  api_key: '925467188465943',
  api_secret: 'I3kRnKEiuwLH4WJXoZ2hm2hySwo',
});

type CardBody = {
  // old fields (base64 payloads)
  imageData?: string;
  audioData?: string;
  // new/preferred: already-uploaded URLs from client
  imageUrl?: string;
  audioUrl?: string;
  message?: string;
  name?: string;
};

function slugify(input: string) {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function uploadBase64ToCloudinary(
  base64Data: string,
  folder: string,
  resourceType: 'image' | 'video'
) {
  // Keep server-side base64 upload logic for backwards compatibility
  const result = await cloudinary.uploader.upload(base64Data, {
    folder,
    resource_type: resourceType,
  });

  return result.secure_url;
}

export async function POST(request: Request) {
  const prisma = new PrismaClient();
  try {
    const body = (await request.json()) as CardBody;

    // Normalize and trim name; if provided, validate uniqueness before
    // performing any potentially expensive uploads.
    const rawName = body.name ?? null;
    const name = rawName && rawName.trim().length > 0 ? rawName.trim() : null;

    const slugName = name ? slugify(name) : null;

    if (slugName) {
      const existing = await prisma.user.findFirst({
        where: { name: { equals: slugName, mode: 'insensitive' } },
      });

      if (existing) {
        return NextResponse.json(
          { ok: false, error: 'Name already in use' },
          { status: 409 }
        );
      }
    }

    let imageUrl: string | null = null;
    let audioUrl: string | null = null;

    // If client already uploaded media to Cloudinary, prefer those URLs
    if (body.imageUrl) {
      imageUrl = body.imageUrl;
    } else if (body.imageData) {
      // If client sent base64, upload it here (backwards compatibility)
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

    if (body.audioUrl) {
      audioUrl = body.audioUrl;
    } else if (body.audioData) {
      let base64String = body.audioData;
      const matches = body.audioData.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        base64String = `data:${matches[1]};base64,${matches[2]}`;
      } else {
        base64String = `data:audio/mpeg;base64,${body.audioData}`;
      }

      // Use 'video' resource type for audio as before
      audioUrl = await uploadBase64ToCloudinary(
        base64String,
        'cards/audio',
        'video'
      );
    }

    const created = await prisma.user.create({
      data: {
        name: slugName ?? null,
        image: imageUrl ?? null,
        audio: audioUrl ?? null,
        messages: body.message ?? null,
      },
    });

    return NextResponse.json({ ok: true, entry: created });
  } catch (err: unknown) {
    console.error('saveCard error', err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
