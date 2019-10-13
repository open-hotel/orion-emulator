import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from "@nestjs/common";
import { ArangoError } from 'arangojs/lib/cjs/error'
import { Response } from "express";
import { BaseExceptionFilter } from "@nestjs/core";

@Catch()
export class ArangoErrorFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (exception.isArangoError) {
      if (exception.errorNum === 1210) {
        const field = exception.message.match(/over\s'(.+)'/)[1]
        exception = new BadRequestException(`duplicated:${field}`)
      }
    }

    return super.catch(exception, host);
  }
}