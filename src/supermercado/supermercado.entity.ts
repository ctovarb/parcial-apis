import { CiudadEntity } from "../ciudad/ciudad.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SupermercadoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    longitud: string;

    @Column()
    latitud: string;

    @Column()
    web: string;

    @ManyToMany(() => CiudadEntity, ciudades => ciudades.supermercados)
    @JoinTable()
    ciudades: CiudadEntity[];
}
