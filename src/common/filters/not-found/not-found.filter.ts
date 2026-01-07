import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const accept = req.headers.accept || '';
    const isApi =
      req.originalUrl.startsWith('/api') ||
      accept.includes('application/json');

    if (isApi) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Not Found',
      });
    }

    return res.status(404).render('page-404', {
      pageTitle: 'Page not found',
    });
  }
}
