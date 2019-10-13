import { createParamDecorator } from "@nestjs/common";
import requestIp from 'request-ip'

export const UserIp = createParamDecorator((data, req) => requestIp.getClientIp(req))