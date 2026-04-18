import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum UserRole {
    ADMIN = 'ADMIN',
    INSTRUCTOR = 'GIANG_VIEN',
    STUDENT = 'HOC_VIEN',
}

@Entity('nguoi_dung')
export class User {
    @PrimaryGeneratedColumn()
    id!: number; // <-- Thêm dấu ! ở đây

    @Column({ name: 'ho_ten' })
    fullName!: string; // <-- Thêm dấu ! ở đây

    @Column({ unique: true })
    email!: string; // <-- Thêm dấu ! ở đây

    @Column({ name: 'mat_khau' })
    password!: string; // <-- Thêm dấu ! ở đây

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.STUDENT,
        name: 'vai_tro'
    })
    role!: UserRole; // <-- Thêm dấu ! ở đây

    @CreateDateColumn({ name: 'ngay_tao' })
    createdAt!: Date; // <-- Thêm dấu ! ở đây
}