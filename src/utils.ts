import { Player, Match, Standing } from "./types";

/**
 * Creates a stable match id for a pair of players.
 * The id should be the same even if caller swaps the order of players.
 * Example: for ids "p1" and "p2", id should always be "p1_vs_p2"
 */
export function createMatchId(playerA: Player, playerB: Player): string {
  // TODO maybe improve this
  return `${playerA.id}_vs_${playerB.id}`;
}

/**
 * Calculates standings from played matches.
 * - Skips matches that do not have winnerId set.
 * - Ensures both players appear in the standings map whenever they appear in a match that has a winner.
 * - For each match: increments the winner's wins and the loser's losses.
 */
export function calculateStandings(matches: Match[]): Standing[] {
  const standingsMap = new Map<string, Standing>();

  for (const match of matches) {
    if (!match.winnerId) {
      continue;
    }

    // Initialize standings for both players if they don't exist
    if (!standingsMap.has(match.playerA.id)) {
      standingsMap.set(match.playerA.id, {
        playerId: match.playerA.id,
        wins: 0,
        losses: 0,
      });
    }
    if (!standingsMap.has(match.playerB.id)) {
      standingsMap.set(match.playerB.id, {
        playerId: match.playerB.id,
        wins: 0,
        losses: 0,
      });
    }

    // Increment winner's wins
    const winnerStanding = standingsMap.get(match.winnerId);
    if (winnerStanding) {
      winnerStanding.wins++;
    }
  }

  return Array.from(standingsMap.values());
}

/**
 * Calculates standings and sorts them with tiebreaker rules.
 * Standings are sorted by:
 * 1. Wins (descending)
 * 2. Losses (ascending)
 * 3. Head-to-head: If two players have the same wins and losses,
 *    the player who won their direct match should be ranked higher.
 *
 * If players are tied and haven't played each other, maintain their relative order.
 */
export function calculateStandingsWithTiebreaker(matches: Match[]): Standing[] {
  const standings = calculateStandings(matches);

  // Sort by wins (descending), then losses (ascending)
  // TODO: implement head-to-head tiebreaker for players with same wins/losses
  return standings;
}
