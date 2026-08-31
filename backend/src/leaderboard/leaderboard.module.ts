import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller.js';
import { LeaderboardGateway } from './leaderboard.gateway.js';
import { LeaderboardService } from './leaderboard.service.js';

@Module({
  controllers: [LeaderboardController],
  providers: [LeaderboardService, LeaderboardGateway],
})
export class LeaderboardModule {}
