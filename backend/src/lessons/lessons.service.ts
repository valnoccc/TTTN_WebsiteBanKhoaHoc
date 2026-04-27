import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) { }

  async create(payload: any): Promise<Lesson> {
    try {
      const result = await this.lessonRepository.save(payload);
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Không thể lưu bài học vào Database');
    }
  }

  /**
   * Lấy danh sách bài học theo ID khóa học
   * Sắp xếp theo thứ tự (thu_tu) tăng dần
   */
  async findAllByCourse(courseId: number): Promise<Lesson[]> {
    return await this.lessonRepository.find({
      where: { id_khoa_hoc: courseId },
      order: {
        thu_tu: 'ASC'
      },
    });
  }
}