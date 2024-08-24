import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { BaseRepository } from "src/core/Database/interface/baserepository";
import { PGDatabaseService } from "src/core/Database/pg.database.service";

@Injectable()
export class attendenceRepo extends BaseRepository<User>{
    constructor(private pgDatabaseServise: PGDatabaseService) {
        super(pgDatabaseServise.prismaRead.user);
      }
      async create(item:User): Promise<User> {
        return await this.pgDatabaseServise.prismaWrite.user.create({
          data: item,
        });
      }
      async find():Promise<User[]>{

        return await this.pgDatabaseServise.prismaWrite.user.findMany();
      }

      async delete(id: string): Promise<boolean> {
        try {
          await this.pgDatabaseServise.prismaWrite.user.delete({
            where: { id },
          });
          return true; // Return true if deletion was successful
        } catch (error) {
          console.error('Error deleting user:', error);
          return false; // Return false if there was an error
        }
      }

      async findOne(id: string): Promise<User | null> {
        return await this.pgDatabaseServise.prismaWrite.user.findUnique({
          where: { id },
        });
      }

      async update(id: string,item:User): Promise<User> {
        return await this.pgDatabaseServise.prismaWrite.user.update({
            where: { id: id },
            data: item,
          });  
      }
}