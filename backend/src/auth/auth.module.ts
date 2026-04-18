import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]), // Cho phép Auth truy cập bảng User
        JwtModule.register({
            global: true, // Biến JWT thành module toàn cục
            secret: process.env.JWT_SECRET || 'chuoi_bi_mat_tam_thoi', // Chìa khóa bí mật
            signOptions: { expiresIn: '1d' }, // Token có hạn trong 1 ngày
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule { }