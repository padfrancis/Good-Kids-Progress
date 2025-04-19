import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from "../firebase";


function Dashboard() {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      const progressRef = ref(db, 'progress/childId'); // Adjust this to your DB structure
      const snapshot = await get(progressRef);
      if (snapshot.exists()) {
        setProgress(snapshot.val());
      } else {
        console.log('No progress data available');
      }
    };

    fetchProgress();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {progress ? (
        <div>
          <h2>Progress Data</h2>
          {/* Display child progress here */}
          <p>{JSON.stringify(progress)}</p>
        </div>
      ) : (
        <p>Loading progress...</p>
      )}
    </div>
  );
}

export default Dashboard;
