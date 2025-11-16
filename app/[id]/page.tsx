import ClientGreetingWrapper from '../components/ClientGreetingWrapper';
import { PrismaClient } from '@/app/generated/prisma/client';

type CardEntry = {
  id: string;
  name?: string | null;
  message?: string | null;
  image?: string | null;
  audio?: string | null;
  timestamp?: string;
};

async function readCards(): Promise<CardEntry[]> {
  const prisma = new PrismaClient();
  try {
    const users = await prisma.user.findMany();
    return users.map((u) => ({
      id: String(u.id),
      name: u.name ?? null,
      message: u.messages ?? null,
      image: u.image ?? null,
      audio: u.audio ?? null,
      timestamp: u.createdAt ? u.createdAt.toISOString() : undefined,
    }));
  } catch (e) {
    console.error('readCards db error', e);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

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

export default async function CardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cards = await readCards();
  const match = cards.find((c) => {
    if (!c.name) return false;
    return slugify(c.name) === id;
  });

  // local client state for envelope interaction
  // GreetingCard is a client component, so render it inside a wrapper that
  // provides the interactive state.
  return (
    <div className="relative w-full h-screen overflow-hidden bg-linear-to-br from-[#CDEAFF] via-[#E0F2FF] to-[#B8E0FF] flex items-center justify-center">
      {/* Animated background stickers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Hearts */}
        <div
          className="absolute top-20 left-10 text-2xl animate-float"
          style={{ animationDelay: '0s' }}
        >
          ❤️
        </div>
        <div
          className="absolute top-[60%] right-16 text-xl animate-float-slow"
          style={{ animationDelay: '1.5s' }}
        >
          💛
        </div>
        <div
          className="absolute bottom-32 left-20 text-lg animate-float"
          style={{ animationDelay: '3s' }}
        >
          💙
        </div>

        {/* Stars */}
        <div className="absolute top-40 right-24 text-2xl animate-spin-slow">
          ⭐
        </div>
        <div
          className="absolute top-[70%] left-16 text-xl animate-twinkle"
          style={{ animationDelay: '0.5s' }}
        >
          ✨
        </div>
        <div
          className="absolute bottom-48 right-20 text-lg animate-spin-slow"
          style={{ animationDelay: '2s' }}
        >
          🌟
        </div>
        <div
          className="absolute top-[30%] left-24 text-sm animate-twinkle"
          style={{ animationDelay: '1s' }}
        >
          ✨
        </div>

        {/* Small decorative elements */}
        <div className="absolute top-60 right-12 w-3 h-3 bg-yellow-300/60 rounded-full animate-pulse-slow" />
        <div
          className="absolute top-[50%] left-12 w-2 h-2 bg-pink-300/70 rounded-full animate-bounce-slow"
          style={{ animationDelay: '0.5s' }}
        />
        <div
          className="absolute bottom-40 right-28 w-2.5 h-2.5 bg-blue-300/60 rounded-full animate-pulse-slow"
          style={{ animationDelay: '1s' }}
        />

        {/* Additional sparkles */}
        <div
          className="absolute top-[15%] right-[40%] text-sm animate-twinkle"
          style={{ animationDelay: '2.5s' }}
        >
          ✨
        </div>
        <div
          className="absolute bottom-[20%] left-[35%] text-xs animate-twinkle"
          style={{ animationDelay: '1.8s' }}
        >
          💫
        </div>
      </div>

      {/* Mobile Frame Container */}
      <div className="relative w-[390px] h-[844px] flex items-center justify-center">
        {/* Client-side interactive wrapper */}
        <ClientGreetingWrapper card={match ?? null} />
      </div>
    </div>
  );
}
