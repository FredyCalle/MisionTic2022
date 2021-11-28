import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  MensajesEmpleados,
  Empleado,
} from '../models';
import {MensajesEmpleadosRepository} from '../repositories';

export class MensajesEmpleadosEmpleadoController {
  constructor(
    @repository(MensajesEmpleadosRepository)
    public mensajesEmpleadosRepository: MensajesEmpleadosRepository,
  ) { }

  @get('/mensajes-empleados/{id}/empleado', {
    responses: {
      '200': {
        description: 'Empleado belonging to MensajesEmpleados',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Empleado)},
          },
        },
      },
    },
  })
  async getEmpleado(
    @param.path.string('id') id: typeof MensajesEmpleados.prototype.id,
  ): Promise<Empleado> {
    return this.mensajesEmpleadosRepository.empleado(id);
  }
}
