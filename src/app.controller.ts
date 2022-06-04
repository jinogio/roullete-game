import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Session,
} from '@nestjs/common';
import { AppService } from './app.service';
import { BetDto, BetInfoDto } from './bet.dto';
import { RouletteService } from './roulette.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly rouletteService: RouletteService,
  ) {}

  @Post('create')
  @HttpCode(201)
  async create(
    @Req() request,
    @Session() state: Record<string, any>,
  ): Promise<void> {
    const jwt = this.appService.extractJwtToken(request);
    if (!jwt) {
      throw new BadRequestException('JWT token was not provided');
    }

    const balance = await this.appService.getBalanceFromJwt(jwt);
    if (balance === undefined || balance === null) {
      throw new BadRequestException('balance was not found in jwt token');
    }

    this.rouletteService.start(state, balance);
  }

  @Post('spin')
  @HttpCode(200)
  spin(@Body() bet: BetInfoDto, @Session() state: Record<string, any>): any {
    if (!this.rouletteService.validateBetTotal(state, bet.betInfo)) {
      throw new BadRequestException('Not enough balance for bets');
    }

    const totalBets = this.rouletteService.getTotalBet(bet.betInfo);
    const winningNumber = this.rouletteService.getWiningNumber();
    const winningBets = this.rouletteService.getWinningBets(
      winningNumber,
      bet.betInfo,
    );
    const winningTotal = this.rouletteService.getTotalByBets(winningBets);
    this.rouletteService.addToBalance(state, winningTotal - totalBets);

    return {
      balance: state.balance,
      bets: winningBets,
    };
  }

  @Post('end')
  @HttpCode(200)
  end(@Session() state: Record<string, any>): void {
    state = null;
  }
}
