import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { LoginDto, RegisterDto } from './dto/auth.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}
  async register(dto: RegisterDto) {
    return this.issue(
      await this.users.create(dto.name, dto.email, dto.password),
    );
  }
  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password)))
      throw new UnauthorizedException('Invalid credentials');
    return this.issue(user);
  }
  private issue(user: {
    id: number;
    email: string;
    name: string;
    role: string;
  }) {
    return this.jwt
      .signAsync({ sub: user.id, email: user.email, role: user.role })
      .then((accessToken) => ({
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }));
  }
}
