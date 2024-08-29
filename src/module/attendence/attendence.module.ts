import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt'; // If you are using JwtModule, make sure it's correctly imported
import { AttendenceService } from './service/attendence/attendence.service';
import { PGDatabaseService } from 'src/core/Database/pg.database.service';
import { attendenceRepo } from './Repository/table.repo';
import { AttendenceController } from './controllers/attendence/attendence.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

/*only requred are kept in the modules*/
@Module({
 imports: [
    ConfigModule,
    JwtModule.register({}),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
    providers: [AttendenceService, PGDatabaseService, attendenceRepo],
  controllers: [AttendenceController],

  exports:[AttendenceService],
})
export class AttendenceModule {}
