import { Module } from '@nestjs/common';
import { CreditCardsController } from './credit-cards.controller';
import { CreditCardsService } from './credit-cards.service';
import { PrismaService } from '../prisma/prisma.service';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  imports: [AccountsModule],
  controllers: [CreditCardsController],
  providers: [CreditCardsService, PrismaService],
  exports: [CreditCardsService],
})
export class CreditCardsModule {}
