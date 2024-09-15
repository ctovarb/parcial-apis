import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from 'src/ciudad/ciudad.entity';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CiudadEntity, SupermercadoEntity])],
})
export class CiudadSupermercadoModule {}
