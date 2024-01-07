import { SetMetadata } from '@nestjs/common';

export const IS_REFRESH_KEY = 'isRefresh';
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Refresh = () => SetMetadata(IS_REFRESH_KEY, true);

export const ABILITY = 'abilitys';
export const Abilitys = (...roles: string[]) => SetMetadata(ABILITY, roles);
