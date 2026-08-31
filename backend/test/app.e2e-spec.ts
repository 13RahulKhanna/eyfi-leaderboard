import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';

describe('AppModule (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/health (GET)', () => {
    return request(app.getHttpServer()).get('/api/health').expect(200).expect((res) => {
      if (res.body.status !== 'ok') throw new Error('expected status ok');
    });
  });

  it('/api/leaderboard (GET) returns ranked entries', () => {
    return request(app.getHttpServer())
      .get('/api/leaderboard?range=week')
      .expect(200)
      .expect((res) => {
        if (!Array.isArray(res.body.entries) || res.body.entries.length === 0) {
          throw new Error('expected non-empty entries');
        }
        if (res.body.entries[0].rank !== 1) throw new Error('expected first entry to be rank 1');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
