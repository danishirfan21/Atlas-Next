import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const status = searchParams.get('status');
    const author = searchParams.get('author');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const GITHUB_API_BASE = process.env.NEXT_PUBLIC_MOCK_API_BASE;

    // Fetch from GitHub
    const response = await fetch(`${GITHUB_API_BASE}/documents.json`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from GitHub');
    }

    let documents = await response.json();

    // Filter by search query
    if (q) {
      const query = q.toLowerCase();
      documents = documents.filter(
        (doc: any) =>
          doc.title.toLowerCase().includes(query) ||
          doc.snippet.toLowerCase().includes(query) ||
          doc.body.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (status && status !== 'all') {
      documents = documents.filter((doc: any) => doc.status === status);
    }

    // Filter by author
    if (author && author !== 'all') {
      documents = documents.filter((doc: any) => doc.author === author);
    }

    // Filter by date range
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      documents = documents.filter(
        (doc: any) => new Date(doc.updatedAt) >= fromDate
      );
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      documents = documents.filter(
        (doc: any) => new Date(doc.updatedAt) <= toDate
      );
    }

    // Sort by relevance (most recent first)
    documents.sort(
      (a: any, b: any) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to search documents' },
      { status: 500 }
    );
  }
}
