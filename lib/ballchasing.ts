const BALLCHASING_API_URL = "https://ballchasing.com/api";
const API_KEY = process.env.BALLCHASING_API_KEY;

export interface ReplayStats {
    id: string;
    title: string;
    status: string;
    rocket_league_id: string;
    match_guid: string;
    uploader: {
        steam_id: string;
        name: string;
        profile_url: string;
        avatar: string;
    };
    duration: number;
    upload_date: string;
    map_code: string;
    match_type: string;
    team_size: number;
    blue: {
        color: string;
        name: string;
        score: number;
        players: PlayerStats[];
    };
    orange: {
        color: string;
        name: string;
        score: number;
        players: PlayerStats[];
    };
}

export interface PlayerStats {
    start_time: number;
    end_time: number;
    name: string;
    id: {
        platform: string;
        id: string;
    };
    car: {
        id: number;
        name: string;
    };
    stats: {
        core: {
            shots: number;
            goals: number;
            saves: number;
            assists: number;
            score: number;
            shooting_percentage: number;
        };
        boost: {
            bpm: number;
            bcpm: number;
            avg_amount: number;
            amount_collected: number;
            amount_stolen: number;
            amount_used_while_supersonic: number;
            amount_used_while_aerial: number; // Corrected field name
            count_collected_big: number;
            count_collected_small: number;
            count_stolen_big: number;
            count_stolen_small: number;
            percent_zero_boost: number;
            percent_full_boost: number;
            percent_boost_0_25: number;
            percent_boost_25_50: number;
            percent_boost_50_75: number;
            percent_boost_75_100: number;
        };
        movement: {
            avg_speed: number;
            high_air_duration: number;
            low_air_duration: number;
            time_ground: number;
            time_low_air: number;
            time_high_air: number;
            time_powerslide: number;
            count_powerslide: number;
        };
        positioning: {
            avg_distance_to_ball: number;
            percent_defensive_third: number;
            percent_offensive_third: number;
            percent_neutral_third: number;
            percent_behind_ball: number;
            percent_infront_ball: number;
        }
    };
}

/**
 * Upload a replay file to Ballchasing.com
 */
export async function uploadReplay(file: File, visibility: 'public' | 'unlisted' | 'private' = 'public') {
    if (!API_KEY) throw new Error("Ballchasing API Key not configured");

    const formData = new FormData();
    formData.append('file', file);
    formData.append('visibility', visibility);

    const res = await fetch(`${BALLCHASING_API_URL}/v2/upload`, {
        method: 'POST',
        headers: {
            'Authorization': API_KEY
        },
        body: formData
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to upload replay");
    }

    return res.json();
}

/**
 * Fetch detailed stats for a replay
 */
export async function fetchReplay(id: string): Promise<ReplayStats | null> {
    if (!API_KEY) return null;

    try {
        const res = await fetch(`${BALLCHASING_API_URL}/replays/${id}`, {
            headers: {
                'Authorization': API_KEY
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!res.ok) return null;

        return res.json();
    } catch (error) {
        console.error("Error fetching replay:", error);
        return null;
    }
}

/**
 * Create a replay group (useful for organizing team replays)
 */
export async function createGroup(name: string, playerIdentification: 'by-id' | 'by-name' = 'by-id', teamIdentification: 'by-distinct-players' | 'by-player-clusters' = 'by-distinct-players') {
    if (!API_KEY) throw new Error("Ballchasing API Key missing");

    const res = await fetch(`${BALLCHASING_API_URL}/groups`, {
        method: 'POST',
        headers: {
            'Authorization': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            player_identification: playerIdentification,
            team_identification: teamIdentification
        })
    });

    if (!res.ok) throw new Error("Failed to create group");
    return res.json();
}
