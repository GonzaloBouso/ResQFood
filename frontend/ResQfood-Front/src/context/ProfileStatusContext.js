import { createContext } from 'react';

const initialState = {
  isLoading: true,
  isComplete: false,
  currentUserRole: null,
  currentUserDataFromDB: null,
  currentClerkUserId: null,
  activeSearchLocation: null,
  updateProfileState: () => {},
  setActiveSearchLocation: () => {},
  donationCreationTimestamp: null,
  triggerDonationReFetch: () => {},
};

export const ProfileStatusContext = createContext(initialState);