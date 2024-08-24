import { Role } from '@prisma/client';
import { IsString, IsNotEmpty, IsEmail, IsBoolean, IsArray } from 'class-validator';


export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  contact: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  image: string;  // Change this to be required

  @IsNotEmpty()
  createdDate: Date;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsBoolean()
  emailVerified: boolean;

  @IsArray()
  roles: Role[];
}
