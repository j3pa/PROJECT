import { getServerSession } from '@/app/lib/auth';

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return Response.json({ user: null }, { status: 401 });
  }

  return Response.json({
    user: {
      username: session.username,
      role: session.role,
    },
  });
}
