import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comparison } from 'src/entities/comparison.entity';
import { Repository } from 'typeorm';
import { TransportService } from '../transport/transport.service';
import { User } from 'src/entities/user.entity';
import { CreateComparisonDTO } from 'src/dto/create-comparison.dto';

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

  async create(createComparisonDto: CreateComparisonDTO, userId: number): Promise<Comparison> {
    
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    // Simulates the transport comparison results
    const transportResults = await this.transportService.compareTransports(
      createComparisonDto.origin,
      createComparisonDto.destination,
    );

    // Creates the object and persists it
    const comparison = this.comparisonRepository.create({
      origin: createComparisonDto.origin,
      destination: createComparisonDto.destination,
      user: user,
      results: transportResults,
    });

    try {
      return await this.comparisonRepository.save(comparison);
    } catch (err) {
      throw new InternalServerErrorException(`Error creating comparison: ${err.message}`);
    }
  }

  async findAll(): Promise<Comparison[]> {
    return await this.comparisonRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Comparison[]> {
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
  async update(id: number, updateDto: Partial<CreateComparisonDTO>, userId: number) {
  const comparison = await this.comparisonRepository.findOne({ where: { id }, relations: ['user'] });
  if (!comparison) {
    throw new NotFoundException(`Comparison with ID ${id} not found`);
  }
  if (comparison.user.id !== userId) {
    throw new UnauthorizedException('You cannot modify this comparison');
  }
  Object.assign(comparison, updateDto);
  try {
    return await this.comparisonRepository.save(comparison);
  } catch (err) {
    throw new InternalServerErrorException(`Error updating comparison: ${err.message}`);
  }
}

}
