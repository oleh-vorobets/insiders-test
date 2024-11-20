import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class ReqLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP_REQUEST');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const now = Date.now();

    const isProduction = process.env.NODE_ENV === 'development';

    const logMessage =
      `METHOD - ${req.method} | URL - ${req.url} | ` +
      (!isProduction
        ? ''
        : `QUERY - ${JSON.stringify(req.query)} | PARAMS - ${JSON.stringify(req.params)} | BODY - ${JSON.stringify(req.body)} `) +
      `${this.getColorizedStatusCode(res.statusCode)} ${Date.now() - now} ms`;

    return next.handle().pipe(
      tap(() => {
        req.url && this.logger.log(logMessage);
      }),
      catchError((error) => {
        req.url && this.logger.log(logMessage);
        throw error;
      }),
    );
  }

  private getColorizedStatusCode(statusCode: number): string {
    const yellow = '\x1b[33m';
    const reset = '\x1b[0m';

    return `${yellow}${statusCode}${reset}`;
  }
}
