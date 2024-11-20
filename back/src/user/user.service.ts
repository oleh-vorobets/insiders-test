import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { SignUpDto } from 'src/auth/dtos/sign-up.dto';
import User from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({
      email: email.toLowerCase(),
    });
    return user;
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOneBy({
      id,
    });
    return user;
  }

  async create(payload: SignUpDto) {
    const user = this.userRepository.create({
      ...payload,
      email: payload.email.toLowerCase(),
    });
    return await this.userRepository.save(user);
  }

  async update(id: number, payload: Partial<User>): Promise<number> {
    if (payload.email) {
      payload.email = payload.email.toLowerCase();
    }
    await this.userRepository.update({ id }, { ...payload });

    return id;
  }

  async deleteRefreshToken(id: number) {
    const result = await this.userRepository.update(
      { id, token: Not(IsNull()) },
      { token: null },
    );

    if (result.affected === 0) {
      throw new NotFoundException(`Can't delete user with id: ${id}`);
    }
    return id;
  }

  async deleteById(id: number) {
    return await this.userRepository.delete({ id });
  }
}
