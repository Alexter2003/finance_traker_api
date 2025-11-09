/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PrismaClient, ExpenseCategoryType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Verificar si ya existen los tipos de gastos
  const existingFixed = await prisma.expenseType.findFirst({
    where: { type: ExpenseCategoryType.FIXED },
  });

  const existingVariable = await prisma.expenseType.findFirst({
    where: { type: ExpenseCategoryType.VARIABLE },
  });

  // Crear tipos de gastos iniciales solo si no existen
  if (!existingFixed) {
    const fixedExpenseType = await prisma.expenseType.create({
      data: {
        name: 'Gastos Fijos',
        type: ExpenseCategoryType.FIXED,
        description: 'Categoría para gastos fijos que requieren presupuesto',
      },
    });
    console.log(
      `✅ Creado: ${fixedExpenseType.name} (${fixedExpenseType.type}) - ID: ${fixedExpenseType.id}`,
    );
  } else {
    console.log(
      `ℹ️  Ya existe: ${existingFixed.name} (${existingFixed.type}) - ID: ${existingFixed.id}`,
    );
  }

  if (!existingVariable) {
    const variableExpenseType = await prisma.expenseType.create({
      data: {
        name: 'Gastos Variables',
        type: ExpenseCategoryType.VARIABLE,
        description: 'Categoría para gastos variables sin presupuesto fijo',
      },
    });
    console.log(
      `✅ Creado: ${variableExpenseType.name} (${variableExpenseType.type}) - ID: ${variableExpenseType.id}`,
    );
  } else {
    console.log(
      `ℹ️  Ya existe: ${existingVariable.name} (${existingVariable.type}) - ID: ${existingVariable.id}`,
    );
  }

  console.log('✨ Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
