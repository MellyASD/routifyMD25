import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User, UserRole } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { UpdateUserDTO } from 'src/dto/update-user.dto';
import { UserNotFoundException } from 'src/common/exceptions/routify.exception';
import { BadRequestException } from '@nestjs/common';

// Mock completo de bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const mockUserRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: UserRole.USER,
    status: true,
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all active users', async () => {
      mockUserRepo.find.mockResolvedValue([mockUser]);
      const users = await service.findAll();
      expect(users).toEqual([mockUser]);
      expect(mockUserRepo.find).toHaveBeenCalledWith({ where: { status: true } });
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      const user = await service.findOne(1);
      expect(user).toEqual(mockUser);
    });

    it('should throw UserNotFoundException if user not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(UserNotFoundException);
    });
  });

  describe('findByName', () => {
    it('should return users matching the name', async () => {
      mockUserRepo.find.mockResolvedValue([mockUser]);
      const users = await service.findByName('Test');
      expect(users).toEqual([mockUser]);
    });

    it('should throw UserNotFoundException if no users found', async () => {
      mockUserRepo.find.mockResolvedValue([]);
      await expect(service.findByName('NoUser')).rejects.toThrow(UserNotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser: CreateUserDTO = { name: 'New', email: 'new@example.com', password: '1234', role: UserRole.USER };
      mockUserRepo.findOne.mockResolvedValue(null);
      mockUserRepo.create.mockReturnValue(newUser);
      mockUserRepo.save.mockResolvedValue({ ...newUser, id: 2, password: 'hashedPassword' });

      const result = await service.create(newUser);
      expect(result.user.password).toBe('hashedPassword');
      expect(result.message).toBe('User created successfully.');
    });

    it('should throw BadRequestException if email exists', async () => {
      const newUser: CreateUserDTO = { name: 'New', email: 'test@example.com', password: '1234', role: UserRole.USER };
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      await expect(service.create(newUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const updateDto: UpdateUserDTO = {
        name: 'Updated', password: 'newpass',
        role: UserRole.ADMIN
      };
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockUserRepo.save.mockResolvedValue({ ...mockUser, ...updateDto, password: 'hashedPassword' });

      const result = await service.update(1, updateDto);
      expect(result.user.name).toBe('Updated');
      expect(result.user.password).toBe('hashedPassword');
    });

    it('should throw UserNotFoundException if user does not exist', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(service.update(999, {} as UpdateUserDTO)).rejects.toThrow(UserNotFoundException);
    });

    it('should throw BadRequestException if email already exists', async () => {
      const updateDto: UpdateUserDTO = {
        email: 'exists@example.com',
        role: UserRole.ADMIN
      };
      mockUserRepo.findOne.mockResolvedValueOnce(mockUser); // user to update
      mockUserRepo.findOne.mockResolvedValueOnce({ ...mockUser, id: 2 }); // another user with same email
      await expect(service.update(1, updateDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('disable', () => {
    it('should disable an active user', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockUserRepo.save.mockResolvedValue({ ...mockUser, status: false });

      const result = await service.disable(1);
      expect(result.message).toBe('User with ID 1 disabled successfully.');
    });

    it('should throw BadRequestException if user already disabled', async () => {
      mockUserRepo.findOne.mockResolvedValue({ ...mockUser, status: false });
      await expect(service.disable(1)).rejects.toThrow(BadRequestException);
    });

    it('should throw UserNotFoundException if user does not exist', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(service.disable(999)).rejects.toThrow(UserNotFoundException);
    });
  });
});
