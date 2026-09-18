import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getStatus() {
    return { name: 'CRM Task Manager API', status: 'ok' };
  }
}
