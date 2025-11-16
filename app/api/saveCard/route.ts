import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

type CardBody = {
  imageData?: string;
  audioData?: string;
  message?: string;
  name?: string;
};

const DATA_FILE = path.join(process.cwd(), 'data', 'cards.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

function parseDataUrl(dataUrl: string) {
  // data:[<mediatype>][;base64],<data>
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches) return null;
  return { mime: matches[1], base64: matches[2] };
}

async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

function extensionFromMime(mime: string) {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'audio/x-wav': 'wav',
    'audio/ogg': 'ogg',
    'audio/webm': 'webm',
  };
  return map[mime] || mime.split('/').pop() || 'bin';
}

async function saveBase64ToFile(base64: string, ext: string) {
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
  const filePath = path.join(UPLOAD_DIR, name);
  const buffer = Buffer.from(base64, 'base64');
  await fs.writeFile(filePath, buffer);
  return name;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CardBody;

    await ensureUploadDir();

    let imageFile: string | null = null;
    let audioFile: string | null = null;

    if (body.imageData) {
      const parsed = parseDataUrl(body.imageData);
      if (parsed) {
        const ext = extensionFromMime(parsed.mime);
        imageFile = await saveBase64ToFile(parsed.base64, ext);
      } else {
        // If not a data URL, assume it's plain base64 with jpeg
        const ext = 'jpg';
        imageFile = await saveBase64ToFile(body.imageData, ext);
      }
    }

    if (body.audioData) {
      const parsed = parseDataUrl(body.audioData);
      if (parsed) {
        const ext = extensionFromMime(parsed.mime);
        audioFile = await saveBase64ToFile(parsed.base64, ext);
      } else {
        // assume mp3
        audioFile = await saveBase64ToFile(body.audioData, 'mp3');
      }
    }

    // Read existing data file
    let existing: Array<Record<string, unknown>> = [];
    try {
      const content = await fs.readFile(DATA_FILE, 'utf8');
      const parsed = JSON.parse(content || '[]');
      if (Array.isArray(parsed)) {
        existing = parsed as Array<Record<string, unknown>>;
      } else {
        existing = [];
      }
    } catch {
      existing = [];
    }

    const newEntry = {
      id: Date.now().toString(),
      image: imageFile,
      audio: audioFile,
      message: body.message ?? null,
      name: body.name ?? null,
      timestamp: new Date().toISOString(),
    };

    existing.push(newEntry);

    await fs.writeFile(DATA_FILE, JSON.stringify(existing, null, 2), 'utf8');

    return NextResponse.json({ ok: true, entry: newEntry });
  } catch (err: unknown) {
    console.error('saveCard error', err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
