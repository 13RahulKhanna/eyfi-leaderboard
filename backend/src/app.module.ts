import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller.js';
import { LeaderboardModule } from './leaderboard/leaderboard.module.js';

@Module({
  imports: [LeaderboardModule],
  controllers: [HealthController],
})
export class AppModule {}
