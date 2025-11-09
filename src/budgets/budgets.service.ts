import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { QueryBudgetDto } from './dto/query-budget.dto';
import { Prisma } from '@prisma/client';
import { ExpenseCategoryType } from '@prisma/client';

@Injectable()
export class BudgetsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Verifica si hay un presupuesto activo para el mismo ExpenseType en el mismo rango de fechas
   */
  private async hasActiveBudgetInPeriod(
    expenseTypeId: number,
    startDate: Date,
    endDate: Date,
    excludeId?: number,
  ): Promise<boolean> {
    const existingBudget = await this.prisma.budget.findFirst({
      where: {
        expenseTypeId,
        isActive: true,
        deletedAt: null,
        id: excludeId ? { not: excludeId } : undefined,
        OR: [
          // El nuevo presupuesto se solapa con uno existente
          {
            AND: [
              { startDate: { lte: endDate } },
              { endDate: { gte: startDate } },
            ],
          },
        ],
      },
    });

    return !!existingBudget;
  }

  /**
   * Calcula el gasto total para un presupuesto en su período
   */
  async calculateSpentAmount(budgetId: number): Promise<number> {
    const budget = await this.prisma.budget.findUnique({
      where: { id: budgetId },
      select: {
        expenseTypeId: true,
        startDate: true,
        endDate: true,
      },
    });

    if (!budget) {
      return 0;
    }

    const expensesSum = await this.prisma.expense.aggregate({
      where: {
        expenseTypeId: budget.expenseTypeId,
        deletedAt: null,
        date: {
          gte: budget.startDate,
          lte: budget.endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return Number(expensesSum._sum.amount || 0);
  }

  /**
   * Obtiene el presupuesto activo anterior para calcular el pendingAmount
   */
  private async getPreviousActiveBudget(
    expenseTypeId: number,
    startDate: Date,
  ): Promise<{ pendingAmount: number } | null> {
    const previousBudget = await this.prisma.budget.findFirst({
      where: {
        expenseTypeId,
        isActive: true,
        deletedAt: null,
        endDate: { lt: startDate },
      },
      orderBy: {
        endDate: 'desc',
      },
      select: {
        id: true,
        biweeklyAmount: true,
        pendingAmount: true,
      },
    });

    if (!previousBudget) {
      return null;
    }

    // Calcular el gasto del presupuesto anterior
    const spentAmount = await this.calculateSpentAmount(previousBudget.id);
    const totalAvailable =
      Number(previousBudget.biweeklyAmount) +
      Number(previousBudget.pendingAmount);
    const remainingAmount = totalAvailable - spentAmount;

    return {
      pendingAmount: Math.max(0, remainingAmount),
    };
  }

  async create(createBudgetDto: CreateBudgetDto) {
    // Validar que el ExpenseType existe y es de tipo FIXED
    const expenseType = await this.prisma.expenseType.findFirst({
      where: {
        id: createBudgetDto.expenseTypeId,
        deletedAt: null,
      },
    });

    if (!expenseType) {
      throw new NotFoundException(
        `Tipo de gasto con ID ${createBudgetDto.expenseTypeId} no encontrado`,
      );
    }

    if (expenseType.type !== ExpenseCategoryType.FIXED) {
      throw new BadRequestException(
        'Los presupuestos solo pueden asignarse a tipos de gastos fijos (FIXED)',
      );
    }

    const startDate = new Date(createBudgetDto.startDate);
    const endDate = new Date(createBudgetDto.endDate);

    // Validar que endDate sea mayor que startDate
    if (endDate <= startDate) {
      throw new BadRequestException(
        'La fecha de fin debe ser posterior a la fecha de inicio',
      );
    }

    // Validar que no haya otro presupuesto activo en el mismo período
    const hasActive = await this.hasActiveBudgetInPeriod(
      createBudgetDto.expenseTypeId,
      startDate,
      endDate,
    );

    if (hasActive) {
      throw new ConflictException(
        'Ya existe un presupuesto activo para este tipo de gasto en el período especificado',
      );
    }

    // Calcular biweeklyAmount si no se proporciona
    const biweeklyAmount =
      createBudgetDto.biweeklyAmount ??
      createBudgetDto.monthlyAmount / 2;

    // Obtener el pendingAmount del presupuesto anterior si existe
    let pendingAmount = createBudgetDto.pendingAmount ?? 0;
    if (pendingAmount === 0) {
      const previousBudget = await this.getPreviousActiveBudget(
        createBudgetDto.expenseTypeId,
        startDate,
      );
      if (previousBudget) {
        pendingAmount = previousBudget.pendingAmount;
      }
    }

    // Desactivar presupuestos anteriores activos del mismo ExpenseType
    await this.prisma.budget.updateMany({
      where: {
        expenseTypeId: createBudgetDto.expenseTypeId,
        isActive: true,
        deletedAt: null,
      },
      data: {
        isActive: false,
      },
    });

    // Crear el nuevo presupuesto
    const budget = await this.prisma.budget.create({
      data: {
        expenseTypeId: createBudgetDto.expenseTypeId,
        monthlyAmount: createBudgetDto.monthlyAmount,
        biweeklyAmount,
        pendingAmount,
        startDate,
        endDate,
        isActive: true,
      },
      include: {
        expenseType: true,
      },
    });

    // Calcular el gasto total del presupuesto
    const spentAmount = await this.calculateSpentAmount(budget.id);
    const totalAvailable =
      Number(budget.biweeklyAmount) + Number(budget.pendingAmount);
    const availableAmount = totalAvailable - spentAmount;

    return {
      ...budget,
      spentAmount,
      totalAvailable,
      availableAmount,
    };
  }

  async findAll(queryDto: QueryBudgetDto) {
    const { expenseTypeId, isActive, page = 1, limit = 10 } = queryDto;
    const skip = (page - 1) * limit;

    const where: Prisma.BudgetWhereInput = {
      deletedAt: null,
    };

    if (expenseTypeId) {
      where.expenseTypeId = expenseTypeId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [budgets, total] = await Promise.all([
      this.prisma.budget.findMany({
        where,
        skip,
        take: limit,
        include: {
          expenseType: true,
        },
        orderBy: {
          startDate: 'desc',
        },
      }),
      this.prisma.budget.count({ where }),
    ]);

    // Calcular el gasto y monto disponible para cada presupuesto
    const data = await Promise.all(
      budgets.map(async (budget) => {
        const spentAmount = await this.calculateSpentAmount(budget.id);
        const totalAvailable =
          Number(budget.biweeklyAmount) + Number(budget.pendingAmount);
        const availableAmount = totalAvailable - spentAmount;

        return {
          ...budget,
          spentAmount,
          totalAvailable,
          availableAmount,
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
    const budget = await this.prisma.budget.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        expenseType: true,
      },
    });

    if (!budget) {
      throw new NotFoundException(`Presupuesto con ID ${id} no encontrado`);
    }

    // Calcular el gasto y monto disponible
    const spentAmount = await this.calculateSpentAmount(id);
    const totalAvailable =
      Number(budget.biweeklyAmount) + Number(budget.pendingAmount);
    const availableAmount = totalAvailable - spentAmount;

    return {
      ...budget,
      spentAmount,
      totalAvailable,
      availableAmount,
    };
  }

  async update(id: number, updateBudgetDto: UpdateBudgetDto) {
    const existingBudget = await this.prisma.budget.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingBudget) {
      throw new NotFoundException(`Presupuesto con ID ${id} no encontrado`);
    }

    // Validar fechas si se están actualizando
    if (updateBudgetDto.startDate || updateBudgetDto.endDate) {
      const startDate = updateBudgetDto.startDate
        ? new Date(updateBudgetDto.startDate)
        : existingBudget.startDate;
      const endDate = updateBudgetDto.endDate
        ? new Date(updateBudgetDto.endDate)
        : existingBudget.endDate;

      if (endDate <= startDate) {
        throw new BadRequestException(
          'La fecha de fin debe ser posterior a la fecha de inicio',
        );
      }

      // Si se está activando o el presupuesto ya está activo, validar conflictos
      if (
        updateBudgetDto.isActive !== false &&
        (existingBudget.isActive || updateBudgetDto.isActive === true)
      ) {
        const hasActive = await this.hasActiveBudgetInPeriod(
          existingBudget.expenseTypeId,
          startDate,
          endDate,
          id,
        );

        if (hasActive) {
          throw new ConflictException(
            'Ya existe otro presupuesto activo para este tipo de gasto en el período especificado',
          );
        }
      }
    }

    // Calcular biweeklyAmount si se actualiza monthlyAmount pero no biweeklyAmount
    let biweeklyAmount = updateBudgetDto.biweeklyAmount;
    if (
      updateBudgetDto.monthlyAmount !== undefined &&
      updateBudgetDto.biweeklyAmount === undefined
    ) {
      biweeklyAmount = updateBudgetDto.monthlyAmount / 2;
    }

    const updateData: Prisma.BudgetUpdateInput = {
      ...(updateBudgetDto.monthlyAmount !== undefined && {
        monthlyAmount: updateBudgetDto.monthlyAmount,
      }),
      ...(biweeklyAmount !== undefined && {
        biweeklyAmount,
      }),
      ...(updateBudgetDto.pendingAmount !== undefined && {
        pendingAmount: updateBudgetDto.pendingAmount,
      }),
      ...(updateBudgetDto.startDate !== undefined && {
        startDate: new Date(updateBudgetDto.startDate),
      }),
      ...(updateBudgetDto.endDate !== undefined && {
        endDate: new Date(updateBudgetDto.endDate),
      }),
      ...(updateBudgetDto.isActive !== undefined && {
        isActive: updateBudgetDto.isActive,
      }),
    };

    const budget = await this.prisma.budget.update({
      where: { id },
      data: updateData,
      include: {
        expenseType: true,
      },
    });

    // Calcular el gasto y monto disponible
    const spentAmount = await this.calculateSpentAmount(id);
    const totalAvailable =
      Number(budget.biweeklyAmount) + Number(budget.pendingAmount);
    const availableAmount = totalAvailable - spentAmount;

    return {
      ...budget,
      spentAmount,
      totalAvailable,
      availableAmount,
    };
  }

  async remove(id: number) {
    const budget = await this.prisma.budget.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!budget) {
      throw new NotFoundException(`Presupuesto con ID ${id} no encontrado`);
    }

    return this.prisma.budget.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false, // Desactivar al eliminar
      },
    });
  }
}
