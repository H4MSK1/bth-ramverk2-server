import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', done => {
    return request(app.getHttpServer())
      .get('/')
      .end((_err, res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(typeof res.body.data).toBe('string');
        done();
      });
  });

  it('/reports (GET)', done => {
    return request(app.getHttpServer())
      .get('/reports')
      .end((_err, res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBeInstanceOf(Array);
        done();
      });
  });
});
