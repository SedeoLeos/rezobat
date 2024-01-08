import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
@ValidatorConstraint({ name: 'Exist', async: true })
export class ExistConstraintMongoose implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [model, property = 'id'] = args.constraints;
    if (!value || !model) return false;
    const repository = this.connection.model(model);

    try {
      const record = await repository
        .findOne({
          [property]: value,
        })
        .exec();
      return record !== null;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const [model] = args.constraints;
    return ` this ${args.property} don't exist in table ${model}`;
  }
}

export function IsExistMongoose(
  model: string,
  uniqueField: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [model, uniqueField],
      validator: ExistConstraintMongoose,
    });
  };
}
