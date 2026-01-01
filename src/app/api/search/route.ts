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

    // Fetch both documents and collections from GitHub
    const [docsResponse, collectionsResponse] = await Promise.all([
      fetch(`${GITHUB_API_BASE}/documents.json`, {
        next: { revalidate: 60 }, // Cache for 60 seconds
      }),
      fetch(`${GITHUB_API_BASE}/collections.json`, {
        next: { revalidate: 60 },
      }),
    ]);

    if (!docsResponse.ok || !collectionsResponse.ok) {
      throw new Error('Failed to fetch from GitHub');
    }

    let documents = await docsResponse.json();
    let collections = await collectionsResponse.json();

    // Filter documents by search query
    if (q) {
      const query = q.toLowerCase();

      documents = documents.filter(
        (doc: any) =>
          doc.title.toLowerCase().includes(query) ||
          doc.snippet.toLowerCase().includes(query) ||
          doc.body.toLowerCase().includes(query)
      );

      // Filter collections by name and description
      collections = collections.filter(
        (col: any) =>
          col.name.toLowerCase().includes(query) ||
          col.description.toLowerCase().includes(query)
      );
    }

    // Filter documents by status
    if (status && status !== 'all') {
      documents = documents.filter((doc: any) => doc.status === status);
    }

    // Filter documents by author
    if (author && author !== 'all') {
      documents = documents.filter((doc: any) => doc.author === author);
    }

    // Filter documents by date range
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

    // Sort documents by relevance (most recent first)
    documents.sort(
      (a: any, b: any) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    // Sort collections by relevance (most recently updated first)
    collections.sort(
      (a: any, b: any) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    // Return combined results
    return NextResponse.json({
      documents,
      collections,
      totalResults: documents.length + collections.length,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}
