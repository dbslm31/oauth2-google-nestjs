import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';
import { Token } from './token.model';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<User | null> {
        return this.usersService.validateUser(email, password);
    }

    async login(user: User) {
        const payload = { username: user.username, email: user.email, sub: user.id, role: { name: user.role.name } };
        const accessToken = this.jwtService.sign(payload);


        await Token.create({
            token: accessToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 1800 * 1000),
        });

        return { access_token: accessToken };
    }

    async logout(token: string) {
        await Token.destroy({ where: { token } });
    }

    generateToken(payload: any): string {
        return this.jwtService.sign(payload);
    }

    async storeToken(token: string, userId: number): Promise<void> {
        await Token.create({
            token,
            userId,
            expiresAt: new Date(Date.now() + 1800 * 1000),
        });
    }


}
