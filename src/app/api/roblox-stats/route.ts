import { NextResponse } from 'next/server';
import { INITIAL_GAMES } from '@/lib/constants';

export const revalidate = 60; // Next.js ISR cache for 60 seconds

interface RobloxUniverseResponse {
  universeId: number;
}

interface RobloxGameData {
  id: number;
  rootPlaceId: number;
  name: string;
  description: string | null;
  playing: number;
  visits: number;
  maxPlayers: number;
  favoritedCount: number;
  updated: string;
}

interface RobloxGamesApiResponse {
  data: RobloxGameData[];
}

interface RobloxThumbnailItem {
  universeId: number;
  thumbnails?: Array<{
    imageUrl?: string;
    state?: string;
  }>;
}

interface RobloxThumbnailsApiResponse {
  data: RobloxThumbnailItem[];
}

export async function GET() {
  try {
    // 1. Map place IDs to known/resolved Universe IDs
    const placeUniverseMap: Record<string, number> = {
      '123399988849577': 10775086909,
      '127593511292442': 10773759185,
      '134884285482428': 10771061328,
      '128194007601697': 10773672471,
    };

    // If universe ID is unknown for any place, fetch it from Roblox endpoint
    for (const game of INITIAL_GAMES) {
      if (!placeUniverseMap[game.placeId]) {
        try {
          const res = await fetch(`https://apis.roblox.com/universes/v1/places/${game.placeId}/universe`, {
            next: { revalidate: 3600 },
          });
          if (res.ok) {
            const data: RobloxUniverseResponse = await res.json();
            if (data.universeId) {
              placeUniverseMap[game.placeId] = data.universeId;
            }
          }
        } catch (err) {
          console.warn(`Could not resolve universeId for place ${game.placeId}:`, err);
        }
      }
    }

    const universeIds = Object.values(placeUniverseMap);

    // 2. Fetch live metrics from Roblox Games API
    let gameStatsMap: Record<number, RobloxGameData> = {};
    try {
      const statsRes = await fetch(
        `https://games.roblox.com/v1/games?universeIds=${universeIds.join(',')}`,
        {
          headers: {
            'User-Agent': 'ArupPortfolioTelemetry/1.0',
            Accept: 'application/json',
          },
          next: { revalidate: 60 },
        }
      );
      if (statsRes.ok) {
        const statsData: RobloxGamesApiResponse = await statsRes.json();
        if (Array.isArray(statsData.data)) {
          for (const item of statsData.data) {
            gameStatsMap[item.id] = item;
          }
        }
      }
    } catch (err) {
      console.warn('Error fetching Roblox game metrics:', err);
    }

    // 3. Fetch live thumbnails from Roblox Thumbnails API
    let thumbnailMap: Record<number, string> = {};
    try {
      const thumbRes = await fetch(
        `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeIds.join(',')}&size=768x432&format=Png&isCircular=false`,
        {
          headers: {
            'User-Agent': 'ArupPortfolioTelemetry/1.0',
            Accept: 'application/json',
          },
          next: { revalidate: 300 },
        }
      );
      if (thumbRes.ok) {
        const thumbData: RobloxThumbnailsApiResponse = await thumbRes.json();
        if (Array.isArray(thumbData.data)) {
          for (const item of thumbData.data) {
            const completedThumb = item.thumbnails?.find((t) => t.imageUrl);
            if (completedThumb?.imageUrl) {
              thumbnailMap[item.universeId] = completedThumb.imageUrl;
            }
          }
        }
      }
    } catch (err) {
      console.warn('Error fetching Roblox thumbnails:', err);
    }

    // 4. Merge live telemetry with initial game configs
    const updatedGames = INITIAL_GAMES.map((game) => {
      const resolvedUniverseId = placeUniverseMap[game.placeId] || game.universeId;
      const liveData = gameStatsMap[resolvedUniverseId];
      const liveThumbnail = thumbnailMap[resolvedUniverseId];

      const playing = typeof liveData?.playing === 'number' ? liveData.playing : game.stats.playing;
      const visits = typeof liveData?.visits === 'number' ? liveData.visits : game.stats.visits;
      const favoritedCount = typeof liveData?.favoritedCount === 'number' ? liveData.favoritedCount : game.stats.favoritedCount;

      return {
        ...game,
        universeId: resolvedUniverseId,
        officialTitle: liveData?.name || game.officialTitle || game.title,
        description: liveData?.description && liveData.description.trim().length > 0 ? liveData.description : game.description,
        thumbnail: liveThumbnail || game.thumbnail || game.fallbackThumbnail,
        stats: {
          playing,
          visits,
          favoritedCount,
          maxPlayers: liveData?.maxPlayers || game.stats.maxPlayers || 50,
          updated: liveData?.updated || game.stats.updated,
        },
      };
    });

    // 5. Compute aggregate metrics
    const totalVisits = updatedGames.reduce((acc, g) => acc + g.stats.visits, 0);
    const totalPlaying = updatedGames.reduce((acc, g) => acc + g.stats.playing, 0);
    const totalFavorites = updatedGames.reduce((acc, g) => acc + g.stats.favoritedCount, 0);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      source: 'roblox-live-api',
      aggregates: {
        totalVisits,
        totalPlaying,
        totalFavorites,
        gamesCount: updatedGames.length,
      },
      games: updatedGames,
    });
  } catch (error) {
    console.error('Failed to generate roblox stats:', error);
    // Return fallback graceful data
    const totalVisits = INITIAL_GAMES.reduce((acc, g) => acc + g.stats.visits, 0);
    const totalPlaying = INITIAL_GAMES.reduce((acc, g) => acc + g.stats.playing, 0);
    const totalFavorites = INITIAL_GAMES.reduce((acc, g) => acc + g.stats.favoritedCount, 0);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      source: 'fallback-cache',
      aggregates: {
        totalVisits,
        totalPlaying,
        totalFavorites,
        gamesCount: INITIAL_GAMES.length,
      },
      games: INITIAL_GAMES,
    });
  }
}

