import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you use Axios for API calls

function GymList() {
  const [gyms, setGyms] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Set isLoading to true initially
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null); 

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value); // Update selected class on change
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8081/gym'); 
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
      {isLoading ? (
        <p>Loading gyms...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : gyms.length > 0 ? (
        <ul>
          {/* Your gym list rendering logic here */}
          {gyms.map((gym) => (
            <li key={gym.gym_id}>
              <h2>{gym.gym_name}</h2>
              <p>{gym.address}</p>
              {/* Class Selection */}
              <select onChange={handleClassChange}>
                <option value="">Select a Class</option>
                {gym.classes &&
                  gym.classes.map((c) => (
                    <option key={c.class_id} value={c.class_id}>
                      {c.class_name}
                    </option>
                  ))}
              </select>
              {/* Schedule Display based on selectedClass */}
              {selectedClass && (
                <div>
                  <h3>Selected Class: {gym.classes.find(c => c.class_id === selectedClass)?.class_name}</h3>
                  {/* Fetch schedule details based on selected class ID and display here */}
                </div>
              )}
              {/* Add more details like amenities, pricing (if available) */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No gyms found.</p>
      )}
    </div>
  );
}
export default GymList;
