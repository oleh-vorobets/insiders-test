import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessToken } from './types';
import { RtGuard } from 'src/common/guards';
import { CurrentUser, CurrentUserId, Public } from 'src/common/decorators';
import { ForgotPasswordDto, SignInDto, SignUpDto } from './dtos';
import { Response } from 'express';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(
    @Body() authPayload: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessToken> {
    const { access_token, refresh_token } =
      await this.authService.signin(authPayload);

    response.setCookie('refreshToken', refresh_token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { access_token };
  }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() authPayload: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessToken> {
    const { access_token, refresh_token } =
      await this.authService.signup(authPayload);

    response.setCookie('refreshToken', refresh_token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { access_token };
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUserId() userId: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(userId);

    response.setCookie('refreshToken', '', {
      maxAge: 1,
    });

    return userId;
  }

  @Public()
  @UseGuards(RtGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @CurrentUser('refreshToken') refreshToken: string,
    @CurrentUserId() userId: number,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessToken> {
    const { access_token, refresh_token } = await this.authService.refresh(
      userId,
      refreshToken,
    );

    response.setCookie('refreshToken', refresh_token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { access_token };
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.sendPasswordResetEmail(
      forgotPasswordDto.email,
    );
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessToken> {
    const { access_token, refresh_token } =
      await this.authService.resetPassword(
        resetPasswordDto.token,
        resetPasswordDto.password,
      );

    response.setCookie('refreshToken', refresh_token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { access_token };
  }
}
