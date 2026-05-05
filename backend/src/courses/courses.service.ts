import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { KhoaHoc } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(KhoaHoc)
    private khoaHocRepository: Repository<KhoaHoc>,
    private dataSource: DataSource,
  ) { }

  // ========================================================
  // QUẢN LÝ KHÓA HỌC
  // ========================================================
  async getCoursesByInstructor(instructorId: number) {
    return await this.khoaHocRepository.find({
      where: { id_giang_vien: instructorId },
      order: { ngay_tao: 'DESC' }
    });
  }

  async createCourse(payload: any) {
    const newCourse = this.khoaHocRepository.create(payload);
    return await this.khoaHocRepository.save(newCourse);
  }

  async remove(courseId: number, instructorId: number) {
    const course = await this.khoaHocRepository.findOne({
      where: { id: courseId, id_giang_vien: instructorId }
    });

    if (!course) throw new ForbiddenException('Bạn không có quyền xóa khóa học này');

    const hasBuyers = await this.dataSource.query(
      `SELECT COUNT(*) as count FROM chitiethoadon WHERE id_khoa_hoc = ?`,
      [courseId]
    );

    if (hasBuyers[0].count > 0) {
      await this.khoaHocRepository.update(courseId, { trang_thai: 'HIDDEN' });
      return { message: 'Khóa học đã có học viên mua, hệ thống đã chuyển sang trạng thái ẨN.' };
    }

    await this.khoaHocRepository.delete(courseId);
    return { message: 'Đã xóa khóa học thành công.' };
  }

  async updateCourseStatus(courseId: number, instructorId: number, trang_thai: string) {
    const course = await this.khoaHocRepository.findOne({
      where: { id: courseId, id_giang_vien: instructorId }
    });

    if (!course) throw new ForbiddenException('Bạn không có quyền sửa khóa học này');

    await this.khoaHocRepository.update(courseId, { trang_thai });
    return { message: 'Cập nhật trạng thái thành công' };
  }

  async getCourseById(courseId: number, instructorId: number) {
    const course = await this.khoaHocRepository.findOne({
      where: { id: courseId, id_giang_vien: instructorId }
    });

    if (!course) {
      throw new ForbiddenException('Không tìm thấy khóa học hoặc bạn không có quyền truy cập');
    }

    // Đếm số học viên đã đăng ký
    const stats = await this.dataSource.query(
      `SELECT COUNT(DISTINCT hd.id_hoc_vien) as total_students
       FROM chitiethoadon cthd
       JOIN hoadon hd ON cthd.id_hoa_don = hd.id
       WHERE cthd.id_khoa_hoc = ? AND hd.trang_thai = 'PAID'`,
      [courseId]
    );

    return {
      ...course,
      studentCount: Number(stats[0].total_students) || 0
    };
  }

  async updateCourse(courseId: number, instructorId: number, payload: any) {
    const course = await this.khoaHocRepository.findOne({
      where: { id: courseId, id_giang_vien: instructorId }
    });

    if (!course) throw new ForbiddenException('Bạn không có quyền sửa khóa học này');


    // THÊM ĐOẠN NÀY: Chặn cập nhật nếu đang chờ duyệt hoặc đã xuất bản
    if (course.trang_thai === 'PENDING' || course.trang_thai === 'PUBLISHED') {
      throw new ForbiddenException('Không thể chỉnh sửa khóa học đang chờ duyệt hoặc đã xuất bản.');
    }
    await this.khoaHocRepository.update(courseId, payload);
    return await this.khoaHocRepository.findOne({ where: { id: courseId } });
  }

  // ========================================================
  // QUẢN LÝ BÀI HỌC (LESSONS) - Nơi fix lỗi của bạn
  // ========================================================
  async createLesson(courseId: number, payload: any) {
    const { tieu_de, noi_dung, video_url, thu_tu } = payload;
    
    // Thực thi lệnh INSERT vào bảng baihoc
    await this.dataSource.query(
      `INSERT INTO baihoc (id_khoa_hoc, tieu_de, noi_dung, video_url, thu_tu) 
       VALUES (?, ?, ?, ?, ?)`,
      [courseId, tieu_de, noi_dung, video_url, thu_tu || 1]
    );

    return { message: 'Thêm bài học thành công' };
  }

  async getLessonsByCourse(courseId: number) {
    // Truy vấn lấy các bài học và sắp xếp theo thứ tự hiển thị
    const lessons = await this.dataSource.query(
      `SELECT * FROM baihoc WHERE id_khoa_hoc = ? ORDER BY thu_tu ASC`,
      [courseId]
    );
    return lessons;
  }
}