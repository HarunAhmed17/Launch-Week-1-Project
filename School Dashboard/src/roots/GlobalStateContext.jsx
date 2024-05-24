import React, { createContext, useState, useContext } from 'react';

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({});
  // const { globalState, updateGlobalState } = useGlobalState();
  // setGlobalState("admin");

 // it still has the same error, so I'm not too sure what the solution might be
 // maybe try asking gpt? I can paste the error
 // You can paste the error and the code too
  // yeah good idea will do
  // its saying we shouldn't setGlobalState in this function here, so I think ill comment it out
  // ok now the error is back to useGlobalState is not a function or return value is not iterable lol
  // i will try to implement the other changes gpt suggested
 //Okay great! is the error related to the import or the logging? Does it highlight the line?
 // yeah it says dashboard.jsx line 32
 //lol line 32 has a comment. 
 // on dashboard.jsx line 32 not this file
 //oh i see
 //
 
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