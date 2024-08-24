import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt'; // If you are using JwtModule, make sure it's correctly imported
import { AttendenceService } from './service/attendence/attendence.service';
import { PGDatabaseService } from 'src/core/Database/pg.database.service';
import { attendenceRepo } from './Repository/table.repo';
import { AttendenceController } from './controllers/attendence/attendence.controller';

@Module({
  imports: [], // Include JwtModule if needed
  providers: [AttendenceService, PGDatabaseService, attendenceRepo],
  controllers: [AttendenceController],
})
export class AttendenceModule {}
