import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const sort = searchParams.get('sort');
    const q = searchParams.get('q');

    const GITHUB_API_BASE = process.env.NEXT_PUBLIC_MOCK_API_BASE;

    // Fetch from GitHub
    const response = await fetch(`${GITHUB_API_BASE}/documents.json`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from GitHub');
    }

    let documents = await response.json();

    // Filter by status
    if (status && status !== 'all') {
      documents = documents.filter((doc: any) => doc.status === status);
    }

    // Filter by search query
    if (q) {
      const query = q.toLowerCase();
      documents = documents.filter(
        (doc: any) =>
          doc.title.toLowerCase().includes(query) ||
          doc.snippet.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sort === 'oldest') {
      documents.sort(
        (a: any, b: any) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      );
    } else if (sort === 'title') {
      documents.sort((a: any, b: any) => a.title.localeCompare(b.title));
    } else {
      documents.sort(
        (a: any, b: any) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }

    const responseData = {
      documents: documents,
      pagination: {
        page: 1,
        limit: 10,
        total: documents.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newDoc = {
      id: Date.now(),
      title: body.title || 'Untitled Document',
      snippet: body.snippet || body.body?.substring(0, 60) + '...' || '',
      body: body.body || '<p>Start writing...</p>',
      author: body.author || 'DK',
      authorInitials: body.authorInitials || 'DK',
      updatedAt: new Date().toISOString(),
      status: body.status || 'Draft',
      views: 0,
    };

    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}
