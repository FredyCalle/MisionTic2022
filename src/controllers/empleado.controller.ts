import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Credenciales, Empleado} from '../models';
import {EmpleadoRepository, MensajesEmpleadosRepository} from '../repositories';
import {AutenticacionesService, NotificacionesService} from '../services';


export class EmpleadoController {
  constructor(
    @repository(EmpleadoRepository)
    public empleadoRepository: EmpleadoRepository,
    @repository(MensajesEmpleadosRepository)
    public mensajesEmpleadosRepository: MensajesEmpleadosRepository,
    @service(NotificacionesService)
    public ServicioNotificaciones: NotificacionesService,
    @service(AutenticacionesService)
    public ServicioAutenticaciones: AutenticacionesService,
  ) { }



  @authenticate("admin")
  @post("/identificarEmpleado", {
    responses: {
      '200': {
        description: "identificacion de usuarios"
      }
    }
  })
  async identificarEmpleado(
    @requestBody() credenciales: Credenciales
  ) {
    let p = await this.ServicioAutenticaciones.IdentificarPersona(credenciales.usuario, credenciales.clave);
    if (p) {
      let token = this.ServicioAutenticaciones.GenerarTokenJWT(p);
      return {
        datos: {
          nombre: p.Nombres,
          email: p.Email,
          id: p.id
        },
        tk: token
      }
    } else {
      throw new HttpErrors[401]("Datos inválidos");
    }
  }


  @post('/empleados')
  @response(200, {
    description: 'Empleado model instance',
    content: {'application/json': {schema: getModelSchemaRef(Empleado)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Empleado, {
            title: 'NewEmpleado',
            exclude: ['id'],
          }),
        },
      },
    })
    empleado: Omit<Empleado, 'id'>,
  ): Promise<Empleado> {
    //this.ServicioNotificaciones.EnviarNotificacionesPorSMS();
    //return this.empleadoRepository.create(empleado);
    let clave = this.ServicioAutenticaciones.GenerarClave();
    let claveCifrada = this.ServicioAutenticaciones.CifrarClave(clave);
    empleado.clave = claveCifrada;
    let emp = await this.empleadoRepository.create(empleado);

    //Notificar al empleado
    let Telefono = emp.Telefono;
    let mensaje = `Hola${emp.Nombres}, su nombre de usuario es ${emp.Email} y su contraseña es: ${clave}`;
    console.log(mensaje);
    this.ServicioNotificaciones.EnviarNotificacionesPorSMS(mensaje, Telefono);
    console.log(mensaje + " " + Telefono);

    //let datosEmpleado = await this.EmpleadoRepository.findById(mensaje.empleadoId)
    //console.log(datosEmpleado);
    //return this.empleadoRepository.create(empleado);
    return emp;
  }

  @get('/empleados/count')
  @response(200, {
    description: 'Empleado model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Empleado) where?: Where<Empleado>,
  ): Promise<Count> {
    return this.empleadoRepository.count(where);
  }

  @get('/empleados')
  @response(200, {
    description: 'Array of Empleado model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Empleado, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Empleado) filter?: Filter<Empleado>,
  ): Promise<Empleado[]> {
    return this.empleadoRepository.find(filter);
  }

  @patch('/empleados')
  @response(200, {
    description: 'Empleado PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Empleado, {partial: true}),
        },
      },
    })
    empleado: Empleado,
    @param.where(Empleado) where?: Where<Empleado>,
  ): Promise<Count> {
    return this.empleadoRepository.updateAll(empleado, where);
  }

  @get('/empleados/{id}')
  @response(200, {
    description: 'Empleado model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Empleado, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Empleado, {exclude: 'where'}) filter?: FilterExcludingWhere<Empleado>
  ): Promise<Empleado> {
    return this.empleadoRepository.findById(id, filter);
  }

  @patch('/empleados/{id}')
  @response(204, {
    description: 'Empleado PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Empleado, {partial: true}),
        },
      },
    })
    empleado: Empleado,
  ): Promise<void> {
    await this.empleadoRepository.updateById(id, empleado);
  }

  @put('/empleados/{id}')
  @response(204, {
    description: 'Empleado PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() empleado: Empleado,
  ): Promise<void> {
    await this.empleadoRepository.replaceById(id, empleado);
  }

  @del('/empleados/{id}')
  @response(204, {
    description: 'Empleado DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.empleadoRepository.deleteById(id);
  }
}
