import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const GITHUB_API_BASE = process.env.NEXT_PUBLIC_MOCK_API_BASE;

    // Fetch from GitHub
    const response = await fetch(`${GITHUB_API_BASE}/collections.json`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from GitHub');
    }

    const collections = await response.json();

    // Sort by most recently updated
    collections.sort(
      (a: any, b: any) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

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

    // Create temporary collection (optimistic update only)
    const newCollection = {
      id: Date.now(), // Temporary ID
      name: body.name || 'Untitled Collection',
      description: body.description || '',
      icon: body.icon || '📁',
      iconBg:
        body.iconBg || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      documentCount: 0,
      contributorCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(newCollection, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    );
  }
}
