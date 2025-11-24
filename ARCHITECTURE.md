# Arquitectura API Gateway - Restaurant API

## Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                   GraphQL API Gateway                        │
│              (NestJS + Apollo Server)                        │
│                    :3000                                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │  Auth Module     │         │ Restaurant Module │          │
│  │  ├─ Resolver     │         │  ├─ Resolver    │          │
│  │  └─ GraphQL      │         │  └─ GraphQL     │          │
│  └────────┬─────────┘         └────────┬─────────┘          │
│           │                            │                     │
│           │ gRPC (50051)               │ gRPC (50052)        │
│           ▼                            ▼                     │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │ Auth Service     │         │Restaurant Service│          │
│  │ (Microservicio)  │         │ (Microservicio)  │          │
│  │                  │         │                  │          │
│  │ - Register       │         │ - Menu CRUD      │          │
│  │ - Login          │         │ - Order CRUD     │          │
│  │ - User Profile   │         │                  │          │
│  │ - Reset Password │         │                  │          │
│  └────────┬─────────┘         └────────┬─────────┘          │
│           │                            │                     │
│           ▼                            ▼                     │
│   ┌──────────────┐            ┌──────────────┐              │
│   │   Database   │            │   Database   │              │
│   │  (Auth DB)   │            │  (Orders DB) │              │
│   └──────────────┘            └──────────────┘              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Módulos Implementados

### 1. AuthModule (src/auth/)
- **Archivo**: `auth.resolver.ts`
- **Servicios gRPC**: 
  - AuthService (registro, login, reset de contraseña)
  - UsersService (perfil, actualizar datos)

**Queries disponibles**:
- `myProfile` - Obtener perfil del usuario actual

**Mutations disponibles**:
- `register` - Registrar nuevo usuario
- `login` - Iniciar sesión
- `requestPasswordReset` - Solicitar reset de contraseña
- `resetPassword` - Completar reset de contraseña
- `updatePassword` - Actualizar contraseña
- `updateProfile` - Actualizar nombre de usuario
- `requestEmailUpdate` - Solicitar cambio de email
- `confirmEmailUpdate` - Confirmar cambio de email
- `requestUnlock` - Solicitar desbloqueo de cuenta
- `unlockAccount` - Desbloquear cuenta

### 2. RestaurantModule (src/restaurant/)
- **Archivo**: `restaurant.resolver.ts`
- **Servicios gRPC**:
  - MenuService (CRUD de items del menú)
  - OrderService (CRUD de órdenes)

**Queries disponibles**:
- `menu` - Obtener todos los items del menú
- `orders` - Obtener todas las órdenes

**Mutations disponibles**:
- `createMenuItem` - Crear nuevo item en el menú
- `updateMenuItem` - Actualizar item del menú
- `deleteMenuItem` - Eliminar item del menú
- `createOrder` - Crear nueva orden
- `updateOrderStatus` - Actualizar estado de orden
- `deleteOrder` - Eliminar orden

## Tipos GraphQL Definidos

### Tipos de Usuario
```graphql
type User {
  id: Int!
  name: String!
  email: String!
  isLocked: Boolean!
  isEmailConfirmed: Boolean!
  createdAt: String!
  oldEmail: String
  newEmail: String
  emailChangedAt: String
}
```

### Tipos de Restaurante
```graphql
type MenuItem {
  id: String!
  name: String!
  description: String!
  price: Float!
  category: String!
}

type OrderItem {
  menuItemId: String!
  name: String!
  quantity: Int!
  price: Float!
}

type Order {
  id: String!
  items: [OrderItem!]!
  total: Float!
  status: String!
  createdAt: Int!
}
```

## Flujo de Comunicación

### Crear una Orden
1. Cliente envía GraphQL `mutation createOrder`
2. RestaurantResolver recibe la petición
3. Transforma los datos al formato gRPC esperado
4. Llama a OrderService.createOrder() mediante gRPC
5. OrderService procesa la orden
6. RestaurantResolver transforma la respuesta
7. GraphQL devuelve la respuesta al cliente

### Obtener Menú
1. Cliente envía GraphQL `query menu`
2. RestaurantResolver recibe la petición
3. Llama a MenuService.listMenu() mediante gRPC
4. MenuService devuelve items del menú
5. RestaurantResolver devuelve items formateados
6. GraphQL devuelve la respuesta al cliente

## Configuración de Inyección de Dependencias

### AuthModule
```typescript
import { RESTAURANT_SERVICE_NAME } from './restaurant.module';

constructor(@Inject(RESTAURANT_SERVICE_NAME) private client: ClientGrpc) {}
```

### RestaurantModule
```typescript
@Module({
  imports: [
    ClientsModule.register([
      {
        name: RESTAURANT_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: RESTAURANT_PACKAGE_NAME,
          protoPath: join(__dirname, '../../proto/service.proto'),
          url: process.env.RESTAURANT_SERVICE_URL || 'localhost:50052',
        },
      },
    ]),
  ],
  providers: [RestaurantResolver],
  exports: [ClientsModule],
})
```

## Mapeo de Tipos Proto a GraphQL

### Proto Protobuf (service.proto)
```protobuf
message MenuItem {
  string id = 1;
  string name = 2;
  string description = 3;
  double price = 4;
  string category = 5;
}
```

### GraphQL Schema
```graphql
type MenuItem {
  id: String!
  name: String!
  description: String!
  price: Float!
  category: String!
}
```

### Conversión en Resolver
```typescript
// Proto -> GraphQL
const menuItem: MenuItem = {
  id: protoItem.id,
  name: protoItem.name,
  description: protoItem.description,
  price: protoItem.price,
  category: protoItem.category,
};
```

## Variables de Entorno Necesarias

```bash
# .env
RESTAURANT_SERVICE_URL=localhost:50052
AUTH_SERVICE_URL=localhost:50051
PORT=3000
NODE_ENV=development
```

## Estructura de Archivos

```
src/
├── auth/
│   ├── auth.module.ts          # Módulo de autenticación
│   └── auth.resolver.ts        # Resolver de autenticación
├── restaurant/
│   ├── restaurant.module.ts    # Módulo de restaurante
│   └── restaurant.resolver.ts  # Resolver de restaurante (NUEVO)
├── graphql/
│   └── schema.gql              # Esquema GraphQL (ACTUALIZADO)
├── app.module.ts               # Módulo principal
├── main.ts                     # Punto de entrada
└── ...
proto/
├── auth.proto                  # Proto de autenticación
├── users.proto                 # Proto de usuarios
└── service.proto               # Proto de menú y órdenes
```

## Próximos Pasos (Opcional)

1. **Agregar Guards de Autenticación**: Usar `@UseGuards()` para proteger mutations
2. **Agregar Validación**: Usar `@IsEmail()`, `@Min()`, etc.
3. **Agregar Paginación**: Para queries `menu` y `orders`
4. **Agregar Filtros**: Por categoría, estado, etc.
5. **Agregar Subscriptions**: Para actualizaciones en tiempo real
6. **Tests E2E**: Crear tests en `test/restaurant.e2e-spec.ts`
7. **Documentación OpenAPI**: Generar docs automáticas
