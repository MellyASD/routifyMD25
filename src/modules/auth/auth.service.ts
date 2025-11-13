import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from 'src/dto/login.dto'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        private jwtService: JwtService,
    ) { }

    
    async register(data: CreateUserDTO) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const userCreated = this.userRepo.create({ ...data, password: hashedPassword });
        await this.userRepo.save(userCreated);
        return { message: 'User successfully registered', user: { id: userCreated.id, email: userCreated.email } };
    }

    
    async login(data: LoginDTO) {
        const user = await this.userRepo.findOne({ where: { email: data.email } });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payloadToken = { sub: user.id, email: user.email, name: user.name, role: user.role };
        const token = await this.jwtService.signAsync(payloadToken);

        return { accessToken: token }

    }
}