import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from './../src/prisma/prisma.service';
import { AppModule } from './../src/app.module';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = 
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({  // Setting validation globally
      whitelist: true,  // No other fields which we dont define
    }));
    await app.init();

    prisma = app.get(PrismaService)
    await prisma.cleanDb()
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Signup', () => {});

    describe('Signin', () => {});
  });

  describe('User', () => {
    describe('Get me', () => {});

    describe('Edit user', () => {});
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {});

    describe('Get bookmarks', () => {});

    describe('Get bookmark by id', () => {});

    describe('Edit bookmarks', () => {});

    describe('Delete bookmarks', () => {});
  });

  it.todo('should pass')
});
