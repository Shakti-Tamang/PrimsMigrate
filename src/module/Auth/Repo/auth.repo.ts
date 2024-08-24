import { Injectable } from '@nestjs/common';
import { User, Role } from '@prisma/client';
import { PGDatabaseService } from 'src/core/Database/pg.database.service';
import { BaseRepository } from 'src/core/Database/interface/baserepository';

@Injectable()
export class AuthRepo extends BaseRepository<User> {
  constructor(private pgDatabaseService: PGDatabaseService) {
    super(pgDatabaseService.prismaRead.user);
  }

  async create(item: User): Promise<User> {
    return await this.pgDatabaseService.prismaWrite.user.create({ data: item });
  }

  async update(id: string, item: Partial<User>): Promise<User> {
    return await this.pgDatabaseService.prismaWrite.user.update({
      where: { id: id },
      data: item,
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.pgDatabaseService.prismaWrite.user.delete({
        where: { id: id },
      });
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  async find(item: Partial<User>): Promise<User[]> {
    // Create a filter object compatible with Prisma's UserWhereInput
    const filter: {
      where?: {
        id?: string;
        email?: string;
        name?: string;
        address?: string;
        contact?: string;
        gender?: string;
        image?: string;
        createdDate?: Date;
        status?: string;
        emailVerified?: boolean;
        roles?: {
          has?: Role;
        };
      };
    } = {};

    // Populate filter based on the `item` provided
    if (item.id) filter.where.id = item.id;
    if (item.email) filter.where.email = item.email;
    if (item.name) filter.where.name = item.name;
    if (item.address) filter.where.address = item.address;
    if (item.contact) filter.where.contact = item.contact;
    if (item.gender) filter.where.gender = item.gender;
    if (item.image) filter.where.image = item.image;
    if (item.createdDate) filter.where.createdDate = item.createdDate;
    if (item.status) filter.where.status = item.status;
    if (item.emailVerified !== undefined) filter.where.emailVerified = item.emailVerified;

    // Handle roles separately
    if (item.roles) {
      filter.where.roles = { has: item.roles[0] }; // Modify based on how you want to filter by roles
    }

    return await this.pgDatabaseService.prismaRead.user.findMany(filter);
  }

  async findOne(id: string): Promise<User | null> {
    return await this.pgDatabaseService.prismaRead.user.findUnique({
      where: { id: id },
    });
  }

  async findUnique(email: string): Promise<User | null> {
    return await this.pgDatabaseService.prismaRead.user.findUnique({
      where: { email: email },
    });
  }


  async forgotPassword(email: string, item: Partial<User>): Promise<User> {
    return await this.pgDatabaseService.prismaWrite.user.update({
      where: { email: email },
      data: item,
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.pgDatabaseService.prismaRead.user.findUnique({
      where: { email: email },
    });
  }
}
