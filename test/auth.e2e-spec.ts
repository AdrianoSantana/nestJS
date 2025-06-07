import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (SIGN UP)', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'mailtest@test.com.br', password: 'ultraSecretPass' })
      .expect(201)
      .then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { email, id } = res.body;
        expect(id).toBeDefined();
        expect(email).toBeDefined();
      });
  });
});
