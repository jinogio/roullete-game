import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(private jwtService: JwtService) {}

  extractJwtToken(req: Request): string | undefined {
    return req.headers?.['authorization']?.split(' ')?.pop();
  }

  async getBalanceFromJwt(jwt: string): Promise<number | undefined> {
    const payload = await this.jwtService.verifyAsync<{ balance: number }>(jwt);

    return payload.balance;
  }
}
