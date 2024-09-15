import { SupermercadoEntity } from "src/supermercado/supermercado.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CiudadEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    pais: string;

    @Column()
    noHabitantes: number;

    @ManyToMany(() => SupermercadoEntity, supermercados => supermercados.ciudades)
    supermercados: SupermercadoEntity[];
}
