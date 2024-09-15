import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SupermercadoCiudadService {
    constructor(
        @InjectRepository(SupermercadoEntity)
        private readonly supermercadoRepository: Repository<SupermercadoEntity>,

        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>,
    ){}
}
