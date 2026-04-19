import { db } from '@/lib/db';
import { staff } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const [updated] = await db
      .update(staff)
      .set(data)
      .where(eq(staff.id, id))
      .returning();

    if (!updated) {
      return Response.json({ error: 'Staff member not found' }, { status: 404 });
    }

    return Response.json(updated);
  } catch (error) {
    console.error('Staff update error:', error);
    return Response.json({ error: 'Failed to update staff' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const [deleted] = await db
      .delete(staff)
      .where(eq(staff.id, id))
      .returning();

    return Response.json({ success: true });
  } catch (error) {
    console.error('Staff delete error:', error);
    return Response.json({ error: 'Failed to delete staff' }, { status: 500 });
  }
}
