import { Role } from '@prisma/client';
import { IsString, IsNotEmpty, IsEmail, IsBoolean, IsArray, IsUUID, IsOptional } from 'class-validator';


export class CreateUserDto {
  @IsUUID()
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
  @IsNotEmpty() // Ensure `image` is required
  image: string;

  @IsNotEmpty()
  createdDate: Date;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsBoolean()
  emailVerified: boolean;

  @IsArray()
  roles: Role[];

  @IsString()
  @IsNotEmpty()
  rmark: string;

  @IsString()
@IsOptional()
  attendanceId: string;

}
