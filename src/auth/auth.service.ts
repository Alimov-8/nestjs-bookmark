import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService ,
    ) {}  // Dependency Injection

    async signup(dto: AuthDto) {
        // Generate hash for user password using argon2
        const hash = await argon.hash(dto.password);
        try {
            // try to create user using prisma orm
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
            })

            return this.signToken(user.id, user.email);
        }
        catch(error) {
            // if email not unique then return 403 Forbidden error
            if (error instanceof PrismaClientKnownRequestError) { 
                if (error.code === 'P2002') {
                    throw new ForbiddenException(
                        "Credentials taken",
                    );
                }
            }
            throw error;
        }
    }

    async signin(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        });

        if (!user) throw new ForbiddenException(
            'Credentials incorrect',
        );

        const  pwMatches = await argon.verify(
            user.hash, 
            dto.password
        );

        if (!pwMatches) throw new ForbiddenException(
            'Credentials incorrect',
        );

        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string): Promise<{access_token: string}> {
        const payload = {
            sub: userId,
            email,
        }

        const token = await this.jwt.signAsync(
            payload, 
            {
                expiresIn: '30m',
                secret: this.config.get("JWT_SECRET"),
            }
        )

        return {
            access_token: token,
        }
    }
}
