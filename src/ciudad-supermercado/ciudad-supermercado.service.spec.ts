import { Test, TestingModule } from '@nestjs/testing';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker/.';

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudadRepository: Repository<CiudadEntity>;
  let supermercado: SupermercadoEntity;
  let ciudad: CiudadEntity;
  let supermercadoList: SupermercadoEntity[];
  let ciudadList: CiudadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity))
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity))

    await seedDatabase();
  });

  const seedDatabase = async () => {
    supermercadoRepository.clear();
    ciudadRepository.clear();

    ciudadList = [];
    for(let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await ciudadRepository.save({
        nombre: faker.location.city(),
        pais: "ARGENTINA",
        noHabitantes: faker.number.int()
      })
      ciudadList.push(ciudad);
    }

    supermercadoList = [];
    for(let i = 0; i < 5; i++){
      const supermercado: SupermercadoEntity = await supermercadoRepository.save({
        nombre: faker.lorem.sentence(),
        longitud: faker.number.float().toString(),
        latitud: faker.number.float().toString(),
        web: faker.internet.url()
      })
      supermercadoList.push(supermercado);
    }

    supermercado = await supermercadoRepository.save({
      nombre: faker.lorem.sentence(),
      longitud: faker.number.float().toString(),
      latitud: faker.number.float().toString(),
      web: faker.internet.url(),
      ciudades: ciudadList
    })

    ciudad = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: "ARGENTINA",
      noHabitantes: faker.number.int(),
      supermercados: supermercadoList
    })

  }

  it('addSupermarketToCity should add an supermercado to a ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.sentence(),
      longitud: faker.number.float().toString(),
      latitud: faker.number.float().toString(),
      web: faker.internet.url(),
    });

    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: "ARGENTINA",
      noHabitantes: faker.number.int(),
    })

    const result: CiudadEntity = await service.addSupermarketToCity(newSupermercado.id, newCiudad.id);
    
    expect(result.supermercados.length).toEqual(1);
    expect(result.supermercados[0]).not.toBeNull();
    expect(result.supermercados[0].nombre).toEqual(newSupermercado.nombre)
    expect(result.supermercados[0].longitud).toEqual(newSupermercado.longitud)
    expect(result.supermercados[0].web).toEqual(newSupermercado.web)
  });

  it('findSupermarketFromCity should return supermercado by ciudad', async () => {
    const supermercado: SupermercadoEntity = supermercadoList[0];
    const storedSupermercado: SupermercadoEntity = await service.findSupermarketFromCity(supermercado.id, ciudad.id)
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(supermercado.nombre);
    expect(storedSupermercado.latitud).toEqual(supermercado.latitud);
    expect(storedSupermercado.web).toEqual(supermercado.web);
  });

  it('findSupermarketsFromCity should return supermercados by ciudad', async ()=>{
    const supermercados: SupermercadoEntity[] = await service.findSupermarketsFromCity(ciudad.id);
    expect(supermercados.length).toBe(5)
  });

  it('updateSupermarketsFromCity should update supermercado list for a ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.sentence(),
      longitud: faker.number.float().toString(),
      latitud: faker.number.float().toString(),
      web: faker.internet.url(),
    });

    const updatedCiudad: CiudadEntity = await service.updateSupermarketsFromCity(ciudad.id, [newSupermercado]);
    expect(updatedCiudad.supermercados.length).toBe(1);
    expect(updatedCiudad.supermercados[0].nombre).toEqual(newSupermercado.nombre)
    expect(updatedCiudad.supermercados[0].longitud).toEqual(newSupermercado.longitud)
    expect(updatedCiudad.supermercados[0].web).toEqual(newSupermercado.web)
  });

  it('deleteSupermarketFromCity should remove an supermercado from a ciudad', async () => {
    const supermercado: SupermercadoEntity = supermercadoList[0];
    
    await service.deleteSupermarketFromCity(supermercado.id, ciudad.id);

    const storedCiudad: CiudadEntity = await ciudadRepository.findOne({where: {id: ciudad.id}, relations: ["supermercados"]});
    const deletedSupermercado: SupermercadoEntity = storedCiudad.supermercados.find(a => a.id === supermercado.id);

    expect(deletedSupermercado).toBeUndefined();
  });

});
