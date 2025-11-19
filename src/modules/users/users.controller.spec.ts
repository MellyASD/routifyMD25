import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { UpdateUserDTO } from 'src/dto/update-user.dto';
import { UserRole } from 'src/entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const mockUsersService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByName: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      disable: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService }
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users', async () => {
    const expected = [{ id: 1, name: 'Test' }];
    service.findAll.mockResolvedValue(expected as any);

    const result = await controller.findAll();
    expect(result).toEqual(expected);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a user by id', async () => {
    const expected = { id: 1, name: 'Test' };
    service.findOne.mockResolvedValue(expected as any);

    const result = await controller.findOne(1);
    expect(result).toEqual(expected);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should search users by name', async () => {
    const expected = [{ id: 1, name: 'Laura' }];
    service.findByName.mockResolvedValue(expected as any);

    const result = await controller.searchByName('Laura');
    expect(result).toEqual(expected);
    expect(service.findByName).toHaveBeenCalledWith('Laura');
  });

  it('should create a user', async () => {
    const dto: CreateUserDTO = {
      name: 'User',
      email: 'test@test.com',
      password: '123456',
      role: UserRole.ADMIN
    };

    const expected = { id: 1, ...dto };
    service.create.mockResolvedValue(expected as any);

    const result = await controller.create(dto);
    expect(result).toEqual(expected);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should update a user', async () => {
    const dto: UpdateUserDTO = { name: 'NewName', role: UserRole.USER };
    const expected = { id: 1, ...dto };
    service.update.mockResolvedValue(expected as any);

    const result = await controller.update(1, dto);
    expect(result).toEqual(expected);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should disable a user', async () => {
    const expected = { message: 'User disabled' };
    service.disable.mockResolvedValue(expected as any);

    const result = await controller.disable(1);
    expect(result).toEqual(expected);
    expect(service.disable).toHaveBeenCalledWith(1);
  });
});
