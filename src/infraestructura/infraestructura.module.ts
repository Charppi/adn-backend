import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { UsuarioModule } from './usuario/usuario.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppLogger } from './configuracion/ceiba-logger.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NodeEnv } from './configuracion/environment/env-node.enum';
import { databaseConfigFactory } from './configuracion/database.config';
import { InmuebleModule } from './inmueble/inmueble.module';
import { PagosModule } from './pagos/pagos.module';

@Module({
  providers: [AppLogger],
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfigFactory,
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `env/${process.env.NODE_ENV}.env`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid(NodeEnv.DEVELOPMENT, NodeEnv.PRODUCTION)
          .required(),
      }),
    }),
    InmuebleModule,
    UsuarioModule,
    PagosModule
  ],
})
export class InfraestructuraModule { }
