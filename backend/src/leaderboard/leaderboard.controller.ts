import { Controller, Get, Query } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service.js';
import type { Category, Range } from './types.js';

const VALID_RANGES: Range[] = ['week', 'month', 'all'];

@Controller('api/leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  getLeaderboard(
    @Query('range') rangeParam?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    const range: Range = VALID_RANGES.includes(rangeParam as Range)
      ? (rangeParam as Range)
      : 'week';
    const entries = this.leaderboardService.getLeaderboard(
      range,
      category as Category | undefined,
      search,
    );
    return { range, generatedAt: Date.now(), entries };
  }
}
