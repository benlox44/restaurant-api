# Restaurant API Gateway<p align="center">

  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>

API Gateway con GraphQL que actúa como punto de entrada unificado para el sistema de restaurante. Se comunica con los microservicios backend mediante gRPC.</p>



## 🏗️ Arquitectura[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest

```

Frontend (React + GraphQL Client)  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

         ↓    <p align="center">

    API Gateway (GraphQL)<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>

         ↓<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>

    ┌────┴────┐<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>

    ↓         ↓<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>

Auth Service  Payment Service<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>

  (gRPC)      (REST/HTTP)<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>

```<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>

  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>

## 🚀 Características    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>

  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>

- **GraphQL API**: Interfaz unificada para el frontend</p>

- **API Gateway Pattern**: Punto de entrada único que orquesta llamadas a microservicios  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)

- **gRPC Communication**: Comunicación eficiente con el servicio de autenticación  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

- **CORS Enabled**: Configurado para comunicación con el frontend

- **GraphQL Playground**: Interfaz interactiva para explorar la API## Description



## 📋 Requisitos Previos[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.



- Node.js 18+## Project setup

- npm o yarn

- Servicios backend corriendo:```bash

  - `restaurant-auth` en `localhost:50051` (gRPC)$ npm install

  - `restaurant-payments` en `localhost:8000` (HTTP)```



## 🔧 Instalación## Compile and run the project



```bash```bash

# Instalar dependencias# development

npm install$ npm run start



# Copiar variables de entorno# watch mode

cp .env.example .env$ npm run start:dev

```

# production mode

## ⚙️ Variables de Entorno$ npm run start:prod

```

```env

PORT=3000## Run tests

FRONTEND_URL=http://localhost:5173

AUTH_SERVICE_URL=localhost:50051```bash

PAYMENT_SERVICE_URL=localhost:8000# unit tests

```$ npm run test



## 🏃 Ejecución# e2e tests

$ npm run test:e2e

```bash

# Desarrollo# test coverage

npm run start:dev$ npm run test:cov

```

# Producción

npm run build## Deployment

npm run start:prod

```When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.



El API Gateway estará disponible en:If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

- GraphQL Endpoint: `http://localhost:3000/graphql`

- GraphQL Playground: `http://localhost:3000/graphql` (navegador)```bash

$ npm install -g @nestjs/mau

## 📚 API GraphQL$ mau deploy

```

### Queries

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

```graphql

# Obtener perfil del usuario actual## Resources

query {

  myProfile {Check out a few resources that may come in handy when working with NestJS:

    id

    name- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.

    email- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).

    isEmailConfirmed- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).

    isLocked- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.

  }- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).

}- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).

```- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).

- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

### Mutations

## Support

#### Autenticación

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

```graphql

# Registro## Stay in touch

mutation {

  register(email: "user@example.com", password: "password123", name: "John Doe") {- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)

    message- Website - [https://nestjs.com](https://nestjs.com/)

  }- Twitter - [@nestframework](https://twitter.com/nestframework)

}

## License

# Login

mutation {Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

  login(email: "user@example.com", password: "password123") {
    accessToken
  }
}
```

#### Gestión de Contraseña

```graphql
# Solicitar reset de contraseña
mutation {
  requestPasswordReset(email: "user@example.com") {
    message
  }
}

# Resetear contraseña
mutation {
  resetPassword(token: "reset-token", newPassword: "newPassword123") {
    message
  }
}

# Actualizar contraseña
mutation {
  updatePassword(currentPassword: "oldPassword", newPassword: "newPassword123") {
    message
  }
}
```

#### Gestión de Perfil

```graphql
# Actualizar perfil
mutation {
  updateProfile(name: "Jane Doe") {
    message
  }
}

# Solicitar cambio de email
mutation {
  requestEmailUpdate(password: "password123", newEmail: "newemail@example.com") {
    message
  }
}

# Eliminar cuenta
mutation {
  deleteAccount(password: "password123") {
    message
  }
}
```

## 🏗️ Estructura del Proyecto

```
src/
├── auth/                    # Módulo de autenticación
│   ├── auth.module.ts      # Configuración del cliente gRPC
│   └── auth.resolver.ts    # Resolvers GraphQL para auth
├── graphql/                 # Esquemas GraphQL
│   └── schema.gql          # Definición de tipos GraphQL
├── app.module.ts           # Módulo principal
└── main.ts                 # Punto de entrada
proto/                       # Definiciones Protocol Buffers
├── auth.proto              # Servicio de autenticación
└── users.proto             # Servicio de usuarios
```

## 🔌 Integración con Microservicios

### Auth Service (gRPC)

El gateway se conecta al servicio de autenticación mediante gRPC:

```typescript
ClientsModule.register([
  {
    name: 'AUTH_PACKAGE',
    transport: Transport.GRPC,
    options: {
      package: ['auth', 'users'],
      protoPath: [...],
      url: 'localhost:50051',
    },
  },
])
```

### Payment Service (HTTP)

_(Por implementar)_ Comunicación HTTP con el servicio de pagos Python/FastAPI.

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Deployment

```bash
# Build
npm run build

# El output estará en dist/
node dist/main.js
```

## 🔐 Autenticación

El API Gateway maneja la autenticación mediante JWT tokens:
1. El frontend obtiene un token mediante la mutation `login`
2. El token se envía en las siguientes requests en el header `Authorization`
3. El gateway valida el token y lo reenvía a los microservicios

## 🌐 CORS

CORS está habilitado para permitir requests desde el frontend:
- Origin: `http://localhost:5173` (configurable vía `FRONTEND_URL`)
- Credentials: Enabled

## 📝 Notas de Desarrollo

- Los resolvers convierten las queries/mutations GraphQL a llamadas gRPC
- Los errores de los microservicios se propagan al frontend a través de GraphQL
- El playground está habilitado en desarrollo para facilitar testing

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
