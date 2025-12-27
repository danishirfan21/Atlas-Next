import { NextResponse } from 'next/server';
import { db } from '@/lib/mockDb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Simulate random API failures (7.5% chance)
    if (Math.random() < 0.075) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    const id = parseInt(params.id);
    const collection = db.collections.getById(id);

    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(collection);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch collection' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Simulate random API failures (7.5% chance)
    if (Math.random() < 0.075) {
      return NextResponse.json(
        { error: 'Failed to update collection' },
        { status: 500 }
      );
    }

    const id = parseInt(params.id);
    const body = await request.json();

    const updated = db.collections.update(id, body);

    if (!updated) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update collection' },
      { status: 500 }
    );
  }
}
