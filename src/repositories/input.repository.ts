import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Input, InputRelations} from '../models';

export class InputRepository extends DefaultCrudRepository<
  Input,
  typeof Input.prototype.id,
  InputRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Input, dataSource);
  }
}
