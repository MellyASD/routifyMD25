import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateTransportDTO } from 'src/dto/create-transport.dto';
import { UpdateTransportDTO } from 'src/dto/update-transport.dto';
import { Transport } from 'src/entities/transport.entity';

@Injectable()
export class TransportService {
  constructor(
    @InjectRepository(Transport)
    private readonly transportRepo: Repository<Transport>,
  ) {}

  // Create transport
  async create(dto: CreateTransportDTO) {
    const exists = await this.transportRepo.findOne({
      where: { type: ILike(dto.type) },
    });

    if (exists) {
      throw new BadRequestException('Transport type already exists.');
    }

    const newTransport = this.transportRepo.create(dto);
    const saved = await this.transportRepo.save(newTransport);

    return { message: 'Transport created successfully.', transport: saved };
  }

  // Get all transports
  findAll() {
    return this.transportRepo.find();
  }

  // Get one transport
  async findOne(id: number) {
    const transport = await this.transportRepo.findOne({ where: { id } });

    if (!transport) {
      throw new NotFoundException('Transport not found.');
    }

    return transport;
  }

  // Update
  async update(id: number, dto: UpdateTransportDTO) {
    const transport = await this.findOne(id);

    Object.assign(transport, dto);

    const updated = await this.transportRepo.save(transport);

    return { message: 'Transport updated successfully.', transport: updated };
  }

  // Delete
  async remove(id: number) {
    const transport = await this.findOne(id);

    await this.transportRepo.remove(transport);

    return { message: 'Transport deleted successfully.' };
  }
}
