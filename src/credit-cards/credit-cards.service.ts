import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountsService } from '../accounts/accounts.service';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { QueryCreditCardDto } from './dto/query-credit-card.dto';
import { Prisma, AccountType } from '@prisma/client';

@Injectable()
export class CreditCardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accountsService: AccountsService,
  ) {}

  /**
   * Calcula el balance dinámico de una tarjeta de crédito.
   * Las tarjetas de crédito permiten saldo negativo (deuda pendiente).
   */
  async calculateBalance(creditCardId: number): Promise<number> {
    return this.accountsService.calculateBalance(creditCardId);
  }

  /**
   * Obtiene la deuda pendiente (saldo negativo) de una tarjeta de crédito.
   * Si el balance es positivo o cero, la deuda es 0.
   */
  async getDebt(creditCardId: number): Promise<number> {
    const balance = await this.calculateBalance(creditCardId);
    return balance < 0 ? Math.abs(balance) : 0;
  }

  async create(createCreditCardDto: CreateCreditCardDto) {
    // Verificar que no exista otra tarjeta con el mismo nombre
    const existingCreditCard = await this.prisma.account.findFirst({
      where: {
        name: createCreditCardDto.name,
        type: AccountType.CREDIT_CARD,
        deletedAt: null,
      },
    });

    if (existingCreditCard) {
      throw new ConflictException(
        `Ya existe una tarjeta de crédito con el nombre "${createCreditCardDto.name}"`,
      );
    }

    // Crear la cuenta como tarjeta de crédito
    const creditCard = await this.prisma.account.create({
      data: {
        name: createCreditCardDto.name,
        type: AccountType.CREDIT_CARD,
        initialBalance: createCreditCardDto.initialBalance,
      },
    });

    // Calcular el balance dinámico
    const balance = await this.calculateBalance(creditCard.id);
    const debt = await this.getDebt(creditCard.id);

    return {
      ...creditCard,
      balance,
      debt,
    };
  }

  async findAll(queryDto: QueryCreditCardDto) {
    const { search, page = 1, limit = 10 } = queryDto;
    const skip = (page - 1) * limit;

    const where: Prisma.AccountWhereInput = {
      type: AccountType.CREDIT_CARD,
      deletedAt: null,
    };

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [creditCards, total] = await Promise.all([
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

    // Calcular el balance y deuda para cada tarjeta
    const data = await Promise.all(
      creditCards.map(async (creditCard) => {
        const balance = await this.calculateBalance(creditCard.id);
        const debt = await this.getDebt(creditCard.id);
        return {
          ...creditCard,
          balance,
          debt,
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
    const creditCard = await this.prisma.account.findFirst({
      where: {
        id,
        type: AccountType.CREDIT_CARD,
        deletedAt: null,
      },
    });

    if (!creditCard) {
      throw new NotFoundException(
        `Tarjeta de crédito con ID ${id} no encontrada`,
      );
    }

    // Calcular el balance dinámico y deuda
    const balance = await this.calculateBalance(id);
    const debt = await this.getDebt(id);

    return {
      ...creditCard,
      balance,
      debt,
    };
  }

  async update(id: number, updateCreditCardDto: UpdateCreditCardDto) {
    await this.findOne(id);

    if (updateCreditCardDto.name) {
      const existingCreditCard = await this.prisma.account.findFirst({
        where: {
          name: updateCreditCardDto.name,
          type: AccountType.CREDIT_CARD,
          deletedAt: null,
          id: {
            not: id,
          },
        },
      });

      if (existingCreditCard) {
        throw new ConflictException(
          `Ya existe una tarjeta de crédito con el nombre "${updateCreditCardDto.name}"`,
        );
      }
    }

    const creditCard = await this.prisma.account.update({
      where: { id },
      data: updateCreditCardDto,
    });

    // Calcular el balance dinámico y deuda actualizados
    const balance = await this.calculateBalance(id);
    const debt = await this.getDebt(id);

    return {
      ...creditCard,
      balance,
      debt,
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
        'No se puede eliminar una tarjeta de crédito que tiene ingresos, gastos, transacciones o ajustes asociados',
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
