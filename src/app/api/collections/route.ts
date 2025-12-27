import { NextResponse } from 'next/server';
import { db } from '@/lib/mockDb';

export async function GET(request: Request) {
  try {
    const collections = db.collections.getAll();

    // Sort by most recently updated
    collections.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    return NextResponse.json(collections);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newCollection = db.collections.create({
      name: body.name || 'Untitled Collection',
      description: body.description || '',
      icon: body.icon || '📁',
      iconBg:
        body.iconBg || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      documentCount: 0,
      contributorCount: 1,
    });

    return NextResponse.json(newCollection, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    );
  }
}
