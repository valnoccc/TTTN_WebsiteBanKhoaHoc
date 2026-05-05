import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { KhoaHoc } from '../../courses/entities/course.entity';

@Entity('baihoc')
export class Lesson {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'id_khoa_hoc', nullable: true })
    id_khoa_hoc!: number;

    @Column({ type: 'varchar', length: 255 })
    tieu_de!: string;

    @Column({ type: 'text', nullable: true })
    noi_dung!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    video_url!: string;

    @Column({ type: 'int', nullable: true })
    thu_tu!: number;

    // Quan hệ: Nhiều bài học thuộc về một khóa học
    @ManyToOne(() => KhoaHoc)
    @JoinColumn({ name: 'id_khoa_hoc' })
    khoaHoc!: KhoaHoc;
}