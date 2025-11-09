import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountsService } from '../accounts/accounts.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { Prisma, AccountType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accountsService: AccountsService,
  ) { }

  async create(createTransactionDto: CreateTransactionDto) {
    try {
      // Validar que las cuentas de origen y destino sean diferentes
      if (
        createTransactionDto.fromAccountId === createTransactionDto.toAccountId
      ) {
        throw new BadRequestException(
          'La cuenta de origen y destino no pueden ser la misma',
        );
      }

      // Validar que la cuenta de origen exista y no esté eliminada
      const fromAccount = await this.prisma.account.findFirst({
        where: {
          id: createTransactionDto.fromAccountId,
          deletedAt: null,
        },
      });

      if (!fromAccount) {
        throw new NotFoundException(
          `Cuenta de origen con ID ${createTransactionDto.fromAccountId} no encontrada`,
        );
      }

      // Validar que la cuenta de destino exista y no esté eliminada
      const toAccount = await this.prisma.account.findFirst({
        where: {
          id: createTransactionDto.toAccountId,
          deletedAt: null,
        },
      });

      if (!toAccount) {
        throw new NotFoundException(
          `Cuenta de destino con ID ${createTransactionDto.toAccountId} no encontrada`,
        );
      }

      // Validar que la cuenta de origen tenga suficiente balance
      // Las tarjetas de crédito permiten saldo negativo, otras cuentas no
      if (fromAccount.type !== AccountType.CREDIT_CARD) {
        const currentBalance = await this.accountsService.calculateBalance(
          createTransactionDto.fromAccountId,
        );

        if (currentBalance < createTransactionDto.amount) {
          throw new BadRequestException(
            `Saldo insuficiente. La cuenta "${fromAccount.name}" tiene un balance de $${currentBalance.toFixed(2)} y se intenta transferir $${createTransactionDto.amount.toFixed(2)}`,
          );
        }
      }

      return await this.prisma.transaction.create({
        data: {
          fromAccountId: createTransactionDto.fromAccountId,
          toAccountId: createTransactionDto.toAccountId,
          amount: createTransactionDto.amount,
          description: createTransactionDto.description,
          date: new Date(createTransactionDto.date),
        },
        include: {
          fromAccount: true,
          toAccount: true,
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Error al crear la transacción');
    }
  }

  async findAll(queryDto: TransactionQueryDto) {
    const {
      fromAccountId,
      toAccountId,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = queryDto;
    const skip = (page - 1) * limit;

    const where: Prisma.TransactionWhereInput = {
      deletedAt: null,
    };

    if (fromAccountId) {
      where.fromAccountId = fromAccountId;
    }

    if (toAccountId) {
      where.toAccountId = toAccountId;
    }

    if (startDate || endDate) {
      where.date = {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        include: {
          fromAccount: true,
          toAccount: true,
        },
        orderBy: {
          date: 'desc',
        },
      }),
      this.prisma.transaction.count({ where }),
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
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        fromAccount: true,
        toAccount: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada`);
    }

    return transaction;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    try {
      const existingTransaction = await this.prisma.transaction.findFirst({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!existingTransaction) {
        throw new NotFoundException(`Transacción con ID ${id} no encontrada`);
      }

      // Validar que las cuentas sean diferentes si ambas están siendo actualizadas
      if (
        updateTransactionDto.fromAccountId !== undefined &&
        updateTransactionDto.toAccountId !== undefined &&
        updateTransactionDto.fromAccountId === updateTransactionDto.toAccountId
      ) {
        throw new BadRequestException(
          'La cuenta de origen y destino no pueden ser la misma',
        );
      }

      // Validar cuenta de origen si se está actualizando
      if (updateTransactionDto.fromAccountId !== undefined) {
        const fromAccount = await this.prisma.account.findFirst({
          where: {
            id: updateTransactionDto.fromAccountId,
            deletedAt: null,
          },
        });

        if (!fromAccount) {
          throw new NotFoundException(
            `Cuenta de origen con ID ${updateTransactionDto.fromAccountId} no encontrada`,
          );
        }
      }

      // Validar cuenta de destino si se está actualizando
      if (updateTransactionDto.toAccountId !== undefined) {
        const toAccount = await this.prisma.account.findFirst({
          where: {
            id: updateTransactionDto.toAccountId,
            deletedAt: null,
          },
        });

        if (!toAccount) {
          throw new NotFoundException(
            `Cuenta de destino con ID ${updateTransactionDto.toAccountId} no encontrada`,
          );
        }
      }

      // Validar que al menos una cuenta no cambie si solo se actualiza una
      if (
        updateTransactionDto.fromAccountId !== undefined &&
        updateTransactionDto.toAccountId === undefined
      ) {
        const finalToAccountId = existingTransaction.toAccountId;
        if (updateTransactionDto.fromAccountId === finalToAccountId) {
          throw new BadRequestException(
            'La cuenta de origen y destino no pueden ser la misma',
          );
        }
      }

      if (
        updateTransactionDto.toAccountId !== undefined &&
        updateTransactionDto.fromAccountId === undefined
      ) {
        const finalFromAccountId = existingTransaction.fromAccountId;
        if (finalFromAccountId === updateTransactionDto.toAccountId) {
          throw new BadRequestException(
            'La cuenta de origen y destino no pueden ser la misma',
          );
        }
      }

      // Validar balance si se actualiza el monto o la cuenta de origen
      const finalFromAccountId =
        updateTransactionDto.fromAccountId !== undefined
          ? updateTransactionDto.fromAccountId
          : existingTransaction.fromAccountId;

      const finalAmount =
        updateTransactionDto.amount !== undefined
          ? updateTransactionDto.amount
          : Number(existingTransaction.amount);

      // Solo validar si cambió el monto o la cuenta de origen
      if (
        updateTransactionDto.amount !== undefined ||
        updateTransactionDto.fromAccountId !== undefined
      ) {
        const finalFromAccount = await this.prisma.account.findFirst({
          where: {
            id: finalFromAccountId,
            deletedAt: null,
          },
        });

        if (
          finalFromAccount &&
          finalFromAccount.type !== AccountType.CREDIT_CARD
        ) {
          const currentBalance =
            await this.accountsService.calculateBalance(finalFromAccountId);

          // Si se está actualizando, necesitamos restar el monto original y sumar el nuevo
          // Pero si cambió la cuenta, solo validamos con el nuevo monto
          let balanceToCheck = currentBalance;
          if (
            updateTransactionDto.fromAccountId === undefined &&
            updateTransactionDto.amount !== undefined
          ) {
            // Misma cuenta, diferente monto: restar el monto original y sumar el nuevo
            balanceToCheck =
              currentBalance - Number(existingTransaction.amount) + finalAmount;
          } else {
            // Nueva cuenta o cambio combinado: validar con el nuevo monto
            balanceToCheck = currentBalance;
          }

          if (balanceToCheck < finalAmount) {
            throw new BadRequestException(
              `Saldo insuficiente. La cuenta "${finalFromAccount.name}" tiene un balance de $${currentBalance.toFixed(2)} y se intenta transferir $${finalAmount.toFixed(2)}`,
            );
          }
        }
      }

      return await this.prisma.transaction.update({
        where: { id },
        data: {
          ...(updateTransactionDto.fromAccountId !== undefined && {
            fromAccountId: updateTransactionDto.fromAccountId,
          }),
          ...(updateTransactionDto.toAccountId !== undefined && {
            toAccountId: updateTransactionDto.toAccountId,
          }),
          ...(updateTransactionDto.amount !== undefined && {
            amount: updateTransactionDto.amount,
          }),
          ...(updateTransactionDto.description !== undefined && {
            description: updateTransactionDto.description,
          }),
          ...(updateTransactionDto.date !== undefined && {
            date: new Date(updateTransactionDto.date),
          }),
        },
        include: {
          fromAccount: true,
          toAccount: true,
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar la transacción');
    }
  }

  async remove(id: number) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada`);
    }

    return await this.prisma.transaction.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
