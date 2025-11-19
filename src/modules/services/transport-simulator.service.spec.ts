import { Test, TestingModule } from '@nestjs/testing';
import { TransportSimulatorService } from './transport-simulator.service';
import { TransportType } from '../../entities/transport.entity';

describe('TransportSimulatorService', () => {
  let service: TransportSimulatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransportSimulatorService],
    }).compile();

    service = module.get<TransportSimulatorService>(TransportSimulatorService);
  });

  const callService = () =>
    service.simulateTransportOptions('Origin', 'Destination');

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of transport options', () => {
    const options = callService();
    expect(options).toBeInstanceOf(Array);
    expect(options.length).toBeGreaterThan(0);
  });

  it('should include BUS, TAXI and PRIVATE_CAR always', () => {
    const options = callService();
    const types = options.map(o => o.type);

    expect(types).toContain(TransportType.BUS);
    expect(types).toContain(TransportType.TAXI);
    expect(types).toContain(TransportType.PRIVATE_CAR);
  });

  it('should include METRO only if distance < 15', () => {
    const options = callService();
    const metro = options.find(o => o.type === TransportType.METRO);
    const baseDistance = options.find(o => o.type === TransportType.BUS)?.distance;

    if (baseDistance && baseDistance < 15) {
      expect(metro).toBeDefined();
    } else {
      expect(metro).toBeUndefined();
    }
  });

  it('should include BICYCLE only if distance < 10', () => {
    const options = callService();
    const bike = options.find(o => o.type === TransportType.BICYCLE);
    const baseDistance = options.find(o => o.type === TransportType.BUS)?.distance;

    if (baseDistance && baseDistance < 10) {
      expect(bike).toBeDefined();
    } else {
      expect(bike).toBeUndefined();
    }
  });

  it('should include WALKING only if distance < 5', () => {
    const options = callService();
    const walk = options.find(o => o.type === TransportType.WALKING);
    const baseDistance = options.find(o => o.type === TransportType.BUS)?.distance;

    if (baseDistance && baseDistance < 5) {
      expect(walk).toBeDefined();
    } else {
      expect(walk).toBeUndefined();
    }
  });

  it('each option must contain required numeric fields', () => {
    const options = callService();
    options.forEach(o => {
      expect(typeof o.distance).toBe('number');
      expect(typeof o.duration).toBe('number');
      expect(typeof o.cost).toBe('number');
      expect(typeof o.comfort).toBe('number');
      expect(typeof o.reliability).toBe('number');
      expect(typeof o.score).toBe('number');
      expect(isNaN(o.score)).toBe(false);
    });
  });

  it('score should be between 0 and 10', () => {
    const options = callService();
    options.forEach(o => {
      expect(o.score).toBeGreaterThanOrEqual(0);
      expect(o.score).toBeLessThanOrEqual(10);
    });
  });
});
