import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AttendenceModule } from './module/attendence/attendence.module'; // Ensure the path is correct
import { AppController } from './core/App/app.controller';
import { AppService } from './core/App/app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Uncomment these if you need them
    // AuthModule,
    // JwtModule.register({}),
    AttendenceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
