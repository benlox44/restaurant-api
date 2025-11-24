// src/restaurant/restaurant.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { RestaurantResolver } from './restaurant.resolver';

// El nombre del paquete que definiste en service.proto
export const RESTAURANT_PACKAGE_NAME = 'restaurant';

// El nombre que usarás para inyectar este cliente en los Resolvers/Services
export const RESTAURANT_SERVICE_NAME = 'RESTAURANT_SERVICE'; 

@Module({
  imports: [
    ClientsModule.register([
      {
        name: RESTAURANT_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: RESTAURANT_PACKAGE_NAME, 
          protoPath: join(__dirname, '../../proto/service.proto'), // ⬅️ Ruta relativa a tu service.proto
          url: process.env.RESTAURANT_SERVICE_URL || 'localhost:50052',
        },
      },
    ]),
  ],
  providers: [RestaurantResolver],
  exports: [ClientsModule],
})
export class RestaurantModule {}