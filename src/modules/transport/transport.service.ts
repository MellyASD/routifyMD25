import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transport } from 'src/entities/transport.entity';
import { CreateTransportDTO} from 'src/dto/create-transport.dto';
import { ComparisonResult } from 'src/interfaces/transport-comparison.interface';

@Injectable()
export class TransportService {
  constructor(
    @InjectRepository(Transport)
    private transportRepository: Repository<Transport>,
    private simulatorService: TransportSimulatorService,
  ) {}

  async create(createTransportDto: CreateTransportDTO): Promise<Transport> {
    const transport = this.transportRepository.create(createTransportDto);
    return await this.transportRepository.save(transport);
  }

  async findAll(): Promise<Transport[]> {
    return await this.transportRepository.find();
  }

  async findOne(id: string): Promise<Transport | null> {
    return await this.transportRepository.findOne({ where: { id } });
  }

  async compareTransports(origin: string, destination: string): Promise<ComparisonResult> {
    const options = this.simulatorService.simulateTransportOptions(origin, destination);

    const recommended = options.reduce((prev, current) =>
      prev.score > current.score ? prev : current
    );

    const fastest = options.reduce((prev, current) =>
      prev.duration < current.duration ? prev : current
    );

    const cheapest = options.reduce((prev, current) =>
      prev.cost < current.cost ? prev : current
    );

    return {
      origin,
      destination,
      options: options.sort((a, b) => b.score - a.score),
      recommended,
      fastest,
      cheapest,
    };
  }
}