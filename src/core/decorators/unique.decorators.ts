import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
@ValidatorConstraint({ name: 'Unique', async: true })
export class UniqueConstraintMongoose implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [model, uniqueField, primary] = args.constraints;
    let dbField = null,
      dtoField = null;
    if (primary) {
      dbField = primary.dbField as string;
      dtoField = primary.dtoField as string;
    }
    const object = args.object;
    if (!value || !model || !uniqueField) return false;

    const where = {};

    where[uniqueField] = value;

    if (!dtoField) {
      dtoField = dbField;
    }
    if (dbField && dtoField) {
      if (object[dtoField]) {
        where[dbField] = { $ne: object[dtoField] };
      }
    }

    try {
      if (!this.connection.model(model)) {
        return false;
      }
      if (Object.keys(where).length < 1) {
        return false;
      }
      const result = await this.connection
        .model(model as string)
        .findOne({
          ...where,
        })
        .exec();

      if (result == null) {
        return true;
      }
      return !result;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const [model] = args.constraints;
    return ` this ${args.property} exist in table ${model}`;
  }
}

export function IsUniqueMongoose(
  model: string,
  uniqueField: string,
  primary?: { dbField: string; dtoField?: string },
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [model, uniqueField, primary],
      validator: UniqueConstraintMongoose,
    });
  };
}
