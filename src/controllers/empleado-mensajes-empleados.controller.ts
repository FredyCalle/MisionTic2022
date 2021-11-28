import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Empleado,
  MensajesEmpleados,
} from '../models';
import {EmpleadoRepository} from '../repositories';

export class EmpleadoMensajesEmpleadosController {
  constructor(
    @repository(EmpleadoRepository)
    public empleadoRepository: EmpleadoRepository,
  ) { }

  @get('/empleados/{id}/mensajes-empleados', {
    responses: {
      '200': {
        description: 'MensajesEmpleados belonging to Empleado',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(MensajesEmpleados)},
          },
        },
      },
    },
  })
  async getMensajesEmpleados(
    @param.path.string('id') id: typeof Empleado.prototype.id,
  ): Promise<MensajesEmpleados> {
    return this.empleadoRepository.mensajesEmpleados(id);
  }
}
