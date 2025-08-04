import { createContext } from 'react';

const initialState = {
  isLoadingUserProfile: true, 
  isProfileComplete: false,
  currentUserRole: null,
  currentUserDataFromDB: null,
  currentClerkUserId: null,
  activeSearchLocation: null,
  updateProfileState: () => {},
  setActiveSearchLocation: () => {},
  donationCreationTimestamp: null,
};

export const ProfileStatusContext = createContext(initialState);