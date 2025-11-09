# Backend - Finance Tracker API

## 📋 Descripción

API REST desarrollada con NestJS para la gestión de finanzas personales. Proporciona endpoints para gestionar cuentas, ingresos, egresos, gastos fijos/variables, tarjetas de crédito y transacciones.

## 🛠️ Stack Tecnológico

- **Framework:** NestJS
- **Runtime:** Node.js v22
- **ORM:** Prisma
- **Base de Datos:** PostgreSQL
- **Validación:** class-validator + class-transformer
- **Documentación API:** Swagger/OpenAPI (@nestjs/swagger)
- **Gestión de Variables:** @nestjs/config

## 📁 Estructura del Proyecto

```text
Backend/
├── src/
│   ├── main.ts                    # Punto de entrada de la aplicación
│   ├── app.module.ts              # Módulo raíz
│   ├── prisma/
│   │   └── prisma.service.ts      # Servicio de Prisma
│   ├── common/
│   │   ├── decorators/            # Decoradores personalizados
│   │   ├── filters/               # Filtros de excepciones
│   │   ├── guards/                # Guards (preparado para auth futura)
│   │   ├── interceptors/          # Interceptores
│   │   └── pipes/                 # Pipes de validación
│   ├── accounts/                  # Módulo de Cuentas
│   │   ├── accounts.module.ts
│   │   ├── accounts.controller.ts
│   │   ├── accounts.service.ts
│   │   └── dto/                   # Data Transfer Objects
│   ├── transactions/              # Módulo de Transacciones
│   │   ├── transactions.module.ts
│   │   ├── transactions.controller.ts
│   │   ├── transactions.service.ts
│   │   └── dto/
│   ├── incomes/                   # Módulo de Ingresos
│   │   ├── incomes.module.ts
│   │   ├── incomes.controller.ts
│   │   ├── incomes.service.ts
│   │   └── dto/
│   ├── expenses/                  # Módulo de Egresos
│   │   ├── expenses.module.ts
│   │   ├── expenses.controller.ts
│   │   ├── expenses.service.ts
│   │   └── dto/
│   ├── expense-types/             # Módulo de Tipos de Gastos (Fijos y Variables)
│   │   ├── expense-types.module.ts
│   │   ├── expense-types.controller.ts
│   │   ├── expense-types.service.ts
│   │   └── dto/
│   ├── credit-cards/              # Módulo de Tarjetas de Crédito
│   │   ├── credit-cards.module.ts
│   │   ├── credit-cards.controller.ts
│   │   ├── credit-cards.service.ts
│   │   └── dto/
│   └── budgets/                   # Módulo de Presupuestos
│       ├── budgets.module.ts
│       ├── budgets.controller.ts
│       ├── budgets.service.ts
│       └── dto/
├── prisma/
│   ├── schema.prisma              # Esquema de Prisma
│   └── migrations/                # Migraciones de base de datos
├── .env                           # Variables de entorno (no versionar)
├── .env.example                   # Ejemplo de variables de entorno
├── nest-cli.json                  # Configuración de NestJS CLI
├── package.json                   # Dependencias y scripts
├── tsconfig.json                  # Configuración de TypeScript
└── README.md                      # Este archivo
```

## 🗄️ Base de Datos

### Prisma Schema

El esquema de Prisma define las siguientes entidades principales:

- **Account:** Tipos de cuentas (efectivo, bancarias, tarjetas de crédito, etc.)
- **Transaction:** Transacciones entre cuentas
- **Income:** Registro de ingresos
- **Expense:** Registro de egresos
- **ExpenseType:** Categorías de gastos (fijos o variables)
- **Budget:** Presupuestos quincenales asignados a gastos fijos
- **AccountAdjustment:** Ajustes manuales de balance en cuentas

### Configuración de Prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/finance_tracker?schema=public"

# Aplicación
PORT=3000
NODE_ENV=development

