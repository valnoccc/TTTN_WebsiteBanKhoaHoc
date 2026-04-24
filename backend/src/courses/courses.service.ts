import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm'; // Đã import thêm DataSource
import { KhoaHoc } from './entities/course.entity';

@Injectable()
export class CoursesService {
  // Đã xóa 2 dòng "courseRepo: any;" và "dataSource: any;" gây nhiễu

  constructor(
    @InjectRepository(KhoaHoc)
    private khoaHocRepository: Repository<KhoaHoc>,
    private dataSource: DataSource, // Đã Inject DataSource đúng chuẩn TypeORM
  ) { }

  // ========================================================
  // HÀM LẤY DANH SÁCH
  // ========================================================
  async getCoursesByInstructor(instructorId: number) {
    try {
      const courses = await this.khoaHocRepository.find({
        where: { id_giang_vien: instructorId },
        order: { ngay_tao: 'DESC' }
      });
      return courses;
    } catch (error) {
      console.error('Lỗi truy vấn CSDL:', error);
      throw new Error('Không thể lấy dữ liệu từ CSDL');
    }
  }

  // ========================================================
  // HÀM TẠO MỚI
  // ========================================================
  async createCourse(payload: any) {
    console.log('Service đang nhận data để lưu vào DB:', payload);
    try {
      const newCourse = this.khoaHocRepository.create(payload);
      const savedCourse = await this.khoaHocRepository.save(newCourse);
      return savedCourse;
    } catch (error) {
      console.error('Lỗi khi INSERT vào bảng khoahoc:', error);
      throw new Error('Không thể lưu khóa học vào CSDL');
    }
  }

  // ========================================================
  // HÀM XÓA KHÓA HỌC
  // ========================================================
  async remove(courseId: number, instructorId: number) {
    // 1. Dùng đúng tên this.khoaHocRepository
    const course = await this.khoaHocRepository.findOne({
      where: { id: courseId, id_giang_vien: instructorId }
    });

    if (!course) throw new ForbiddenException('Bạn không có quyền xóa khóa học này');

    // 2. Dùng this.dataSource đã được Inject
    const hasBuyers = await this.dataSource.query(
      `SELECT COUNT(*) as count FROM chitiethoadon WHERE id_khoa_hoc = ?`,
      [courseId]
    );

    if (hasBuyers[0].count > 0) {
      // 3. Update bằng khoaHocRepository
      await this.khoaHocRepository.update(courseId, { trang_thai: 'HIDDEN' });
      return { message: 'Khóa học đã có học viên mua, hệ thống đã chuyển sang trạng thái ẨN.' };
    }

    // 4. Delete bằng khoaHocRepository
    await this.khoaHocRepository.delete(courseId);
    return { message: 'Đã xóa khóa học thành công.' };
  }

  // ========================================================
  // HÀM ẨN/HIỆN (CẬP NHẬT TRẠNG THÁI)
  // ========================================================
  async updateCourseStatus(courseId: number, instructorId: number, trang_thai: string) {
    // 1. Kiểm tra khóa học có phải của giảng viên này không
    const course = await this.khoaHocRepository.findOne({
      where: { id: courseId, id_giang_vien: instructorId }
    });

    if (!course) {
      throw new ForbiddenException('Bạn không có quyền sửa khóa học này');
    }

    // 2. Cập nhật trạng thái
    await this.khoaHocRepository.update(courseId, { trang_thai });

    return { message: 'Cập nhật trạng thái thành công' };
  }

  // ========================================================
  // HÀM CẬP NHẬT
  // ========================================================
  async updateCourse(courseId: number, instructorId: number, payload: any) {
    console.log(`Service đang sửa khóa ${courseId} của GV ${instructorId} với data:`, payload);
    return {
      id: courseId,
      ...payload,
      trang_thai_cap_nhat: 'Thành công'
    };
  }
}