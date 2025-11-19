/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateComparisonDTO } from 'src/dto/create-comparison.dto';
import { Comparison } from 'src/entities/comparison.entity';
import { Repository } from 'typeorm';
import { TransportService } from '../transport/transport.service';
import { User } from 'src/entities/user.entity';

@Injectable()
export class ComparisonsService {
  constructor(
    @InjectRepository(Comparison)
    private comparisonRepository: Repository<Comparison>,
    @Inject(forwardRef(() => TransportService))
    private transportService: TransportService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createComparisonDto: CreateComparisonDTO,
    userId: number,
  ): Promise<Comparison> {
    // Valida que el usuario realmente existe
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    // Simula el resultado y lo guarda en 'results'
    const transportResults = await this.transportService.compareTransports(
      createComparisonDto.origin,
      createComparisonDto.destination,
    );

    // Crea el objeto y lo persiste
    const comparison = this.comparisonRepository.create({
      origin: createComparisonDto.origin,
      destination: createComparisonDto.destination,
      user: user,
      results: transportResults,
    });

    try {
      return await this.comparisonRepository.save(comparison);
    } catch (err) {
      throw new InternalServerErrorException(
        `Error creando comparación: ${err.message}`,
      );
    }
  }

  async findAll(): Promise<Comparison[]> {
    return await this.comparisonRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Comparison[]> {
    const userExists = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} does not exist`);
    }
    return await this.comparisonRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Comparison> {
    const comparison = await this.comparisonRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!comparison) {
      throw new NotFoundException(`Comparison with ID ${id} not found`);
    }
    return comparison;
  }

  async remove(id: number): Promise<void> {
    const result = await this.comparisonRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Comparison con ID ${id} no encontrada`);
    }
  }

  async getStats(userId?: string) {
    const query = this.comparisonRepository.createQueryBuilder('comparison');
    if (userId) {
      query.where('comparison.userId = :userId', { userId });
    }
    const total = await query.getCount();
    const recentComparisons = await query
      .orderBy('comparison.createdAt', 'DESC')
      .limit(10)
      .getMany();
    return {
      totalComparisons: total,
      recentComparisons,
    };
  }
}
