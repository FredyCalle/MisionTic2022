import { service } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Empleado, MensajesEmpleados} from '../models';
import {EmpleadoRepository, MensajesEmpleadosRepository} from '../repositories';
import { NotificacionesService } from '../services';

export class MensajesEmpleadosController {
  constructor(
    @repository (EmpleadoRepository)
    public EmpleadoRepository:EmpleadoRepository,
    @repository(MensajesEmpleadosRepository)
    public mensajesEmpleadosRepository : MensajesEmpleadosRepository,
    @service(NotificacionesService)
    public ServicioNotificaciones:NotificacionesService,
  ) {}

  @post('/mensajes-empleados')
  @response(200, {
    description: 'MensajesEmpleados model instance',
    content: {'application/json': {schema: getModelSchemaRef(MensajesEmpleados)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MensajesEmpleados, {
            title: 'NewMensajesEmpleados',
            exclude: ['id'],
          }),
        },
      },
    })
    mensajesEmpleados: Omit<MensajesEmpleados, 'id'>,
  ): Promise<MensajesEmpleados> {
     
     let mensaje=mensajesEmpleados;
     console.log(mensaje);
     let datosEmpleado = await this.EmpleadoRepository.findById(mensaje.empleadoId) 
     console.log(datosEmpleado); 
     this.ServicioNotificaciones.EnviarNotificacionesPorSMS(mensaje.Mensaje, datosEmpleado.Telefono);
     console.log(datosEmpleado.Telefono+mensaje.Mensaje);
     return this.mensajesEmpleadosRepository.create(mensajesEmpleados);
  }



  @get('/mensajes-empleados/count')
  @response(200, {
    description: 'MensajesEmpleados model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(MensajesEmpleados) where?: Where<MensajesEmpleados>,
  ): Promise<Count> {
    return this.mensajesEmpleadosRepository.count(where);
  }

  @get('/mensajes-empleados')
  @response(200, {
    description: 'Array of MensajesEmpleados model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(MensajesEmpleados, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(MensajesEmpleados) filter?: Filter<MensajesEmpleados>,
  ): Promise<MensajesEmpleados[]> {
    return this.mensajesEmpleadosRepository.find(filter);
  }

  @patch('/mensajes-empleados')
  @response(200, {
    description: 'MensajesEmpleados PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MensajesEmpleados, {partial: true}),
        },
      },
    })
    mensajesEmpleados: MensajesEmpleados,
    @param.where(MensajesEmpleados) where?: Where<MensajesEmpleados>,
  ): Promise<Count> {
    return this.mensajesEmpleadosRepository.updateAll(mensajesEmpleados, where);
  }

  @get('/mensajes-empleados/{id}')
  @response(200, {
    description: 'MensajesEmpleados model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(MensajesEmpleados, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(MensajesEmpleados, {exclude: 'where'}) filter?: FilterExcludingWhere<MensajesEmpleados>
  ): Promise<MensajesEmpleados> {
    return this.mensajesEmpleadosRepository.findById(id, filter);
  }

  @patch('/mensajes-empleados/{id}')
  @response(204, {
    description: 'MensajesEmpleados PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MensajesEmpleados, {partial: true}),
        },
      },
    })
    mensajesEmpleados: MensajesEmpleados,
  ): Promise<void> {
    await this.mensajesEmpleadosRepository.updateById(id, mensajesEmpleados);
  }

  @put('/mensajes-empleados/{id}')
  @response(204, {
    description: 'MensajesEmpleados PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() mensajesEmpleados: MensajesEmpleados,
  ): Promise<void> {
    await this.mensajesEmpleadosRepository.replaceById(id, mensajesEmpleados);
  }

  @del('/mensajes-empleados/{id}')
  @response(204, {
    description: 'MensajesEmpleados DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.mensajesEmpleadosRepository.deleteById(id);
  }
}
