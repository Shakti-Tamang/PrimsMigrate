import { Injectable } from '@nestjs/common';
import { attendenceRepo } from '../../Repository/table.repo';
import { User } from '@prisma/client';
import { StringUtils } from 'src/common/utils/string.utils';

@Injectable()
export class AttendenceService {

constructor(private attendence:attendenceRepo){}


async create(dto: User): Promise<string> {
  try {
    // Ensure that the ID is correctly set
    dto.id = StringUtils.generateRandomAlphaNumeric();

    // Use the repository's create method to handle the database operation
    await this.attendence.create(dto);

    return 'Created successfully';
  } catch (error) {
    // Include more context in the error if necessary
    throw new Error(`Failed to create user: ${error.message}`);
  }
}

async getAll(){
return await this.attendence.find();
}

async getOne(id:string){

    return await this.attendence.findOne(id);
}


async deleteById(id:string){
this.attendence.delete(id);
}

async updateUser(id:string,dto:User){
try{
this.attendence.update(id,dto);
return "edited successfully";
}

catch(error ){
throw error;
}
}


}
