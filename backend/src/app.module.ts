import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/entities/user.entity';
import { KhoaHoc } from './courses/entities/course.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Đọc file .env
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, KhoaHoc], // Khai báo các bảng sẽ dùng
      synchronize: false, // Để false vì đã chạy SQL tay ở trên. (Nếu để true, Nest tự tạo bảng)
    }),
    UsersModule,
    AuthModule,
    CoursesModule,
  ],
})
export class AppModule { }