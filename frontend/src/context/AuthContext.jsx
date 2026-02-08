//import necessary hooks from React and the pre-configured supabase client
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
//storage space for auth data
const AuthContext = createContext();

//React component called AuthProvider
//children - components are wrapped inside this provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
    //this block of code is executed when the component loads
  useEffect(() => {
    //checks who is currently logged in 
    const getSession = async () => {
        //asks supabase for the current session
      const { data } = await supabase.auth.getSession();
      //save the user if logged in
      setUser(data.session?.user || null);
    };
    //call the function when app starts
    getSession();
    
    //listen for login or logout changes
    supabase.auth.onAuthStateChange((_event, session) => {
        //update user state based on changes
        setUser(session?.user || null);
    });
  }, []);
  //provide user data to child components
  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
