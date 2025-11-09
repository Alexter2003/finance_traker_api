import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseQueryDto } from './dto/expense-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createExpenseDto: CreateExpenseDto) {
    try {
      const account = await this.prisma.account.findFirst({
        where: {
          id: createExpenseDto.accountId,
          deletedAt: null,
        },
      });

      if (!account) {
        throw new NotFoundException(
          `Cuenta con ID ${createExpenseDto.accountId} no encontrada`,
        );
      }

      const expenseType = await this.prisma.expenseType.findFirst({
        where: {
          id: createExpenseDto.expenseTypeId,
          deletedAt: null,
        },
      });

      if (!expenseType) {
        throw new NotFoundException(
          `Tipo de gasto con ID ${createExpenseDto.expenseTypeId} no encontrado`,
        );
      }

      return await this.prisma.expense.create({
        data: {
          amount: createExpenseDto.amount,
          accountId: createExpenseDto.accountId,
          expenseTypeId: createExpenseDto.expenseTypeId,
          description: createExpenseDto.description,
          date: new Date(createExpenseDto.date),
        },
        include: {
          account: true,
          expenseType: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al crear el gasto');
    }
  }

  async findAll(query: ExpenseQueryDto) {
    const {
      accountId,
      expenseTypeId,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ExpenseWhereInput = {
      deletedAt: null,
      ...(accountId && { accountId }),
      ...(expenseTypeId && { expenseTypeId }),
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) }),
            },
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.expense.findMany({
        where,
        skip,
        take: limit,
        include: {
          account: true,
          expenseType: true,
        },
        orderBy: {
          date: 'desc',
        },
      }),
      this.prisma.expense.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const expense = await this.prisma.expense.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        account: true,
        expenseType: true,
      },
    });

    if (!expense) {
      throw new NotFoundException(`Gasto con ID ${id} no encontrado`);
    }

    return expense;
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    try {
      const existingExpense = await this.prisma.expense.findFirst({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!existingExpense) {
        throw new NotFoundException(`Gasto con ID ${id} no encontrado`);
      }

      if (updateExpenseDto.accountId) {
        const account = await this.prisma.account.findFirst({
          where: {
            id: updateExpenseDto.accountId,
            deletedAt: null,
          },
        });

        if (!account) {
          throw new NotFoundException(
            `Cuenta con ID ${updateExpenseDto.accountId} no encontrada`,
          );
        }
      }

      if (updateExpenseDto.expenseTypeId) {
        const expenseType = await this.prisma.expenseType.findFirst({
          where: {
            id: updateExpenseDto.expenseTypeId,
            deletedAt: null,
          },
        });

        if (!expenseType) {
          throw new NotFoundException(
            `Tipo de gasto con ID ${updateExpenseDto.expenseTypeId} no encontrado`,
          );
        }
      }

      return await this.prisma.expense.update({
        where: { id },
        data: {
          ...(updateExpenseDto.amount !== undefined && {
            amount: updateExpenseDto.amount,
          }),
          ...(updateExpenseDto.accountId !== undefined && {
            accountId: updateExpenseDto.accountId,
          }),
          ...(updateExpenseDto.expenseTypeId !== undefined && {
            expenseTypeId: updateExpenseDto.expenseTypeId,
          }),
          ...(updateExpenseDto.description !== undefined && {
            description: updateExpenseDto.description,
          }),
          ...(updateExpenseDto.date !== undefined && {
            date: new Date(updateExpenseDto.date),
          }),
        },
        include: {
          account: true,
          expenseType: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar el gasto');
    }
  }

  async remove(id: number) {
    const expense = await this.prisma.expense.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!expense) {
      throw new NotFoundException(`Gasto con ID ${id} no encontrado`);
    }

    return await this.prisma.expense.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
