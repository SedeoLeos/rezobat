// import {
//   registerDecorator,
//   ValidationOptions,
//   ValidatorConstraint,
//   ValidatorConstraintInterface,
//   ValidationArguments,
// } from 'class-validator';
// import { Injectable } from '@nestjs/common';
// import { DataSource } from 'typeorm';

// @Injectable()
// @ValidatorConstraint({ name: 'Exist', async: true })
// export class ExistConstraintTypeOrm implements ValidatorConstraintInterface {
//   constructor(private dataSource: DataSource) {}

//   async validate(value: any, args: ValidationArguments): Promise<boolean> {
//     const [model, property = 'id'] = args.constraints;
//     if (!value || !model) return false;
//     const repository = this.dataSource.getRepository(model);

//     try {
//       const record = await repository.findOne({
//         where: {
//           [property]: value,
//         },
//       });
//       return record !== null;
//     } catch (e) {
//       console.error(e);
//       return false;
//     }
//   }

//   defaultMessage(args: ValidationArguments) {
//     const [model] = args.constraints;
//     return ` this ${args.property} don't exist in table ${model}`;
//   }
// }

// export function IsExistTypeOrm(
//   model: string,
//   uniqueField: string,
//   validationOptions?: ValidationOptions,
// ) {
//   return function (object: any, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       constraints: [model, uniqueField],
//       validator: ExistConstraintTypeOrm,
//     });
//   };
// }
