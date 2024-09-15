import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from './ciudad.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CiudadService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>
    ){}

    async findAll(): Promise<CiudadEntity[]> {
        return await this.ciudadRepository.find({ relations: ["supermercados"]});
    }

    async findOne(id: string): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}, relations: ["supermercados"]});
        if(!ciudad)
            throw new BusinessLogicException("The ciudad with the given id was not found", BusinessError.NOT_FOUND);
        
        return ciudad;
    }

    async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
        let pais = ciudad.pais.toUpperCase();
        
        if (Paises[pais as keyof typeof Paises] === undefined )  {
            throw new BusinessLogicException("Pais incorrecto", BusinessError.PRECONDITION_FAILED)
        }
        return await this.ciudadRepository.save(ciudad)
    }

    async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
        const persistedciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}, relations: ["supermercados"]});
        let pais = ciudad.pais.toUpperCase();
        
        if (Paises[pais as keyof typeof Paises] === undefined )  {
            throw new BusinessLogicException("Pais incorrecto", BusinessError.PRECONDITION_FAILED)
        }

        if(!persistedciudad)
            throw new BusinessLogicException("The ciudad with the given id was not found", BusinessError.NOT_FOUND);

        return await this.ciudadRepository.save({...persistedciudad, ...ciudad});
    }

    async delete(id:string) {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id}});
        if(!ciudad)
            throw new BusinessLogicException("The ciudad with the given id was not found", BusinessError.NOT_FOUND);

        await this.ciudadRepository.remove(ciudad)
    }
}

export enum Paises {
    ARGENTINA = 'ARGENTINA',
    ECUADOR = 'ECUADOR',
    PARAGUAY = 'PARAGUAY',
}