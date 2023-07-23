import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportEntity } from '../report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from '../dtos/createReport.dto';
import { UserEntity } from 'src/users/user.entity';
import { ApproveReportDto } from '../dtos/approveReport.dto';
import { GetEstimateDto } from '../dtos/getEstimate.dto';

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

  async createEstimate({
    make,
    model,
    lat,
    lng,
    year,
    kilometer,
  }: GetEstimateDto) {
    return await this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('isApprove IS TRUE')
      .orderBy('kilometer', 'DESC')
      .setParameters({ kilometer })
      .limit(3)
      .getRawOne();
  }
}