# CORS (para desarrollo)
FRONTEND_URL=http://localhost:5173
```

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar base de datos
npx prisma generate
npx prisma migrate dev

# Ejecutar en desarrollo
npm run start:dev
```

## 📦 Dependencias Principales

### Producción

- `@nestjs/core` - Framework NestJS
- `@nestjs/common` - Utilidades comunes
- `@nestjs/platform-express` - Adaptador Express
- `@nestjs/config` - Gestión de configuración
- `@nestjs/swagger` - Documentación Swagger
- `@prisma/client` - Cliente de Prisma
- `class-validator` - Validación de DTOs
- `class-transformer` - Transformación de objetos

### Desarrollo

- `@nestjs/cli` - CLI de NestJS
- `prisma` - ORM Prisma
- `typescript` - TypeScript
- `ts-node` - Ejecución de TypeScript

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Inicia servidor en modo desarrollo con hot-reload

# Producción
npm run build              # Compila el proyecto
npm run start:prod         # Inicia servidor en modo producción

# Base de datos
npm run prisma:generate    # Genera cliente de Prisma
npm run prisma:migrate     # Ejecuta migraciones
npm run prisma:studio      # Abre Prisma Studio
```

## 📡 Estructura de Módulos

Cada módulo sigue la arquitectura estándar de NestJS:

```text
module-name/
├── module-name.module.ts      # Definición del módulo
├── module-name.controller.ts  # Endpoints REST
├── module-name.service.ts     # Lógica de negocio
└── dto/
    ├── create-module-name.dto.ts
    ├── update-module-name.dto.ts
    └── module-name-query.dto.ts
```

### Ejemplo de Módulo

```typescript
// accounts.module.ts
@Module({
  controllers: [AccountsController],
  providers: [AccountsService, PrismaService],
  exports: [AccountsService],
})
export class AccountsModule {}
```

## 🔒 Validación

La validación se realiza mediante DTOs con `class-validator`:

```typescript
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsNumber()
  @Min(0)
  initialBalance: number;
}
```

## 📚 Documentación API

La documentación Swagger está disponible en:

```text
http://localhost:3000/api
```

Configuración en `main.ts`:

```typescript
const config = new DocumentBuilder()
  .setTitle('Finance Tracker API')
  .setDescription('API para gestión de finanzas personales')
  .setVersion('1.0')
  .build();
```

## 🏗️ Arquitectura

### Principios de Diseño

- **Modularidad:** Cada funcionalidad en su propio módulo
- **Separación de Responsabilidades:** Controller → Service → Prisma
- **DTOs:** Validación y transformación de datos
- **Dependency Injection:** Gestión de dependencias nativa de NestJS

### Flujo de Request

```text
Request → Controller → DTO Validation → Service → Prisma → Database
                                ↓
                         Exception Filter
                                ↓
                         Response
