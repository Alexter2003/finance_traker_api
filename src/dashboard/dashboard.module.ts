import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';
import { AccountsModule } from '../accounts/accounts.module';
import { CreditCardsModule } from '../credit-cards/credit-cards.module';

@Module({
  imports: [AccountsModule, CreditCardsModule],
  controllers: [DashboardController],
  providers: [DashboardService, PrismaService],
})
export class DashboardModule {}

