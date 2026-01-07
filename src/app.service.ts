import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    const response = {
      'message':'Hello World!'
    };
    return response;
  }
}
