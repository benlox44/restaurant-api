import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: ['auth', 'users'],
          protoPath: [
            join(__dirname, '../../proto/auth.proto'),
            join(__dirname, '../../proto/users.proto'),
          ],
          url: process.env.AUTH_SERVICE_URL || 'localhost:50051',
        },
      },
    ]),
  ],
  providers: [AuthResolver],
})
export class AuthModule {}

