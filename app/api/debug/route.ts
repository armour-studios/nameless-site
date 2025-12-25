import { NextResponse } from 'next/server';

const STARTGG_API_URL = process.env.NEXT_PUBLIC_STARTGG_API_URL || 'https://api.start.gg/gql/alpha';
const API_KEY = process.env.STARTGG_API_KEY;

export async function GET() {
    const query = `
    query UserTournaments {
      user(slug: "8b933d65") {
        id
        slug
        name
        tournaments(query: {
          perPage: 10
          page: 1
        }) {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  `;

    try {
        const response = await fetch(STARTGG_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({ query }),
        });

        const data = await response.json();

        return NextResponse.json({
            success: true,
            apiUrl: STARTGG_API_URL,
            hasApiKey: !!API_KEY,
            apiKeyPrefix: API_KEY?.substring(0, 10) + '...',
            response: data,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            apiUrl: STARTGG_API_URL,
            hasApiKey: !!API_KEY,
        }, { status: 500 });
    }
}
