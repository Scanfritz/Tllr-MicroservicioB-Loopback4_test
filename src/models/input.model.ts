import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Input extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;
  
  @property({
    type: 'number',
    required: true,
  })
  precioEnvio: number;

  @property({
    type: 'number',
    required: true,
  })
  precioProducto: number;

  @property({
    type: 'number',
    required: true,
  })
  zona: number;

  @property({
    type: 'string',
    required: true,
  })
  tipoPago: string;

  @property({
    type: 'string',
  })
  cupon?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Input>) {
    super(data);
  }
}

export interface InputRelations {
  // describe navigational properties here
}

export type InputWithRelations = Input & InputRelations;