```

## 🔮 Escalabilidad Futura

Aunque actualmente es una aplicación single-user, la arquitectura está preparada para:

- **Autenticación:** Guards y decoradores preparados en `common/guards/`
- **Multi-usuario:** Esquema de base de datos extensible con relaciones de usuario
- **Módulos adicionales:** Estructura modular facilita agregar nuevas funcionalidades

## 📝 Convenciones de Código

- **Nombres:** camelCase para variables y métodos, PascalCase para clases
- **Archivos:** kebab-case para nombres de archivos
- **DTOs:** Prefijo de acción (Create, Update, Query)
- **Services:** Contienen toda la lógica de negocio
- **Controllers:** Solo manejan HTTP requests/responses

## 🐛 Debugging

Para debugging en desarrollo:

```bash
npm run start:debug
```

Configurar breakpoints en VS Code con la configuración de launch.json apropiada.

## 📋 Reglas de Negocio

### Cuentas (Account)

- Las cuentas tienen nombre, tipo y balance inicial
- El balance se calcula dinámicamente: `initialBalance + sum(Income) - sum(Expense) + sum(Transaction recibidas) - sum(Transaction enviadas) + sum(AccountAdjustment)`
- Las tarjetas de crédito se manejan como Account con `type=CREDIT_CARD`
- Las tarjetas de crédito permiten saldo negativo (indica deuda pendiente)
- Al pagar un gasto con tarjeta de crédito, se reduce el saldo disponible de la cuenta normal y aumenta la deuda de la tarjeta (saldo negativo)

### Ingresos (Income)

- Los ingresos siempre se registran manualmente
- Pueden ser recurrentes (mensual o quincenal) pero el registro es manual cada vez
- Los ingresos recurrentes son solo plantillas que ayudan al usuario a recordar registrarlos
- Cada ingreso se asocia a una cuenta específica

### Egresos (Expense)

- Un Expense debe tener asociado un `expenseTypeId` (obligatorio)
- El ExpenseType indica si es FIXED o VARIABLE mediante el campo `type`
- Los gastos afectan directamente al balance de la cuenta asociada
- Los gastos pueden pagarse con tarjeta de crédito (cuenta tipo CREDIT_CARD)
- Al pagar un gasto fijo con tarjeta, se reduce el monto pendiente del presupuesto pero aumenta la deuda de la tarjeta

### Transacciones (Transaction)

- Son movimientos de dinero entre cuentas únicamente
- No tienen categorías asociadas
- Afectan el balance de ambas cuentas (resta de origen, suma a destino)

### Tipos de Gastos (ExpenseType)

- Un solo modelo que representa categorías de gastos (fijos o variables)
- El campo `type` indica si es `FIXED` o `VARIABLE`
- Los tipos de gastos fijos pueden tener presupuestos asignados
- Los tipos de gastos variables no tienen presupuestos
- Se tratan de manera diferente en ciertos procesos según su tipo

### Presupuestos (Budget)

- Los presupuestos son **quincenales** únicamente
- Se asignan solo a tipos de gastos fijos (ExpenseType con type=FIXED)
- Cada presupuesto tiene:
  - `monthlyAmount`: Monto mensual total definido por el usuario
  - `biweeklyAmount`: Monto quincenal (el usuario puede definir manualmente, pero el sistema sugiere `monthlyAmount / 2`)
  - `pendingAmount`: Saldo pendiente del período anterior que se transfiere automáticamente
- Solo existe un presupuesto activo por ExpenseType (tipo FIXED) por quincena
- El sistema calcula la quincena según las fechas (`startDate` y `endDate`)
- Cuando termina una quincena, el sistema sugiere crear el siguiente presupuesto
- El `pendingAmount` del presupuesto anterior se suma automáticamente al nuevo presupuesto
- Se mantienen todos los presupuestos históricos para consulta
- Si un gasto fijo mensual es de $600, típicamente se divide en $300 por cada quincena
- El saldo pendiente permite manejar gastos que se comparten entre quincenas

### Ajustes de Cuenta (AccountAdjustment)

- Permiten ajustar manualmente el balance de una cuenta
- El `amount` puede ser positivo (aumentar) o negativo (disminuir)
- Se requiere una razón (`reason`) para cada ajuste
- Útiles para corregir diferencias con el dinero real disponible

### Cálculo de Dinero Disponible

El dinero disponible para gastar se calcula considerando:

- Balance total de todas las cuentas (excepto tarjetas de crédito)
- Menos los presupuestos asignados a gastos fijos
- Menos la deuda pendiente de tarjetas de crédito (saldo negativo)

Esto asegura que no se gaste dinero que debe pagarse de las tarjetas de crédito.

## 📋 Checklist de Desarrollo

- [ ] Variables de entorno configuradas
- [ ] Base de datos PostgreSQL corriendo
- [ ] Migraciones de Prisma ejecutadas
- [ ] Cliente de Prisma generado
- [ ] Swagger documentación accesible
- [ ] Validación de DTOs funcionando
- [ ] CORS configurado para frontend
