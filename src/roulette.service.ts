import { Injectable } from '@nestjs/common';

export type BetPayload = {
  betAmount: number;
  betType: 'odd' | 'even' | number;
};

@Injectable()
export class RouletteService {
  start(state: Record<string, any>, balance: number): void {
    state.balance = balance;
  }

  addToBalance(state: Record<string, any>, amount: number): void {
    state.balance = Number(state.balance) + amount;
  }

  getWiningNumber(): number {
    const min = 0,
      max = 36;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  validateBetTotal(state: Record<string, any>, bets: BetPayload[]): boolean {
    const balance = state?.balance ?? 0;
    const totalBet = this.getTotalBet(bets);

    return totalBet <= balance;
  }

  getTotalBet(bets: BetPayload[]): number {
    return bets.reduce((acc, bet) => acc + bet.betAmount, 0);
  }

  getWinningBets(winningNumber: number, bets: BetPayload[]): BetPayload[] {
    return bets.filter((bet) =>
      bet.betType === 'odd' && winningNumber % 2 === 1
        ? true
        : bet.betType === 'even' && winningNumber % 2 === 0
        ? true
        : bet.betType === winningNumber
        ? true
        : false,
    );
  }

  getTotalByBets(bets: BetPayload[]): number {
    return bets.reduce(
      (acc, bet) =>
        bet.betType === 'odd' || bet.betType === 'even'
          ? acc + bet.betAmount * 2
          : acc + bet.betAmount * 36,
      0,
    );
  }
}
