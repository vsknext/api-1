import { Body, Controller, Post } from '@nestjs/common';
import { users } from '@prisma/client';
import { RateLimit } from 'nestjs-rate-limiter';
import { OmitSecrets } from 'src/modules/prisma/prisma.interface';
import { RegisterDto, ResendEmailVerificationDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @RateLimit({
    points: 10,
    duration: 60,
    errorMessage: 'Wait for 60 seconds before trying to create an account',
  })
  async update(@Body() data: RegisterDto): Promise<OmitSecrets<users>> {
    return this.authService.register(data);
  }

  @Post('resend-email-verification')
  @RateLimit({
    points: 1,
    duration: 60,
    errorMessage: 'Wait for 60 seconds before requesting another email',
  })
  async resendVerify(@Body() data: ResendEmailVerificationDto) {
    return this.authService.sendEmailVerification(data.email, true);
  }
}
