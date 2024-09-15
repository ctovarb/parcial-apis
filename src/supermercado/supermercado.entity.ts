import { CiudadEntity } from "src/ciudad/ciudad.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SupermercadoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    longitud: number;

    @Column()
    latitud: number;

    @Column()
    web: string;

    @ManyToMany(() => CiudadEntity, ciudades => ciudades.supermercados)
    ciudades: CiudadEntity[];
}
