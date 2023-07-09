import { Module } from '@nestjs/common';
import { ServicesService } from './services/services.service';
import { ControllersController } from './controllers/controllers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity } from './report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReportEntity])],
  providers: [ServicesService],
  controllers: [ControllersController],
})
export class ReportsModule {}
