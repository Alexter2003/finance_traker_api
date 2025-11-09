import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { IncomeQueryDto } from './dto/income-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class IncomesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createIncomeDto: CreateIncomeDto) {
    try {
      const account = await this.prisma.account.findFirst({
        where: {
          id: createIncomeDto.accountId,
          deletedAt: null,
        },
      });

      if (!account) {
        throw new NotFoundException(
          `Cuenta con ID ${createIncomeDto.accountId} no encontrada`,
        );
      }

      return await this.prisma.income.create({
        data: {
          amount: createIncomeDto.amount,
          accountId: createIncomeDto.accountId,
          frequency: createIncomeDto.frequency,
          description: createIncomeDto.description,
          date: new Date(createIncomeDto.date),
        },
        include: {
          account: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al crear el ingreso');
    }
  }

  async findAll(query: IncomeQueryDto) {
    const { accountId, startDate, endDate, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.IncomeWhereInput = {
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
      this.prisma.income.findMany({
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
      this.prisma.income.count({ where }),
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
    const income = await this.prisma.income.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        account: true,
      },
    });

    if (!income) {
      throw new NotFoundException(`Ingreso con ID ${id} no encontrado`);
    }

    return income;
  }

  async update(id: number, updateIncomeDto: UpdateIncomeDto) {
    try {
      const existingIncome = await this.prisma.income.findFirst({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!existingIncome) {
        throw new NotFoundException(`Ingreso con ID ${id} no encontrado`);
      }

      if (updateIncomeDto.accountId) {
        const account = await this.prisma.account.findFirst({
          where: {
            id: updateIncomeDto.accountId,
            deletedAt: null,
          },
        });

        if (!account) {
          throw new NotFoundException(
            `Cuenta con ID ${updateIncomeDto.accountId} no encontrada`,
          );
        }
      }

      return await this.prisma.income.update({
        where: { id },
        data: {
          ...(updateIncomeDto.amount !== undefined && {
            amount: updateIncomeDto.amount,
          }),
          ...(updateIncomeDto.accountId !== undefined && {
            accountId: updateIncomeDto.accountId,
          }),
          ...(updateIncomeDto.frequency !== undefined && {
            frequency: updateIncomeDto.frequency,
          }),
          ...(updateIncomeDto.description !== undefined && {
            description: updateIncomeDto.description,
          }),
          ...(updateIncomeDto.date !== undefined && {
            date: new Date(updateIncomeDto.date),
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
      throw new BadRequestException('Error al actualizar el ingreso');
    }
  }

  async remove(id: number) {
    const income = await this.prisma.income.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!income) {
      throw new NotFoundException(`Ingreso con ID ${id} no encontrado`);
    }

    return await this.prisma.income.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
