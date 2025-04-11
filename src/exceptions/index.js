export class BadRequestException extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestException';
    this.statusCode = 400;
  }
}

export class NotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundException';
    this.statusCode = 404;
  }
}

export class UnauthorizedException extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedException';
    this.statusCode = 401;
  }
}

export class ForbiddenException extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenException';
    this.statusCode = 403;
  }
} 