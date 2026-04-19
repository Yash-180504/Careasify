import { db } from '@/lib/db';
import { subscriptionPlans } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const plans = await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.isActive, true));

    return Response.json(plans);
  } catch (error) {
    console.error('Plans fetch error:', error);
    return Response.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}
