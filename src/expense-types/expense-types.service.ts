import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseTypeDto } from './dto/create-expense-type.dto';
import { UpdateExpenseTypeDto } from './dto/update-expense-type.dto';
import { QueryExpenseTypeDto } from './dto/query-expense-type.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExpenseTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createExpenseTypeDto: CreateExpenseTypeDto) {
    const existingExpenseType = await this.prisma.expenseType.findFirst({
      where: {
        name: createExpenseTypeDto.name,
        deletedAt: null,
      },
    });

    if (existingExpenseType) {
      throw new ConflictException(
        `Ya existe un tipo de gasto con el nombre "${createExpenseTypeDto.name}"`,
      );
    }

    return this.prisma.expenseType.create({
      data: createExpenseTypeDto,
    });
  }

  async findAll(queryDto: QueryExpenseTypeDto) {
    const { type, search, page = 1, limit = 10 } = queryDto;
    const skip = (page - 1) * limit;

    const where: Prisma.ExpenseTypeWhereInput = {
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

    const [data, total] = await Promise.all([
      this.prisma.expenseType.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.expenseType.count({ where }),
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
    const expenseType = await this.prisma.expenseType.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!expenseType) {
      throw new NotFoundException(`Tipo de gasto con ID ${id} no encontrado`);
    }

    return expenseType;
  }

  async update(id: number, updateExpenseTypeDto: UpdateExpenseTypeDto) {
    await this.findOne(id);

    if (updateExpenseTypeDto.name) {
      const existingExpenseType = await this.prisma.expenseType.findFirst({
        where: {
          name: updateExpenseTypeDto.name,
          deletedAt: null,
          id: {
            not: id,
          },
        },
      });

      if (existingExpenseType) {
        throw new ConflictException(
          `Ya existe un tipo de gasto con el nombre "${updateExpenseTypeDto.name}"`,
        );
      }
    }

    return this.prisma.expenseType.update({
      where: { id },
      data: updateExpenseTypeDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const hasExpenses = await this.prisma.expense.count({
      where: {
        expenseTypeId: id,
        deletedAt: null,
      },
      take: 1,
    });

    const hasBudgets = await this.prisma.budget.count({
      where: {
        expenseTypeId: id,
        deletedAt: null,
      },
      take: 1,
    });

    if (hasExpenses || hasBudgets) {
      throw new BadRequestException(
        'No se puede eliminar un tipo de gasto que tiene gastos o presupuestos asociados',
      );
    }

    return this.prisma.expenseType.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
