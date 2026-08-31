import {
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { LeaderboardService } from './leaderboard.service.js';

const TICK_INTERVAL_MS = 4500;

@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_ORIGIN ?? '*' },
})
export class LeaderboardGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  private timer?: ReturnType<typeof setInterval>;

  constructor(private readonly leaderboardService: LeaderboardService) {}

  afterInit() {
    this.timer = setInterval(() => {
      const payload = this.leaderboardService.tick();
      this.server.emit('leaderboard:update', {
        ...payload,
        generatedAt: Date.now(),
      });
    }, TICK_INTERVAL_MS);
  }

  handleConnection(client: Socket) {
    client.emit('leaderboard:update', {
      ranges: this.leaderboardService.getAllRanges(),
      event: null,
      generatedAt: Date.now(),
    });
  }

  @SubscribeMessage('leaderboard:ping')
  handlePing() {
    return { event: 'leaderboard:pong', data: { at: Date.now() } };
  }
}
