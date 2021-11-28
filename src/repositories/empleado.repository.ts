import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Empleado, EmpleadoRelations, Empresa, MensajesEmpleados} from '../models';
import {EmpresaRepository} from './empresa.repository';
import {MensajesEmpleadosRepository} from './mensajes-empleados.repository';

export class EmpleadoRepository extends DefaultCrudRepository<
  Empleado,
  typeof Empleado.prototype.id,
  EmpleadoRelations
> {

  public readonly empresa: BelongsToAccessor<Empresa, typeof Empleado.prototype.id>;

  public readonly mensajesEmpleados: BelongsToAccessor<MensajesEmpleados, typeof Empleado.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('EmpresaRepository') protected empresaRepositoryGetter: Getter<EmpresaRepository>, @repository.getter('MensajesEmpleadosRepository') protected mensajesEmpleadosRepositoryGetter: Getter<MensajesEmpleadosRepository>,
  ) {
    super(Empleado, dataSource);
    this.mensajesEmpleados = this.createBelongsToAccessorFor('mensajesEmpleados', mensajesEmpleadosRepositoryGetter,);
    this.registerInclusionResolver('mensajesEmpleados', this.mensajesEmpleados.inclusionResolver);
    this.empresa = this.createBelongsToAccessorFor('empresa', empresaRepositoryGetter,);
    this.registerInclusionResolver('empresa', this.empresa.inclusionResolver);
  }
}
