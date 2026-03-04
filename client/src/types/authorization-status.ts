import { AuthorizationStatus } from '../consts';

export type AuthorizationStatusType = typeof AuthorizationStatus[keyof typeof AuthorizationStatus];

