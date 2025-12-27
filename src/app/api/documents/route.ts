import { NextResponse } from 'next/server';
import { db } from '@/lib/mockDb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const sort = searchParams.get('sort');
    const q = searchParams.get('q');

    let documents = db.documents.getAll();

    // Filter by status
    if (status && status !== 'all') {
      documents = documents.filter((doc) => doc.status === status);
    }

    // Filter by search query
    if (q) {
      const query = q.toLowerCase();
      documents = documents.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query) ||
          doc.snippet.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sort === 'oldest') {
      documents.sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      );
    } else if (sort === 'title') {
      documents.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Default: recent
      documents.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }

    return NextResponse.json(documents);
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

    const newDoc = db.documents.create({
      title: body.title || 'Untitled Document',
      snippet: body.snippet || body.body?.substring(0, 60) + '...' || '',
      body: body.body || '<p>Start writing...</p>',
      author: body.author || 'DK',
      authorInitials: body.authorInitials || 'DK',
      status: body.status || 'Draft',
    });

    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}
