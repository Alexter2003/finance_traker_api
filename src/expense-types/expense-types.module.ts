import { Module } from '@nestjs/common';
import { ExpenseTypesController } from './expense-types.controller';
import { ExpenseTypesService } from './expense-types.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ExpenseTypesController],
  providers: [ExpenseTypesService, PrismaService],
  exports: [ExpenseTypesService],
})
export class ExpenseTypesModule {}
