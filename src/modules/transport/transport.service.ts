import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTransportDTO } from 'src/dto/create-transport.dto';
import { UpdateTransportDTO } from 'src/dto/update-transport.dto';
import { Transport } from 'src/entities/transport.entity';


@Injectable()
export class TransportService {
  private transports: Transport[] = []; // Empty list (no fixed transports)
  private idCounter = 1;

  //  Create transport
  create(dto: CreateTransportDTO) {
    const exists = this.transports.find(t => t.type.toLowerCase() === dto.type.toLowerCase());
    if (exists) throw new BadRequestException('Transport type already exists.');

    const newTransport: Transport = {
      id: this.idCounter++,
      ...dto,
    };

    this.transports.push(newTransport);
    return { message: 'Transport created successfully', newTransport };
  }

  // Get all transports
  findAll() {
    return this.transports;
  }

  //  Get transport by ID
  findOne(id: number) {
    const transport = this.transports.find(t => t.id === id);
    if (!transport) throw new NotFoundException('Transport not found.');
    return transport;
  }

  //  Update transport
  update(id: number, dto: UpdateTransportDTO) {
    const transport = this.transports.find(t => t.id === id);
    if (!transport) throw new NotFoundException('Transport not found.');

    Object.assign(transport, dto);
    return { message: 'Transport updated successfully', transport };
  }

  //  Delete transport
  remove(id: number) {
    const index = this.transports.findIndex(t => t.id === id);
    if (index === -1) throw new NotFoundException('Transport not found.');

    const deleted = this.transports.splice(index, 1);
    return { message: 'Transport deleted successfully', deleted };
  }
}
