import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity'; // Import Entity bạn đã tạo

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Mở khóa kết nối DB cho Users
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Rất quan trọng: Export để lát nữa AuthModule có thể dùng ké
})
export class UsersModule { }