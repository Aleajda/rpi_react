import type { AuthorizationStatusType } from './authorization-status';
import type { OffersList } from './offer';

export type State = {
  offers: OffersList;
  authorizationStatus: AuthorizationStatusType;
  error: string | null;
  isOffersDataLoading: boolean;
};

export type AppDispatch = (action: unknown) => void;

