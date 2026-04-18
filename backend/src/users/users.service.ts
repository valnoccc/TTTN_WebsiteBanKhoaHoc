import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  // Bơm (Inject) Repository của TypeORM vào
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  // Hàm thực tế chọc vào MySQL lấy danh sách user
  async findAll() {
    return await this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}