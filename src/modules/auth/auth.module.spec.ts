import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


describe('AuthModule (e2e)', () => {
  let app: INestApplication;
  let authService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeAll(async () => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AuthModule],
  })
    .overrideProvider(AuthService)
    .useValue(authService)
    .overrideProvider(getRepositoryToken(User))
    .useValue({
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    })
    .overrideProvider(JwtService)
    .useValue({
      signAsync: jest.fn().mockResolvedValue('mocked-token'),
    })
    .overrideProvider(ConfigService)
    .useValue({
      get: (key: string) => {
        switch (key) {
          case 'JWT_SECRET_KEY':
            return 'test-secret';
          case 'JWT_EXPIRES_IN':
            return '1h';
          default:
            return null;
        }
      },
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({
      canActivate: (context) => {
        const req = context.switchToHttp().getRequest();
        req.user = {
          id: 'abce123',
          email: 'test@example.com',
          name: 'Test',
          role: 'user',
        };
        return true;
      },
    })
    .compile();

  app = moduleRef.createNestApplication();
  await app.init();
});

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST)', async () => {
    const dto = { email: 'test@example.com', password: '123456', name: 'Test' };
    authService.register.mockResolvedValue({
      message: 'User successfully registered',
      user: { id: 'abc123', email: dto.email },
    });

    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send(dto)
      .expect(201);

    expect(res.body).toEqual({
      message: 'User successfully registered',
      user: { id: 'abc123', email: dto.email },
    });
  });

  it('/auth/login (POST)', async () => {
    const dto = { email: 'test@example.com', password: '123456' };
    authService.login.mockResolvedValue({ accessToken: 'mocked-token' });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(dto)
      .expect(201);

    expect(res.body).toEqual({ accessToken: 'mocked-token' });
  });

  it('/auth/profile (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/profile')
      .expect(200);

    expect(res.body).toEqual({
      id: 'abc123',
      email: 'test@example.com',
      name: 'Test',
      role: 'user',
    });
  });
});