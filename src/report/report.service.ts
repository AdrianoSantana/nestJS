import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReportDTO } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(Report) private readonly repository: Repository<Report>
    ) {}

    public async create(args: CreateReportDTO, user: User): Promise<Report | null> {
        const report = this.repository.create(args)
        report.user = user
        return await this.repository.save(report)
    }

    public async moderateReport(
        id: string,
        approve: boolean,
        moderatorId: string
    ): Promise<Report> {
        const report = await this.repository.findOne({ where: { id }, relations: ['user'] })
        if (!report) {
            throw new BadRequestException('Not found a report with this id')
        }

        if (moderatorId === report.user.id) {
            throw new BadRequestException('The owner cant approve their own report')
        }

        report.approved = approve
        return await this.repository.save(report)
    }
}
