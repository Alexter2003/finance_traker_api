import { Module } from '@nestjs/common';
import { AccountAdjustmentsService } from './account-adjustments.service';
import { AccountAdjustmentsController } from './account-adjustments.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AccountAdjustmentsController],
  providers: [AccountAdjustmentsService, PrismaService],
  exports: [AccountAdjustmentsService],
})
export class AccountAdjustmentsModule {}

