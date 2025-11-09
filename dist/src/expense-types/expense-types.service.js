"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseTypesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExpenseTypesService = class ExpenseTypesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createExpenseTypeDto) {
        const existingExpenseType = await this.prisma.expenseType.findFirst({
            where: {
                name: createExpenseTypeDto.name,
                deletedAt: null,
            },
        });
        if (existingExpenseType) {
            throw new common_1.ConflictException(`Ya existe un tipo de gasto con el nombre "${createExpenseTypeDto.name}"`);
        }
        return this.prisma.expenseType.create({
            data: createExpenseTypeDto,
        });
    }
    async findAll(queryDto) {
        const { type, search, page = 1, limit = 10 } = queryDto;
        const skip = (page - 1) * limit;
        const where = {
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
    async findOne(id) {
        const expenseType = await this.prisma.expenseType.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!expenseType) {
            throw new common_1.NotFoundException(`Tipo de gasto con ID ${id} no encontrado`);
        }
        return expenseType;
    }
    async update(id, updateExpenseTypeDto) {
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
                throw new common_1.ConflictException(`Ya existe un tipo de gasto con el nombre "${updateExpenseTypeDto.name}"`);
            }
        }
        return this.prisma.expenseType.update({
            where: { id },
            data: updateExpenseTypeDto,
        });
    }
    async remove(id) {
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
            throw new common_1.BadRequestException('No se puede eliminar un tipo de gasto que tiene gastos o presupuestos asociados');
        }
        return this.prisma.expenseType.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
};
exports.ExpenseTypesService = ExpenseTypesService;
exports.ExpenseTypesService = ExpenseTypesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpenseTypesService);
//# sourceMappingURL=expense-types.service.js.map