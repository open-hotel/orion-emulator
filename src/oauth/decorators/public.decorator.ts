import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('OAUTH_PUBLIC', true);
