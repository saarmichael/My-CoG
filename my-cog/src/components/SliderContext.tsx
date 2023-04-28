import React, { useState } from 'react';

type SliderContextType = {
  isSliderActive: boolean;
  setSliderActive: (active: boolean) => void;
};

export const SliderContext = React.createContext<SliderContextType>({
  isSliderActive: false,
  setSliderActive: () => {},
});

type SliderProviderProps = {
  children: React.ReactNode;
};

export const SliderProvider: React.FC<SliderProviderProps> = ({ children }) => {
  const [isSliderActive, setSliderActive] = useState(false);

  return (
    <SliderContext.Provider value={{ isSliderActive, setSliderActive }}>
      {children}
    </SliderContext.Provider>
  );
};