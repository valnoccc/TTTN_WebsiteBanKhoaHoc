import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KhoaHoc } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(KhoaHoc)
    private khoaHocRepository: Repository<KhoaHoc>,
  ) { }

  // Hàm lấy danh sách khóa học theo ID Giảng viên
  async getCoursesByInstructor(instructorId: number) {
    try {
      const courses = await this.khoaHocRepository.find({
        where: { id_giang_vien: instructorId },
        order: { id: 'DESC' },
      });
      return courses;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }
}