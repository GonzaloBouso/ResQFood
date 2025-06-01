import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { MapPin, ChevronDown, Menu as MenuIcon, Search as SearchIcon } from 'lucide-react';
import logoResQFood from '../../assets/Logo-ResQfood.png';

import Location from '../map/Location';

const Header = () => {
  const navigate = useNavigate();

  const authButtonBaseClasses = "text-xs sm:text-sm font-medium py-1.5 px-2 sm:px-3 rounded-md transition-colors duration-150 ease-in-out whitespace-nowrap";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24"> 
          <div className="flex items-center space-x-2 sm:space-x-4"> 
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src={logoResQFood} 
                alt="ResQFood Logo" 
                className="h-20 sm:h-20 md:h-20 lg:w-[120px] lg:h-auto"
              />
            </Link>
            <Location></Location>
          </div>
         
          <div className="hidden lg:flex flex-1 justify-center items-center px-4">
            <div className="w-full max-w-lg xl:max-w-xl">
              <div className="relative flex items-center bg-searchBg rounded-full shadow-sm h-10">
                <div className="pl-4 pr-2 flex items-center justify-center">
                  <MenuIcon size={20} className="text-textMuted hover:text-textMain cursor-pointer" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar alguna donacion"
                  className="w-full h-full bg-transparent text-sm text-textMain placeholder-textMuted focus:outline-none px-2"
                />
                <div className="pr-4 pl-2 flex items-center justify-center">
                  <SearchIcon size={18} className="text-textMuted hover:text-textMain cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2"> 
            <Link 
              to="/sobreNosotros"
              className="hidden lg:block text-sm text-textMain hover:text-primary px-3 py-2 transition-colors whitespace-nowrap"
            >
              Sobre Nosotros
            </Link>

            <SignedOut>
              <button
                onClick={() => navigate('/sign-in')}
                className={`${authButtonBaseClasses} text-primary border border-primary hover:bg-primary hover:text-white`}
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/sign-up')}
                className={`${authButtonBaseClasses} bg-primary text-white hover:bg-brandPrimaryDarker`}
              >
                Register
              </button>
            </SignedOut>

            <SignedIn>
              <div className="ml-1 sm:ml-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;