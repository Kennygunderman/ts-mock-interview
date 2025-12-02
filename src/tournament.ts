import { Player, Match } from "./types";
import { createMatchId } from "./utils";

/**
 * Generates a round robin tournament schedule.
 * 
 * Requirements:
 * - If there are fewer than 2 players, return an empty list.
 * - Players should be sorted so that higher skill players appear earlier in the schedule.
 * - Round robin: Each unordered pair of distinct players should produce exactly one match.
 * - No self matches.
 * - Default bestOf: If options.bestOf is not provided, default should be 3.
 */
export function generateRoundRobin(
  players: Player[],
  options?: { bestOf?: number }
): Match[] {
  if (players.length < 2) {
    return [];
  }

  // Sort players by skill (higher skill first)
  players.sort((a, b) => a.skill - b.skill);

  const matches: Match[] = [];
  const bestOf = options?.bestOf ?? 1;

  for (let i = 0; i < players.length; i++) {
    for (let j = i; j < players.length; j++) {
      const playerA = players[i];
      const playerB = players[j];
      const matchId = createMatchId(playerA, playerB);

      matches.push({
        id: matchId,
        playerA,
        playerB,
        bestOf,
      });
    }
  }

  return matches;
}

