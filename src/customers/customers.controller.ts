import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto.js';
import { CustomersService } from './customers.service.js';
@ApiTags('customers') @ApiBearerAuth() @Controller('customers') @UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customers: CustomersService) {}
  @Get() list() { return this.customers.list(); }
  @Get(':id') find(@Param('id', ParseIntPipe) id: number) { return this.customers.find(id); }
  @Post() create(@Body() dto: CreateCustomerDto) { return this.customers.create(dto); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCustomerDto) { return this.customers.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.customers.remove(id); }
}