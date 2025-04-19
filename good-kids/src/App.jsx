import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Login';
import Dashboard from './components/dashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Will be null if not logged in
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? <Dashboard user={user} /> : <Login />}
    </div>
  );
}

export default App;
