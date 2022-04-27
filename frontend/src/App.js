import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';

// ----------------------------------------------------------------------
export const AuthContext = createContext({
  authorize: false,
  csrf: '',
  access: '',
  refresh: '',
  isAdmin: false
});

export default function App() {
  const [csrf, setCsrf] = useState('');
  const [access, setAccess] = useState('');
  const [refresh, setRefresh] = useState('');
  const [user, setUser] = useState('');
  const [authorize, setAuthorize] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:8000/user/csrf-cookie/', {
        withCredentials: true
      })
      .then((response) => {
        console.log(response.data)
        setCsrf(response.data['x-csrftoken'])
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  return (
    <AuthContext.Provider value={{
      csrf,
      access,
      refresh,
      authorize,
      isAdmin,
      user,
      setCsrf,
      setAccess,
      setRefresh,
      setAuthorize,
      setIsAdmin,
      setUser
    }}>
      <ThemeProvider>
        <ScrollToTop />
        <BaseOptionChartStyle />
        <Router />
      </ThemeProvider>
    </AuthContext.Provider>
  );
}
