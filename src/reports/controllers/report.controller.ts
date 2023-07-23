import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/dercorators/currentUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserEntity } from 'src/users/user.entity';
import { ApproveReportDto } from '../dtos/approveReport.dto';
import { CreateReportDto } from '../dtos/createReport.dto';
import { ResponseReport } from '../dtos/responseReport';
import { ReportService } from '../services/report.service';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/dercorators/role.decorator';
import { RolesGuard } from 'src/guards/role.guard';
import { GetEstimateDto } from '../dtos/getEstimate.dto';

@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Post('/create')
  @Serialize(ResponseReport)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: UserEntity) {
    return this.reportService.create(body, user);
  }

  @Get('/:id')
  @Serialize(ResponseReport)
  findOne(@Param('id') id: string) {
    return this.reportService.findOne(id);
  }

  @Patch('/:id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportService.changeApprove(id, body.isApprove);
  }

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportService.createEstimate(query);
  }
}
