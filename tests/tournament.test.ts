import { generateRoundRobin } from "../src/tournament";
import { createMatchId, calculateStandings, calculateStandingsWithTiebreaker } from "../src/utils";
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



  // Bonus if time
  // test("calculateStandingsWithTiebreaker breaks ties using head-to-head results", () => {
  //   return;
  //
  //   // Scenario: p1 and p2 both have 2 wins, 1 loss
  //   // p1 beat p2 in their head-to-head match, so p1 should rank higher
  //   const matches: Match[] = [
  //     {
  //       id: "m1",
  //       playerA: players[0], // p1
  //       playerB: players[1], // p2
  //       bestOf: 3,
  //       winnerId: "p1", // p1 beats p2
  //     },
  //     {
  //       id: "m2",
  //       playerA: players[0], // p1
  //       playerB: players[2], // p3
  //       bestOf: 3,
  //       winnerId: "p1", // p1 beats p3
  //     },
  //     {
  //       id: "m3",
  //       playerA: players[0], // p1
  //       playerB: players[3], // p4
  //       bestOf: 3,
  //       winnerId: "p4", // p4 beats p1
  //     },
  //     {
  //       id: "m4",
  //       playerA: players[1], // p2
  //       playerB: players[2], // p3
  //       bestOf: 3,
  //       winnerId: "p2", // p2 beats p3
  //     },
  //     {
  //       id: "m5",
  //       playerA: players[1], // p2
  //       playerB: players[3], // p4
  //       bestOf: 3,
  //       winnerId: "p2", // p2 beats p4
  //     },
  //     {
  //       id: "m6",
  //       playerA: players[2], // p3
  //       playerB: players[3], // p4
  //       bestOf: 3,
  //       winnerId: "p4", // p4 beats p3
  //     },
  //   ];
  //
  //   // Final records:
  //   // p1: 2 wins, 1 loss (beat p2, p3; lost to p4)
  //   // p2: 2 wins, 1 loss (beat p3, p4; lost to p1)
  //   // p4: 2 wins, 1 loss (beat p1, p3; lost to p2)
  //   // p3: 0 wins, 3 losses
  //
  //   const standings = calculateStandingsWithTiebreaker(matches);
  //
  //   // p1 and p2 are tied (2-1), but p1 beat p2 head-to-head, so p1 should be first
  //   // p4 also has 2-1, but lost to p2, so should be ranked after p2
  //   // Expected order: p1, p2, p4, p3
  //
  //   expect(standings[0].playerId).toBe("p1");
  //   expect(standings[0].wins).toBe(2);
  //   expect(standings[0].losses).toBe(1);
  //
  //   expect(standings[1].playerId).toBe("p2");
  //   expect(standings[1].wins).toBe(2);
  //   expect(standings[1].losses).toBe(1);
  //
  //   expect(standings[2].playerId).toBe("p4");
  //   expect(standings[2].wins).toBe(2);
  //   expect(standings[2].losses).toBe(1);
  //
  //   expect(standings[3].playerId).toBe("p3");
  //   expect(standings[3].wins).toBe(0);
  //   expect(standings[3].losses).toBe(3);
  // });
});

