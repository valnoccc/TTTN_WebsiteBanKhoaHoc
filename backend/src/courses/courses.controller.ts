import { Controller, Get, UseGuards, Request, InternalServerErrorException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Đường dẫn tới file Guard của bạn

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  // API: GET http://localhost:3000/courses/my-courses
  @UseGuards(JwtAuthGuard) // Bắt buộc phải đăng nhập
  @Get('my-courses')
  async getMyCourses(@Request() req) {
    try {
      // req.user chứa payload từ Token (gồm sub là ID của user)
      const instructorId = req.user.sub;

      if (!instructorId) {
        throw new InternalServerErrorException('Instructor ID not found in token');
      }

      const courses = await this.coursesService.getCoursesByInstructor(instructorId);

      return {
        message: 'Lấy danh sách khóa học thành công',
        data: courses,
      };
    } catch (error: any) {
      console.error('Error in getMyCourses:', error);
      throw new InternalServerErrorException('Failed to fetch courses: ' + (error?.message || 'Unknown error'));
    }
  }
}