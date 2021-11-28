import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {MensajesEmpleados, MensajesEmpleadosRelations, Empleado} from '../models';
import {EmpleadoRepository} from './empleado.repository';

export class MensajesEmpleadosRepository extends DefaultCrudRepository<
  MensajesEmpleados,
  typeof MensajesEmpleados.prototype.id,
  MensajesEmpleadosRelations
> {

  public readonly empleado: BelongsToAccessor<Empleado, typeof MensajesEmpleados.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('EmpleadoRepository') protected empleadoRepositoryGetter: Getter<EmpleadoRepository>,
  ) {
    super(MensajesEmpleados, dataSource);
    this.empleado = this.createBelongsToAccessorFor('empleado', empleadoRepositoryGetter,);
    this.registerInclusionResolver('empleado', this.empleado.inclusionResolver);
  }
}
