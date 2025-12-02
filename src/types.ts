export interface Player {
  id: string;
  name: string;
  skill: number; // higher means stronger
}

export interface Match {
  id: string;
  playerA: Player;
  playerB: Player;
  bestOf: number;
  winnerId?: string;
}

export interface Standing {
  playerId: string;
  wins: number;
  losses: number;
}

