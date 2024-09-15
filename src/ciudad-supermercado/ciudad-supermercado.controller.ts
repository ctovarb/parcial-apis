import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { plainToInstance } from 'class-transformer';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { SupermercadoDto } from '../supermercado/supermercado.dto';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadSupermercadoController {
    constructor(
        private readonly ciudadSupermercadoService: CiudadSupermercadoService
    ){}

    @Get(':ciudadId/supermarkets/:supermercadoId')
    async findSupermarketFromCity(@Param('supermercadoId') supermercadoId: string, @Param('ciudadId') ciudadId: string){
        return await this.ciudadSupermercadoService.findSupermarketFromCity(supermercadoId, ciudadId);
    }

    @Get(':ciudadId/supermarkets')
    async findSupermarketsFromCity(@Param('ciudadId') ciudadId: string) {
        return await this.ciudadSupermercadoService.findSupermarketsFromCity(ciudadId);
    }

    @Post(':ciudadId/supermarkets/:supermercadoId')
    async addSupermarketToCity(@Param('supermercadoId') supermercadoId: string, @Param('ciudadId') ciudadId: string) {
        return await this.ciudadSupermercadoService.addSupermarketToCity(supermercadoId, ciudadId);
    }

    @Put(':ciudadId/supermarkets')
    async updateSupermarketsFromCity(@Param('ciudadId') ciudadId: string, @Body() supermercadoDTO: SupermercadoDto[]) {
        const supermercado = plainToInstance(SupermercadoEntity, supermercadoDTO)
        return await this.ciudadSupermercadoService.updateSupermarketsFromCity(ciudadId, supermercado);
    }

    @Delete(':ciudadId/supermarkets/:supermercadoId')
    @HttpCode(204)
    async deleteSupermarketFromCity(@Param('supermercadoId') supermercadoId: string, @Param('ciudadId') ciudadId: string) {
        return await this.ciudadSupermercadoService.deleteSupermarketFromCity(supermercadoId, ciudadId);
    } 
}
