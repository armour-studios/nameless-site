/**
 * Analytics Helper Functions
 */

/**
 * Calculate upset score based on seed and placement
 * A positive score means the player performed better than their seed.
 * An upset is typically defined as performing 3+ positions better than seeded.
 */
export function calculateUpsetScore(seed: number, placement: number): number {
    // Placement is often a range or specific number. 
    // Converting to seed-equivalent value for comparison.
    // E.g., if you are seed 9 and get 5th place, you beat your seed.
    return seed - placement;
}

/**
 * Determine match importance based on round and seeds
 */
export function getMatchImportance(round: number, seeds: (number | undefined)[]): 'low' | 'medium' | 'high' {
    // For simplicity, later rounds are "higher" importance
    // Positive rounds are Winners, negative are Losers
    const absRound = Math.abs(round);

    if (absRound >= 5) return 'high'; // Finals, Semis, Quarter
    if (absRound >= 3) return 'medium';

    // Also check seeds - if two top 4 seeds meet early
    const topSeeds = seeds.filter(s => s !== undefined && s <= 4).length;
    if (topSeeds >= 2) return 'high';
    if (topSeeds >= 1) return 'medium';

    return 'low';
}

/**
 * Calculate tournament progress percentage
 */
export function calculateProgress(completedSets: number, totalEntrants: number): number {
    if (totalEntrants <= 1) return 100;

    // For a double elimination bracket, total sets is roughly 2 * (N - 1)
    // For single elimination it's (N - 1)
    // Start.gg doesn't always provide total sets directly in a simple way
    // Using a heuristic for double elimination
    const estimatedTotalSets = (totalEntrants - 1) * 2;
    const progress = (completedSets / estimatedTotalSets) * 100;

    return Math.min(Math.round(progress), 100);
}

/**
 * Format Start.gg status code to string
 */
export function formatSetState(state: number): string {
    switch (state) {
        case 1: return 'CREATED';
        case 2: return 'IN_PROGRESS';
        case 3: return 'COMPLETED';
        case 4: return 'READY';
        case 5: return 'INVALID';
        case 6: return 'CALLED';
        default: return 'UNKNOWN';
    }
}
