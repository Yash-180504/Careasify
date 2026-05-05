import { db } from '@/lib/db';
import { bookings, users, staff, userSubscriptions } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq, sql, count } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Total bookings
    const [bookingsCount] = await db
      .select({ count: count() })
      .from(bookings);

    // Pending bookings
    const [pendingCount] = await db
      .select({ count: count() })
      .from(bookings)
      .where(eq(bookings.status, 'pending'));

    // Completed bookings
    const [completedCount] = await db
      .select({ count: count() })
      .from(bookings)
      .where(eq(bookings.status, 'completed'));

    // Total customers
    const [customersCount] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, 'customer'));

    // Available staff
    const [availableStaffCount] = await db
      .select({ count: count() })
      .from(staff)
      .where(eq(staff.status, 'available'));

    // Total staff
    const [totalStaffCount] = await db
      .select({ count: count() })
      .from(staff);

    // Active subscriptions
    const [activeSubsCount] = await db
      .select({ count: count() })
      .from(userSubscriptions)
      .where(eq(userSubscriptions.status, 'active'));

    // Revenue (sum of completed booking prices)
    const [revenue] = await db
      .select({ total: sql<string>`COALESCE(SUM(CAST(${bookings.totalPrice} AS DECIMAL)), 0)` })
      .from(bookings)
      .where(eq(bookings.status, 'completed'));

    return Response.json({
      totalBookings: bookingsCount.count,
      pendingBookings: pendingCount.count,
      completedBookings: completedCount.count,
      totalCustomers: customersCount.count,
      availableStaff: availableStaffCount.count,
      totalStaff: totalStaffCount.count,
      activeSubscriptions: activeSubsCount.count,
      totalRevenue: revenue.total || '0',
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return Response.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
