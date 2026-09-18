import { IsEmail, IsString, MinLength } from 'class-validator';
export class CreateCustomerDto {
  @IsString() @MinLength(2) name!: string;
  @IsEmail() email!: string;
  @IsString() company!: string;
  @IsString() contact!: string;
}
export class UpdateCustomerDto {
  @IsString() @MinLength(2) name?: string;
  @IsEmail() email?: string;
  @IsString() company?: string;
  @IsString() contact?: string;
}
