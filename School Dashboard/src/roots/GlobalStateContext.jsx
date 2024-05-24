import React, { createContext, useState, useContext } from 'react';

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({});

  return (
    <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);



// // SomeComponent.js
// import React from 'react';
// import { useGlobalState } from './GlobalStateContext';

// const SomeComponent = () => {
//   const { globalState, setGlobalState } = useGlobalState();

//   // Access global state and update it as needed

//   return (
//     // Your component JSX
//   );
// };

// export default SomeComponent;