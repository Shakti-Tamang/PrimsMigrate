import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AttendenceService } from '../../service/attendence/attendence.service';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../../DTO/shakti.studentinfo';


@Controller('attendence')
@ApiBearerAuth()
@ApiTags('Attendence')
export class AttendenceController {

constructor (private attendence:AttendenceService){

}


// it is for attendence api

@Post("/saveUser")
async saveuser(@Body() dto:CreateUserDto){
 return await this.attendence.create(dto);
}

@Post("/signInUser")
async signIn(@Body() dto:CreateUserDto){
return await this.attendence.signIn(dto);

}

@Get("/getUser")
async getUser():Promise<CreateUserDto[]>{
return await  this.attendence.getAll(); 
}

@Delete("/deleteById/:id")

async delete(@Param('id') id:string){
 return await this.attendence.deleteById(id);
}

@Patch('updateOrder/:id')
async updateOrder(@Param('id') id: string, @Body() dto:CreateUserDto) {
  return await this.attendence.updateUser(id, dto);
}

}
