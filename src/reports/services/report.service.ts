import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportEntity } from '../report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from '../dtos/createReport.dto';
import { UserEntity } from 'src/users/user.entity';
import { ApproveReportDto } from '../dtos/approveReport.dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ReportEntity) private repo: Repository<ReportEntity>,
  ) {}

  async create(body: CreateReportDto, user: UserEntity) {
    const report = this.repo.create({ ...body, user: user });
    return await this.repo.save(report);
  }

  async findOne(id: string) {
    const report = this.repo.findOneBy({ id });

    if (!report) {
      throw new NotFoundException();
    }

    return report;
  }

  async changeApprove(id: string, isApprove: boolean) {
    const report = await this.findOne(id);

    if (!report) {
      throw new NotFoundException();
    }
    report.isApprove = isApprove;

    return this.repo.save(report);
  }
}
