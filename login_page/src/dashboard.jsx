import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you use Axios for API calls

function GymList() {
  const [gyms, setGyms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:8081/api/gyms'); // Replace with your actual server URL
        setGyms(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    

    fetchData();
  }, []);

  return (
    <div>
      {isLoading && <p>Loading gyms...</p>}
      {error && <p>Error: {error.message}</p>}
      {gyms.length > 0 && (
        <ul>
          {gyms.map((gym) => (
            <li key={gym.id}>
              <h2>{gym.name}</h2>
              <p>{gym.address}</p>
              {/* Add details from gym_sched table here (e.g., schedule) */}
              {/* You'll need to modify the data structure of 'gym' to include schedule information */}
              {gym.schedule && (
                <p>Schedule: {gym.schedule}</p>
              )}
              {/* Add more details like amenities, pricing (if available) */}
            </li>
          ))}
        </ul>
      )}
      {gyms.length === 0 && !isLoading && <p>No gyms found.</p>}
    </div>
  );
}

export default GymList;
