import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './init-database'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
    const port = process.env.PORT || 3000;
    console.log('=== Environment Variables Debug ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('DATABASE_HOST:', process.env.DATABASE_HOST);
  console.log('DATABASE_USER:', process.env.DATABASE_USER);
  console.log('DATABASE_NAME:', process.env.DATABASE_NAME);
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
  console.log('AWS_REGION:', process.env.AWS_REGION);
  console.log('================================');
  await app.listen(port, '0.0.0.0');
}
bootstrap();
