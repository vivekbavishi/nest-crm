import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity.js';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto.js';
@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customers: Repository<Customer>,
  ) {}
  list() {
    return this.customers.find({ order: { name: 'ASC' } });
  }
  async find(id: number) {
    const customer = await this.customers.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }
  async create(dto: CreateCustomerDto) {
    if (await this.customers.findOne({ where: { email: dto.email } }))
      throw new ConflictException('Customer email already exists');
    return this.customers.save(this.customers.create(dto));
  }
  async update(id: number, dto: UpdateCustomerDto) {
    const customer = await this.find(id);
    Object.assign(customer, dto);
    return this.customers.save(customer);
  }
  async remove(id: number) {
    await this.customers.remove(await this.find(id));
    return { message: 'Customer deleted' };
  }
}
