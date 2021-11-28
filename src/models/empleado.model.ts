import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Empresa} from './empresa.model';
import {MensajesEmpleados} from './mensajes-empleados.model';

@model()
export class Empleado extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  Nombres: string;

  @property({
    type: 'string',
    required: true,
  })
  Apellidos: string;

  @property({
    type: 'string',
    required: true,
  })
  Telefono: string;

  @property({
    type: 'string',
    required: true,
  })
  Direccion: string;

  @property({
    type: 'string',
    required: true,
  })
  Email: string;

  @property({
    type: 'string',
    required: true,
  })
  Edad: string;

  @property({
    type: 'date',
    required: true,
  })
  FechaNacimiento: string;

  @property({
    type: 'number',
    required: true,
  })
  Sueldo: number;

  //se adiciono este atributo ya que no existia y se requiere llamar en el controlador
  @property({
    type: 'string',
    required: true,
  })
  clave: string;


  @property({
    type: 'number',
    required: true,
  })
  EsDirectivo: number;

  @property({
    type: 'number',
    required: true,
  })
  Empresaid: number;

  @belongsTo(() => Empresa)
  empresaId: string;

  @belongsTo(() => MensajesEmpleados)
  mensajesEmpleadosId: string;

  constructor(data?: Partial<Empleado>) {
    super(data);
  }
}

export interface EmpleadoRelations {
  // describe navigational properties here
}

export type EmpleadoWithRelations = Empleado & EmpleadoRelations;
