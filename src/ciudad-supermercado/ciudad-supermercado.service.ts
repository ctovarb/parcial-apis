import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CiudadSupermercadoService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>,

        @InjectRepository(SupermercadoEntity)
        private readonly supermercadoRepository: Repository<SupermercadoEntity>,
    ){}

    async addSupermarketToCity(supermarketId: string, cityId: string): Promise<CiudadEntity> {
        const supermarket = await this.supermercadoRepository.findOne({where: {id: supermarketId}});
        if (!supermarket)
          throw new BusinessLogicException("The supermarket with the given id was not found", BusinessError.NOT_FOUND);
        
        const city = await this.ciudadRepository.findOne({where: {id: cityId}, relations : ["supermercados"] });
        if (!city)
          throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND);
    
        city.supermercados = [...city.supermercados, supermarket];
        return await this.ciudadRepository.save(city);
    }

    async findSupermarketFromCity(supermarketId: string, cityId: string): Promise<SupermercadoEntity> {
        const ciudad = await this.ciudadRepository.findOne({where: {id: cityId}, relations: ["supermercados"]});
        if (!ciudad)
        throw new BusinessLogicException("The ciudad with the given id was not found", BusinessError.NOT_FOUND)
        
        const supermercado = await this.supermercadoRepository.findOne({where: {id: supermarketId}, relations: ["ciudades"] });
        if (!supermercado)
        throw new BusinessLogicException("The supermercado with the given id was not found", BusinessError.NOT_FOUND)

        const supermercadoRestaurant = ciudad.supermercados.find(e => e.id === supermercado.id);

        if (!supermercadoRestaurant)
        throw new BusinessLogicException("The supermercado with the given id is not associated to the ciudad", BusinessError.PRECONDITION_FAILED)

        return supermercadoRestaurant;
    }

    async findSupermarketsFromCity(cityId: string): Promise<SupermercadoEntity[]> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: cityId}, relations : ["supermercados"] });
        if (!ciudad)
            throw new BusinessLogicException("The ciudad with the given id was not found", BusinessError.NOT_FOUND)

        return ciudad.supermercados
    }

    async updateSupermarketsFromCity(ciudadId: string, supermercados: SupermercadoEntity[]): Promise<CiudadEntity> {
        const ciudad = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations : ["supermercados"] });

        if (!ciudad)
            throw new BusinessLogicException("The ciudad with the given id was not found", BusinessError.NOT_FOUND)

        for(let supermercadoEntity of supermercados) {
            const supermercado = await this.supermercadoRepository.findOne({where: {id: supermercadoEntity.id}});
            if (!supermercado){
                throw new BusinessLogicException("The supermercado with the given id was not found", BusinessError.NOT_FOUND) 
            }
            
        }

        ciudad.supermercados = supermercados;
        return await this.ciudadRepository.save(ciudad);
    }

    async deleteSupermarketFromCity(supermarketId: string, cityId: string) {
        const ciudad = await this.ciudadRepository.findOne({where: {id: cityId}, relations: ["supermercados"]});
        if (!ciudad)
            throw new BusinessLogicException("The ciudad with the given id was not found", BusinessError.NOT_FOUND)

        const supermercado = await this.supermercadoRepository.findOne({where: {id: supermarketId}, relations: ["ciudades"] });
        if (!supermercado)
            throw new BusinessLogicException("The supermercado with the given id was not found", BusinessError.NOT_FOUND)

        const ciudadSupermercado: SupermercadoEntity = ciudad.supermercados.find(e => e.id === supermercado.id);
        if(!ciudadSupermercado) {
            throw new BusinessLogicException("The supermercado with the given id is not associated to the ciudad", BusinessError.PRECONDITION_FAILED)
        }

        ciudad.supermercados = ciudad.supermercados.filter(e => e.id !== supermarketId);
        await this.ciudadRepository.save(ciudad);
    }
}
