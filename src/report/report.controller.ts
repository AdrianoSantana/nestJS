import { Body, Controller, Param, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateReportDTO } from './dtos/create-report.dto';
import { ReportService } from './report.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/user/user.entity';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { ReportDTO } from './dtos/report.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApproveReportDTO } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('report')
@UseGuards(AuthGuard)
export class ReportController {

    constructor(private readonly reportService: ReportService) {}

    @Post()
    @Serialize(ReportDTO)
    public async createReport(
        @CurrentUser() user: User,
        @Body() body: CreateReportDTO
    ) {
        return await this.reportService.create(body, user)
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    public async moderateReport(
        @Param('id') id: string,
        @Body() body: ApproveReportDTO,
        @CurrentUser() user: User,
    ) {
        return await this.reportService.moderateReport(
            id, 
            body.approved,
            user.id
        )
    }
}
