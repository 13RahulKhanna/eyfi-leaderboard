import { Controller, Get } from '@nestjs/common';

@Controller('api/health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'eyfi-leaderboard-api', timestamp: Date.now() };
  }
}
