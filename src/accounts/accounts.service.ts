import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { QueryAccountDto } from './dto/query-account.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calcula el balance dinámico de una cuenta según la fórmula:
   * initialBalance + sum(Income) - sum(Expense) + sum(Transaction recibidas) - sum(Transaction enviadas) + sum(AccountAdjustment)
   */
  async calculateBalance(accountId: number): Promise<number> {
    const [
      incomesSum,
      expensesSum,
      transactionsReceivedSum,
      transactionsSentSum,
      adjustmentsSum,
    ] = await Promise.all([
      // Suma de ingresos
      this.prisma.income.aggregate({
        where: {
          accountId,
          deletedAt: null,
        },
        _sum: {
          amount: true,
        },
      }),
      // Suma de gastos
      this.prisma.expense.aggregate({
        where: {
          accountId,
          deletedAt: null,
        },
        _sum: {
          amount: true,
        },
      }),
      // Suma de transacciones recibidas
      this.prisma.transaction.aggregate({
        where: {
          toAccountId: accountId,
          deletedAt: null,
        },
        _sum: {
          amount: true,
        },
      }),
      // Suma de transacciones enviadas
      this.prisma.transaction.aggregate({
        where: {
          fromAccountId: accountId,
          deletedAt: null,
        },
        _sum: {
          amount: true,
        },
      }),
      // Suma de ajustes
      this.prisma.accountAdjustment.aggregate({
        where: {
          accountId,
          deletedAt: null,
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    const initialBalance = (
      await this.prisma.account.findUnique({
        where: { id: accountId },
        select: { initialBalance: true },
      })
    )?.initialBalance || 0;

    const balance =
      Number(initialBalance) +
      Number(incomesSum._sum.amount || 0) -
      Number(expensesSum._sum.amount || 0) +
      Number(transactionsReceivedSum._sum.amount || 0) -
      Number(transactionsSentSum._sum.amount || 0) +
      Number(adjustmentsSum._sum.amount || 0);

    return balance;
  }

  async create(createAccountDto: CreateAccountDto) {
    const existingAccount = await this.prisma.account.findFirst({
      where: {
        name: createAccountDto.name,
        deletedAt: null,
      },
    });

    if (existingAccount) {
      throw new ConflictException(
        `Ya existe una cuenta con el nombre "${createAccountDto.name}"`,
      );
    }

    const account = await this.prisma.account.create({
      data: {
        name: createAccountDto.name,
        type: createAccountDto.type,
        initialBalance: createAccountDto.initialBalance,
      },
    });

    // Calcular el balance dinámico (será igual al initialBalance ya que no hay movimientos aún)
    const balance = await this.calculateBalance(account.id);

    return {
      ...account,
      balance,
    };
  }

  async findAll(queryDto: QueryAccountDto) {
    const { type, search, page = 1, limit = 10 } = queryDto;
    const skip = (page - 1) * limit;

    const where: Prisma.AccountWhereInput = {
      deletedAt: null,
    };

    if (type) {
      where.type = type;
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [accounts, total] = await Promise.all([
      this.prisma.account.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.account.count({ where }),
    ]);

    // Calcular el balance para cada cuenta
    const data = await Promise.all(
      accounts.map(async (account) => {
        const balance = await this.calculateBalance(account.id);
        return {
          ...account,
          balance,
        };
      }),
    );

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
    const account = await this.prisma.account.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!account) {
      throw new NotFoundException(`Cuenta con ID ${id} no encontrada`);
    }

    // Calcular el balance dinámico
    const balance = await this.calculateBalance(id);

    return {
      ...account,
      balance,
    };
  }

  async update(id: number, updateAccountDto: UpdateAccountDto) {
    await this.findOne(id);

    if (updateAccountDto.name) {
      const existingAccount = await this.prisma.account.findFirst({
        where: {
          name: updateAccountDto.name,
          deletedAt: null,
          id: {
            not: id,
          },
        },
      });

      if (existingAccount) {
        throw new ConflictException(
          `Ya existe una cuenta con el nombre "${updateAccountDto.name}"`,
        );
      }
    }

    const account = await this.prisma.account.update({
      where: { id },
      data: updateAccountDto,
    });

    // Calcular el balance dinámico actualizado
    const balance = await this.calculateBalance(id);

    return {
      ...account,
      balance,
    };
  }

  async remove(id: number) {
    await this.findOne(id);

    const hasIncomes = await this.prisma.income.count({
      where: {
        accountId: id,
        deletedAt: null,
      },
      take: 1,
    });

    const hasExpenses = await this.prisma.expense.count({
      where: {
        accountId: id,
        deletedAt: null,
      },
      take: 1,
    });

    const hasTransactionsFrom = await this.prisma.transaction.count({
      where: {
        fromAccountId: id,
        deletedAt: null,
      },
      take: 1,
    });

    const hasTransactionsTo = await this.prisma.transaction.count({
      where: {
        toAccountId: id,
        deletedAt: null,
      },
      take: 1,
    });

    const hasAdjustments = await this.prisma.accountAdjustment.count({
      where: {
        accountId: id,
        deletedAt: null,
      },
      take: 1,
    });

    if (
      hasIncomes ||
      hasExpenses ||
      hasTransactionsFrom ||
      hasTransactionsTo ||
      hasAdjustments
    ) {
      throw new BadRequestException(
        'No se puede eliminar una cuenta que tiene ingresos, gastos, transacciones o ajustes asociados',
      );
    }

    return this.prisma.account.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
