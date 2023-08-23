import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RoutesModule } from './routes/routes.module';
import { ConfigModule } from '@nestjs/config';
import { MapsModule } from './maps/maps.module';
import { RoutesGateway } from './routes/routes/routes.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RoutesModule,
    MapsModule,
  ],
  controllers: [AppController],
  providers: [AppService, RoutesGateway],
})
export class AppModule {}
