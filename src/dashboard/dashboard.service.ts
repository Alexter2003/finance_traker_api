import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountsService } from '../accounts/accounts.service';
import { CreditCardsService } from '../credit-cards/credit-cards.service';
import { AccountType } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accountsService: AccountsService,
    private readonly creditCardsService: CreditCardsService,
  ) {}

  /**
   * Calcula el dinero disponible según la fórmula:
   * Dinero Disponible = Balance total de todas las cuentas (excepto tarjetas de crédito)
   *                   - Presupuestos asignados a gastos fijos
   *                   - Deuda pendiente de tarjetas de crédito
   */
  async getDashboard() {
    // 1. Obtener todas las cuentas excepto tarjetas de crédito
    const accounts = await this.prisma.account.findMany({
      where: {
        type: {
          not: AccountType.CREDIT_CARD,
        },
        deletedAt: null,
      },
    });

    // 2. Calcular el balance total de todas las cuentas (excepto tarjetas de crédito)
    let totalBalance = 0;
    const accountsSummary = await Promise.all(
      accounts.map(async (account) => {
        const balance = await this.accountsService.calculateBalance(account.id);
        totalBalance += balance;
        return {
          id: account.id,
          name: account.name,
          type: account.type,
          balance: Number(balance),
        };
      }),
    );

    // 3. Obtener presupuestos activos asignados a gastos fijos
    const activeBudgets = await this.prisma.budget.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      include: {
        expenseType: true,
      },
    });

    // Sumar los montos quincenales de los presupuestos activos
    let totalBudgetsAmount = 0;
    const budgetsSummary = activeBudgets.map((budget) => {
      const biweeklyAmount = Number(budget.biweeklyAmount);
      totalBudgetsAmount += biweeklyAmount;
      return {
        id: budget.id,
        expenseTypeName: budget.expenseType.name,
        biweeklyAmount,
        startDate: budget.startDate,
        endDate: budget.endDate,
      };
    });

    // 4. Obtener todas las tarjetas de crédito y calcular su deuda total
    const creditCards = await this.prisma.account.findMany({
      where: {
        type: AccountType.CREDIT_CARD,
        deletedAt: null,
      },
    });

    let totalCreditCardDebt = 0;
    const creditCardsSummary = await Promise.all(
      creditCards.map(async (creditCard) => {
        const debt = await this.creditCardsService.getDebt(creditCard.id);
        totalCreditCardDebt += debt;
        return {
          id: creditCard.id,
          name: creditCard.name,
          debt: Number(debt),
        };
      }),
    );

    // 5. Calcular dinero disponible
    const availableMoney = totalBalance - totalBudgetsAmount - totalCreditCardDebt;

    return {
      availableMoney: Number(availableMoney.toFixed(2)),
      totalBalance: Number(totalBalance.toFixed(2)),
      totalBudgetsAmount: Number(totalBudgetsAmount.toFixed(2)),
      totalCreditCardDebt: Number(totalCreditCardDebt.toFixed(2)),
      accounts: accountsSummary,
      activeBudgets: budgetsSummary,
      creditCards: creditCardsSummary,
    };
  }
}

