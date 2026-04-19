import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity'; // Đường dẫn tới User Entity
import { JwtStrategy } from './jwt.strategy'; // <-- 1. Import JwtStrategy mới tạo

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: 'khoa-bi-mat', // <-- Đây là chuỗi bạn cần copy sang jwt.strategy.ts
            signOptions: { expiresIn: '1d' },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy // <-- 2. Khai báo JwtStrategy vào đây
    ],
})
export class AuthModule { }