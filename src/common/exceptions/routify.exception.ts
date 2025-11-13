import { HttpException, HttpStatus } from "@nestjs/common";

export class RoutifyException extends HttpException {
    constructor(message: string) {
        super({ error: 'RoutifyError', message }, HttpStatus.BAD_REQUEST)
    }
}

export class TransportNotFoundException extends HttpException {
  constructor() {
    super({ error: 'TransportNotFound', message: 'Transport method not found' }, HttpStatus.NOT_FOUND);
  }
}
export class RouteNotFoundException extends HttpException {
  constructor() {
    super({ error: 'RouteNotFound', message: 'Route not found' }, HttpStatus.NOT_FOUND);
  }
}

export class UserNotFoundException extends HttpException {
  constructor() {
    super({ error: 'UserNotFound', message: 'User not found' }, HttpStatus.NOT_FOUND);
  }
}

export class AccessDeniedException extends HttpException {
  constructor() {
    super({ error: 'AccessDenied', message: 'Access denied' }, HttpStatus.FORBIDDEN);
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super({ error: 'InvalidCredentials', message: 'Invalid credentials' }, HttpStatus.UNAUTHORIZED);
  }
}
