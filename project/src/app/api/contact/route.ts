import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactRequests } from '@/lib/db/schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, vehicleType, service, message } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required.' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!db) {
      return NextResponse.json(
        { error: 'Database is not configured. Please set DATABASE_URL.' },
        { status: 503 }
      );
    }

    // Insert into database
    await db.insert(contactRequests).values({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      vehicleType: vehicleType || null,
      serviceInterest: service || null,
      message: message?.trim() || null,
    });

    return NextResponse.json(
      { success: true, message: 'Inquiry submitted successfully!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit inquiry. Please try again.' },
      { status: 500 }
    );
  }
}
