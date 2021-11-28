import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Empleado} from './empleado.model';

@model({settings: {strict: false}})
export class MensajesEmpleados extends Entity {
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
  Mensaje: string;

  /*@property({                              // modificacion 2
    type: 'string',
    required: false,  //se cambio el estado a false
  })
  idEmpleados: string;

  @property({
    type: 'date',
    required: false,  //se cambio el estado a false
  })
  FechaEnvio: string;
  */

  @belongsTo(() => Empleado)
  empleadoId: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //[prop: string]: any;                                            //modificacion 1

  constructor(data?: Partial<MensajesEmpleados>) {
    super(data);
  }
}

export interface MensajesEmpleadosRelations {
  // describe navigational properties here
}

export type MensajesEmpleadosWithRelations = MensajesEmpleados & MensajesEmpleadosRelations;
