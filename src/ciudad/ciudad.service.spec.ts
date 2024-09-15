import { Test, TestingModule } from '@nestjs/testing';
import { CiudadService } from './ciudad.service';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';


describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let ciudadList: CiudadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    ciudadList = [];

    for (let index = 0; index < 5; index++) {
      const ciudad: CiudadEntity = await repository.save({
        nombre: faker.location.city(),
        pais: "ARGENTINA",
        noHabitantes: faker.number.int()
      })
      ciudadList.push(ciudad);
    }
  }

  it('findAll should return all cities', async () => {
    const ciudades: CiudadEntity[] = await service.findAll();
    expect(ciudades).not.toBeNull();
    expect(ciudades).toHaveLength(ciudadList.length);
  });

  it('findOne should return a ciudad by id', async () => {
    const storedCiudad: CiudadEntity = ciudadList[0];
    const ciudad: CiudadEntity = await service.findOne(storedCiudad.id);
    expect(ciudad).not.toBeNull();
    expect(ciudad.nombre).toEqual(storedCiudad.nombre)
  });

  it('findOne should throw an exception for an invalid ciudad', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The ciudad with the given id was not found")
  });

  it('create should return a new ciudad', async () => {
    const ciudad: CiudadEntity = {
      id: "",
      nombre: faker.location.city(),
      pais: "Argentina",
      noHabitantes: faker.number.int(),
      supermercados: []
    }
 
    const newCiudad: CiudadEntity = await service.create(ciudad);
    expect(newCiudad).not.toBeNull();
 
    const storedCiudad: CiudadEntity = await repository.findOne({where: {id: newCiudad.id}})
    expect(ciudad).not.toBeNull();
    expect(ciudad.nombre).toEqual(storedCiudad.nombre)
  });

  it('create should throw an exception for an invalid pais', async () => {
    const ciudad: CiudadEntity = {
      id: "",
      nombre: faker.location.city(),
      pais: "Colombia",
      noHabitantes: faker.number.int(),
      supermercados: []
    }
 
    await expect(() => service.create(ciudad)).rejects.toHaveProperty("message", "Pais incorrecto")
  });


  it('update should modify a ciudad', async () => {
    const ciudad: CiudadEntity = ciudadList[0];
    ciudad.pais = "Ecuador";
    const updatedCiudad: CiudadEntity = await service.update(ciudad.id, ciudad);
    expect(updatedCiudad).not.toBeNull();
    const storedCiudad: CiudadEntity = await repository.findOne({ where: { id: ciudad.id } })
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(ciudad.nombre)
  });

  it('update should throw an exception for an invalid pais', async () => {
    let ciudad: CiudadEntity = ciudadList[0];
    ciudad = {
      ...ciudad, pais: "New name"
    }
    await expect(() => service.update(ciudad.id, ciudad)).rejects.toHaveProperty("message", "Pais incorrecto")
  });

  it('delete should remove a ciudad', async () => {
    const ciudad: CiudadEntity = ciudadList[0];
    await service.delete(ciudad.id);
    const deletedCiudad: CiudadEntity = await repository.findOne({ where: { id: ciudad.id } })
    expect(deletedCiudad).toBeNull();
  });

  it('delete should throw an exception for an invalid ciudad', async () => {
    const ciudad: CiudadEntity = ciudadList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The ciudad with the given id was not found")
  });
});
