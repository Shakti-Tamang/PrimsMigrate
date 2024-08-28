import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt'; // If you are using JwtModule, make sure it's correctly imported
import { AttendenceService } from './service/attendence/attendence.service';
import { PGDatabaseService } from 'src/core/Database/pg.database.service';
import { attendenceRepo } from './Repository/table.repo';
import { AttendenceController } from './controllers/attendence/attendence.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../Strategy';

@Module({
 imports: [
    ConfigModule,
    JwtModule.register({}),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
    providers: [AttendenceService, PGDatabaseService, attendenceRepo,JwtService],
  controllers: [AttendenceController],

  exports:[AttendenceService, JwtStrategy],
})
export class AttendenceModule {}
