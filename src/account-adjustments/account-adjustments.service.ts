import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountAdjustmentDto } from './dto/create-account-adjustment.dto';
import { UpdateAccountAdjustmentDto } from './dto/update-account-adjustment.dto';
import { QueryAccountAdjustmentDto } from './dto/query-account-adjustment.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AccountAdjustmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAccountAdjustmentDto: CreateAccountAdjustmentDto) {
    try {
      // Verificar que la cuenta existe y no está eliminada
      const account = await this.prisma.account.findFirst({
        where: {
          id: createAccountAdjustmentDto.accountId,
          deletedAt: null,
        },
      });

      if (!account) {
        throw new NotFoundException(
          `Cuenta con ID ${createAccountAdjustmentDto.accountId} no encontrada`,
        );
      }

      return await this.prisma.accountAdjustment.create({
        data: {
          accountId: createAccountAdjustmentDto.accountId,
          amount: createAccountAdjustmentDto.amount,
          reason: createAccountAdjustmentDto.reason,
          date: new Date(createAccountAdjustmentDto.date),
        },
        include: {
          account: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al crear el ajuste de cuenta');
    }
  }

  async findAll(query: QueryAccountAdjustmentDto) {
    const {
      accountId,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.AccountAdjustmentWhereInput = {
      deletedAt: null,
      ...(accountId && { accountId }),
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
      this.prisma.accountAdjustment.findMany({
        where,
        skip,
        take: limit,
        include: {
          account: true,
        },
        orderBy: {
          date: 'desc',
        },
      }),
      this.prisma.accountAdjustment.count({ where }),
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
    const adjustment = await this.prisma.accountAdjustment.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        account: true,
      },
    });

    if (!adjustment) {
      throw new NotFoundException(
        `Ajuste de cuenta con ID ${id} no encontrado`,
      );
    }

    return adjustment;
  }

  async update(
    id: number,
    updateAccountAdjustmentDto: UpdateAccountAdjustmentDto,
  ) {
    // Verificar que el ajuste existe
    const existingAdjustment = await this.findOne(id);

    // Si se actualiza el accountId, verificar que la nueva cuenta existe
    if (updateAccountAdjustmentDto.accountId) {
      const account = await this.prisma.account.findFirst({
        where: {
          id: updateAccountAdjustmentDto.accountId,
          deletedAt: null,
        },
      });

      if (!account) {
        throw new NotFoundException(
          `Cuenta con ID ${updateAccountAdjustmentDto.accountId} no encontrada`,
        );
      }
    }

    try {
      return await this.prisma.accountAdjustment.update({
        where: { id },
        data: {
          ...(updateAccountAdjustmentDto.accountId && {
            accountId: updateAccountAdjustmentDto.accountId,
          }),
          ...(updateAccountAdjustmentDto.amount !== undefined && {
            amount: updateAccountAdjustmentDto.amount,
          }),
          ...(updateAccountAdjustmentDto.reason && {
            reason: updateAccountAdjustmentDto.reason,
          }),
          ...(updateAccountAdjustmentDto.date && {
            date: new Date(updateAccountAdjustmentDto.date),
          }),
        },
        include: {
          account: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar el ajuste de cuenta');
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.prisma.accountAdjustment.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

