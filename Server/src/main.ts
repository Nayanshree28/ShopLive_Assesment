import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enhanced CORS configuration
  app.enableCors({
    origin: process.env.CLIENT_ORIGIN || 'https://shop-live-assesment.vercel.app/',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    maxAge: 3600, // Cache preflight requests for 1 hour
  });

  // Global validation pipe with security options
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that don't have decorators
    forbidNonWhitelisted: true, // Throw errors if non-whitelisted properties are present
    transform: true, // Transform payloads to DTO instances
    transformOptions: {
      enableImplicitConversion: true, // Automatically convert primitive types
    },
  }));

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`🚀 API running on http://localhost:${port}`);
  console.log(`🌐 CORS enabled for: ${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}`);
}
bootstrap();