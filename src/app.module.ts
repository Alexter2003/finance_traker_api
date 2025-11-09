import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { IncomesModule } from './incomes/incomes.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ExpenseTypesModule } from './expense-types/expense-types.module';
import { CreditCardsModule } from './credit-cards/credit-cards.module';
import { BudgetsModule } from './budgets/budgets.module';
import { AccountAdjustmentsModule } from './account-adjustments/account-adjustments.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AccountsModule,
    TransactionsModule,
    IncomesModule,
    ExpensesModule,
    ExpenseTypesModule,
    CreditCardsModule,
    BudgetsModule,
    AccountAdjustmentsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule { }
