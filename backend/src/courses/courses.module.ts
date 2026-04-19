import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { KhoaHoc } from './entities/course.entity'; // Đảm bảo đúng tên file entity

@Module({
  // Import TypeOrmModule.forFeature để Service có thể dùng được @InjectRepository
  imports: [TypeOrmModule.forFeature([KhoaHoc])],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule { }