import { Test, TestingModule } from '@nestjs/testing';
import { SupermercadoService } from './supermercado.service';
import { SupermercadoEntity } from './supermercado.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';


describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let supermercadoList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    supermercadoList = [];

    for (let index = 0; index < 5; index++) {
      const supermercado: SupermercadoEntity = await repository.save({
        nombre: faker.lorem.sentence(),
        longitud: faker.number.float().toString(),
        latitud: faker.number.float().toString(),
        web: faker.internet.url()
      })
      supermercadoList.push(supermercado);
    }
  }

  it('findAll should return all supermercados', async () => {
    const supermercados: SupermercadoEntity[] = await service.findAll();
    expect(supermercados).not.toBeNull();
    expect(supermercados).toHaveLength(supermercadoList.length);
  });

  it('findOne should return a supermercado by id', async () => {
    const storedSupermercado: SupermercadoEntity = supermercadoList[0];
    const supermercado: SupermercadoEntity = await service.findOne(storedSupermercado.id);
    expect(supermercado).not.toBeNull();
    expect(supermercado.nombre).toEqual(storedSupermercado.nombre)
  });

  it('findOne should throw an exception for an invalid supermercado', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The supermercado with the given id was not found")
  });

  it('create should return a new supermercado', async () => {
    const supermercado: SupermercadoEntity = {
      id: "",
      nombre: faker.lorem.sentence(),
      longitud: faker.number.float().toString(),
      latitud: faker.number.float().toString(),
      web: faker.internet.url(),
      ciudades: []
    }
 
    const newSupermercado: SupermercadoEntity = await service.create(supermercado);
    expect(newSupermercado).not.toBeNull();
 
    const storedSupermercado: SupermercadoEntity = await repository.findOne({where: {id: newSupermercado.id}})
    expect(supermercado).not.toBeNull();
    expect(supermercado.nombre).toEqual(storedSupermercado.nombre)
  });

  it('create should throw an exception for an invalid name', async () => {
    const supermercado: SupermercadoEntity = {
      id: "",
      nombre: "new name",
      longitud: faker.number.float().toString(),
      latitud: faker.number.float().toString(),
      web: faker.internet.url(),
      ciudades: []
    }
 
    await expect(() => service.create(supermercado)).rejects.toHaveProperty("message", "El nombre del supermercado es muy corto")
  });

  it('update should modify a supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadoList[0];
    supermercado.nombre = "New name long";
    const updatedSupermercado: SupermercadoEntity = await service.update(supermercado.id, supermercado);
    expect(updatedSupermercado).not.toBeNull();
    const storedSupermercado: SupermercadoEntity = await repository.findOne({ where: { id: supermercado.id } })
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(supermercado.nombre)
  });

  it('update should throw an exception for an invalid supermercado', async () => {
    let supermercado: SupermercadoEntity = supermercadoList[0];
    supermercado = {
      ...supermercado, nombre: "New name"
    }
    await expect(() => service.update(supermercado.id, supermercado)).rejects.toHaveProperty("message", "El nombre del supermercado es muy corto")
  });

  it('delete should remove a supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadoList[0];
    await service.delete(supermercado.id);
    const deletedSupermercado: SupermercadoEntity = await repository.findOne({ where: { id: supermercado.id } })
    expect(deletedSupermercado).toBeNull();
  });

  it('delete should throw an exception for an invalid supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadoList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The supermercado with the given id was not found")
  });
});
