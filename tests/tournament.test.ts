import { generateRoundRobin } from "../src/tournament";
import { createMatchId, calculateStandings } from "../src/utils";
import { Player, Match } from "../src/types";

describe("Tournament Scheduling", () => {
  const players: Player[] = [
    { id: "p1", name: "Alice", skill: 1200 },
    { id: "p2", name: "Bob", skill: 1500 },
    { id: "p3", name: "Charlie", skill: 900 },
    { id: "p4", name: "Dana", skill: 1800 },
  ];

  test("generates the correct number of matches for 4 players", () => {
    const matches = generateRoundRobin(players);
    // For 4 players: n * (n - 1) / 2 = 4 * 3 / 2 = 6 matches
    expect(matches.length).toBe(6);
  });

  test("does not schedule any player to play against themselves", () => {
    const matches = generateRoundRobin(players);
    for (const match of matches) {
      expect(match.playerA.id).not.toBe(match.playerB.id);
    }
  });

  test("stronger players appear earlier in the schedule", () => {
    const matches = generateRoundRobin(players);
    // Highest skill player is Dana (p4) with skill 1800
    // Expect the first match to include p4 in either playerA or playerB
    expect(
      matches[0].playerA.id === "p4" || matches[0].playerB.id === "p4"
    ).toBe(true);
  });

  test("default bestOf value is 3 when not provided", () => {
    const matches = generateRoundRobin(players);
    expect(matches[0].bestOf).toBe(3);
  });

  test("createMatchId creates a stable id regardless of player order", () => {
    const p1 = players[0];
    const p2 = players[1];
    expect(createMatchId(p1, p2)).toBe(createMatchId(p2, p1));
  });

  test("calculateStandings computes wins and losses correctly from played matches", () => {
    const matches: Match[] = [
      {
        id: "m1",
        playerA: players[0], // p1
        playerB: players[1], // p2
        bestOf: 3,
        winnerId: "p1",
      },
      {
        id: "m2",
        playerA: players[2], // p3
        playerB: players[1], // p2
        bestOf: 3,
        winnerId: "p3",
      },
      {
        id: "m3",
        playerA: players[0], // p1
        playerB: players[2], // p3
        bestOf: 3,
        winnerId: "p1",
      },
    ];

    const standings = calculateStandings(matches);

    const p1Standing = standings.find((s) => s.playerId === "p1");
    const p2Standing = standings.find((s) => s.playerId === "p2");
    const p3Standing = standings.find((s) => s.playerId === "p3");

    expect(p1Standing).toBeDefined();
    expect(p1Standing?.wins).toBe(2);
    expect(p1Standing?.losses).toBe(0);

    expect(p2Standing).toBeDefined();
    expect(p2Standing?.wins).toBe(0);
    expect(p2Standing?.losses).toBe(2);

    expect(p3Standing).toBeDefined();
    expect(p3Standing?.wins).toBe(1);
    expect(p3Standing?.losses).toBe(1);
  });

  test("calculateStandings ignores matches without a winner yet", () => {
    const matches: Match[] = [
      {
        id: "m1",
        playerA: players[0],
        playerB: players[1],
        bestOf: 3,
        // no winnerId
      },
    ];

    const standings = calculateStandings(matches);
    expect(standings.length).toBe(0);
  });
});

