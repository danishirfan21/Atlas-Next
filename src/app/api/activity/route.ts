import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const GITHUB_API_BASE = process.env.NEXT_PUBLIC_MOCK_API_BASE;

    // Fetch from GitHub
    const response = await fetch(`${GITHUB_API_BASE}/activities.json`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from GitHub');
    }

    let activities = await response.json();

    // Filter by action type
    if (type && type !== 'all') {
      activities = activities.filter(
        (activity: any) => activity.action === type.toLowerCase()
      );
    }

    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch activity' },
      { status: 500 }
    );
  }
}
