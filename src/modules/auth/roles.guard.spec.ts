import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';

describe('RolesGuard', () => {
  it('Should be defined', () => {
    const reflector = new Reflector();
    const guard = new RolesGuard(reflector);
    expect(guard).toBeDefined();
  });
});