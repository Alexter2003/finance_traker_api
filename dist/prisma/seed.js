"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Iniciando seed...');
    const existingFixed = await prisma.expenseType.findFirst({
        where: { type: client_1.ExpenseCategoryType.FIXED },
    });
    const existingVariable = await prisma.expenseType.findFirst({
        where: { type: client_1.ExpenseCategoryType.VARIABLE },
    });
    if (!existingFixed) {
        const fixedExpenseType = await prisma.expenseType.create({
            data: {
                name: 'Gastos Fijos',
                type: client_1.ExpenseCategoryType.FIXED,
                description: 'Categoría para gastos fijos que requieren presupuesto',
            },
        });
        console.log(`✅ Creado: ${fixedExpenseType.name} (${fixedExpenseType.type}) - ID: ${fixedExpenseType.id}`);
    }
    else {
        console.log(`ℹ️  Ya existe: ${existingFixed.name} (${existingFixed.type}) - ID: ${existingFixed.id}`);
    }
    if (!existingVariable) {
        const variableExpenseType = await prisma.expenseType.create({
            data: {
                name: 'Gastos Variables',
                type: client_1.ExpenseCategoryType.VARIABLE,
                description: 'Categoría para gastos variables sin presupuesto fijo',
            },
        });
        console.log(`✅ Creado: ${variableExpenseType.name} (${variableExpenseType.type}) - ID: ${variableExpenseType.id}`);
    }
    else {
        console.log(`ℹ️  Ya existe: ${existingVariable.name} (${existingVariable.type}) - ID: ${existingVariable.id}`);
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
//# sourceMappingURL=seed.js.map