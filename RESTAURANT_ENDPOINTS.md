# Restaurant API - GraphQL Endpoints Documentation

Este documento describe todos los endpoints GraphQL disponibles para el microservicio de restaurante.

## Variables de Entorno

```bash
# URL del microservicio de órdenes/restaurante (gRPC)
RESTAURANT_SERVICE_URL=localhost:50052

# URL del microservicio de autenticación (gRPC)
AUTH_SERVICE_URL=localhost:50051
```

## Menu Queries

### Obtener el menú completo

```graphql
query {
  menu {
    id
    name
    description
    price
    category
  }
}
```

## Menu Mutations

### Crear un item de menú

```graphql
mutation {
  createMenuItem(
    name: "Pasta Carbonara"
    description: "Delicious Italian pasta"
    price: 12.99
    category: "Pasta"
  ) {
    id
    item {
      id
      name
      description
      price
      category
    }
  }
}
```

### Actualizar un item de menú

```graphql
mutation {
  updateMenuItem(
    id: "507f1f77bcf86cd799439011"
    name: "New Pasta Name"
    price: 14.99
  ) {
    ok
  }
}
```

### Eliminar un item de menú

```graphql
mutation {
  deleteMenuItem(id: "507f1f77bcf86cd799439011") {
    ok
  }
}
```

## Order Queries

### Obtener todas las órdenes

```graphql
query {
  orders {
    id
    items {
      menuItemId
      name
      quantity
      price
    }
    total
    status
    createdAt
  }
}
```

## Order Mutations

### Crear una nueva orden

```graphql
mutation {
  createOrder(items: [
    {
      menuItemId: "507f1f77bcf86cd799439011"
      name: "Pasta Carbonara"
      quantity: 2
      price: 12.99
    },
    {
      menuItemId: "507f1f77bcf86cd799439012"
      name: "Caesar Salad"
      quantity: 1
      price: 8.99
    }
  ]) {
    id
    order {
      id
      items {
        menuItemId
        name
        quantity
        price
      }
      total
      status
      createdAt
    }
  }
}
```

### Actualizar el estado de una orden

```graphql
mutation {
  updateOrderStatus(
    id: "507f1f77bcf86cd799439011"
    status: "preparing"
  ) {
    ok
  }
}
```

Estados posibles de una orden:
- `pending` - Pendiente de preparación
- `preparing` - En preparación
- `ready` - Listo para servir
- `completed` - Completado
- `cancelled` - Cancelado

### Eliminar una orden

```graphql
mutation {
  deleteOrder(id: "507f1f77bcf86cd799439011") {
    ok
  }
}
```

## Authentication (Auth Module)

### Registrarse

```graphql
mutation {
  register(
    email: "user@example.com"
    password: "SecurePassword123!"
    name: "John Doe"
  ) {
    message
  }
}
```

### Iniciar sesión

```graphql
mutation {
  login(
    email: "user@example.com"
    password: "SecurePassword123!"
  ) {
    accessToken
  }
}
```

### Obtener perfil actual

```graphql
query {
  myProfile {
    id
    name
    email
    isLocked
    isEmailConfirmed
    createdAt
  }
}
```

## Estructura de Respuestas

### Respuesta exitosa de operación
```json
{
  "data": {
    "operationName": {
      "ok": true
    }
  }
}
```

### Respuesta con error
```json
{
  "errors": [
    {
      "message": "Error description",
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR"
      }
    }
  ]
}
```

## Configuración de Conexión gRPC

La aplicación se conecta a dos servicios gRPC:

1. **Auth Service** (puerto 50051)
   - Maneja autenticación, registro y gestión de usuarios
   - Definido en `proto/auth.proto` y `proto/users.proto`

2. **Restaurant Service** (puerto 50052)
   - Maneja menús y órdenes
   - Definido en `proto/service.proto`

Asegúrate de que ambos servicios estén corriendo en los puertos configurados en el archivo `.env`.

## Testing

Para probar los endpoints, puedes usar GraphQL Playground que está disponible en:
```
http://localhost:3000/graphql
```
