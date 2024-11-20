import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { Tokens } from './types';
import { SignInDto, SignUpDto } from './dtos';
import { ConfigService } from '@nestjs/config';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}
  async signin({ email, password }: SignInDto): Promise<Tokens> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new ForbiddenException('Access denied');
    }
    if (user.isDeleted) {
      throw new ForbiddenException('Access denied');
    }
    if (!(await compare(password, user.password))) {
      throw new ForbiddenException('Access denied');
    }
    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRt(user.id, tokens.refresh_token);
    return tokens;
  }

  async signup(payload: SignUpDto): Promise<Tokens> {
    const user = await this.userService.findOneByEmail(payload.email);
    if (user) {
      throw new BadRequestException('User is already registered');
    }
    payload.password = await this.hashData(payload.password);
    const createdUser = await this.userService.create(payload);
    const tokens = await this.generateTokens(createdUser.id, createdUser.email);
    await this.updateRt(createdUser.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number) {
    await this.userService.deleteRefreshToken(userId);
  }

  async refresh(userId: number, rt: string) {
    const user = await this.userService.findOneById(userId);
    if (!user || user.isDeleted || !user.token)
      throw new ForbiddenException('Access denied');

    const isRtMathes = await compare(rt, user.token);
    if (!isRtMathes) throw new ForbiddenException('Access denied');

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRt(user.id, tokens.refresh_token);
    return tokens;
  }

  async sendPasswordResetEmail(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = this.jwtService.sign(
      { userId: user.id },
      {
        secret: this.configService.get<string>('RESET_PASSWORD_SECRET'),
        expiresIn: '1h',
      },
    );

    const resetLink = `http://localhost:5173/reset?token=${token}`;

    await this.mailerService.sendEmail({
      to: email,
      from: 'mrvorobetso228@gmail.com',
      subject: 'Password Reset',
      text: `Click the link to reset your password: ${resetLink}`,
      html: `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p><p>Be careful your password will be available only for 1 hour</p>`,
    });

    return true;
  }

  async resetPassword(token: string, newPassword: string) {
    const userId = await this.decodeResetPasswordToken(token);

    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User was not found`);
    }
    const hashedPassword = await this.hashData(newPassword);
    await this.userService.update(user.id, { password: hashedPassword });
    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRt(user.id, tokens.refresh_token);
    return tokens;
  }

  async generateTokens(userId: number, email: string): Promise<Tokens> {
    const payload = { sub: userId, email };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '30d',
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      }),
    ]);
    return { access_token, refresh_token };
  }

  async decodeResetPasswordToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('RESET_PASSWORD_SECRET'),
      });

      if (typeof payload === 'object' && 'userId' in payload) {
        return payload.userId;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async updateRt(userId: number, token: string) {
    const hashedToken = await hash(token, 10);
    return await this.userService.update(userId, { token: hashedToken });
  }

  async hashData(data: string) {
    return await hash(data, 10);
  }
}
