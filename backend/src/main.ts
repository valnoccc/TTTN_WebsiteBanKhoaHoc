import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Bật tính năng CORS để cho phép Frontend (Vite) gọi API
  app.enableCors({
    origin: true, // Cho phép tất cả các nguồn gọi tới
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Nếu trước đó bạn có cài đặt Global Prefix như app.setGlobalPrefix('api'); thì giữ nguyên nhé

  await app.listen(3000);
}
bootstrap();