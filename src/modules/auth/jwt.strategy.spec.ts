import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  it('should be defined', () => {
    const mockConfig = {
      get: (key: string) => {
        if (key === 'JWT_SECRET_KEY') return 'test-secret';
        return null;
      },
    };

    const strategy = new JwtStrategy(mockConfig as ConfigService);
    expect(strategy).toBeDefined();
  });
});