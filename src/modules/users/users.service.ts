/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { UpdateUserDTO } from 'src/dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepo.find({ where: { status: true } });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found.`);
    return user;
  }

  async findByName(name: string): Promise<User[]> {
    const users = await this.usersRepo.find({
      where: { name: ILike(`%${name}%`) },
    });
    if (users.length === 0) {
      throw new NotFoundException(`No users found with name: ${name}`);
    }

    return users;
  }

  async create(
    newUser: CreateUserDTO,
  ): Promise<{ message: string; user: User }> {
    const existingUser = await this.usersRepo.findOne({
      where: { email: newUser.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists.');
    }

    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    const user = this.usersRepo.create({
      ...newUser,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepo.save(user);
    return { message: 'User created successfully.', user: savedUser };
  }

  async update(
    id: number,
    updateUser: UpdateUserDTO,
  ): Promise<{ message: string; user: User }> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found.`);

    if (updateUser.email && updateUser.email !== user.email) {
      const existingUser = await this.usersRepo.findOne({
        where: { email: updateUser.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException(
          'Email is already in use by another user.',
        );
      }
    }

    if (updateUser.password) {
      updateUser.password = await bcrypt.hash(updateUser.password, 10);
    }

    if (updateUser.role && typeof updateUser.role === 'string') {
      const roleKey = updateUser.role.toUpperCase() as keyof typeof UserRole;
      updateUser.role = UserRole[roleKey];
    }

    Object.assign(user, updateUser);
    const updatedUser = await this.usersRepo.save(user);

    return { message: 'User updated successfully.', user: updatedUser };
  }

  async disable(id: number): Promise<{ message: string }> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found.`);

    if (!user.status) {
      throw new BadRequestException('User is already disabled.');
    }

    user.status = false;
    await this.usersRepo.save(user);
    return { message: `User with ID ${id} disabled successfully.` };
  }
}
