/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { registerDecorator, ValidationOptions } from "class-validator";
import { cpf } from "cpf-cnpj-validator";

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isCPF",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return cpf.isValid(value);
        },
      },
    });
  };
}
