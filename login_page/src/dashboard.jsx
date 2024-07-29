import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GymList() {
  const [gyms, setGyms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState({}); // Use an object to store selected class for each gym
  const [selectedClassSchedule, setSelectedClassSchedule] = useState({});
  const [classes, setClasses] = useState([]);

  const handleClassChange = (event, gymId) => {
    const classId = event.target.value;
    setSelectedClasses({ ...selectedClasses, [gymId]: classId }); // Update selected class for the specific gym
  };

  useEffect(() => {
    const fetchScheduleAndClassDetails = async (gymId, classId) => {
      if (classId) {
        try {
          // Fetch schedule for the selected class
          const scheduleResponse = await axios.get(`http://localhost:8081/schedule?schedule_id=${classId}`);
          setSelectedClassSchedule((prevSchedule) => ({
            ...prevSchedule,
            [gymId]: scheduleResponse.data,
          }));

          // Fetch details of the selected class, including description
          const classResponse = await axios.get(`http://localhost:8081/classes?class_id=${classId}`);
          const selectedClass = classResponse.data;
          
          // Update or replace the selected class in the classes state array
          setClasses((prevClasses) => {
            const updatedClasses = prevClasses.map((c) => {
              if (c.class_id === classId) {
                return selectedClass; // Replace existing class with updated details
              }
              return c;
            });
            return updatedClasses;
          });
        } catch (error) {
          console.error('Error fetching schedule or class details:', error);
        }
      }
    };

    Object.keys(selectedClasses).forEach((gymId) => {
      fetchScheduleAndClassDetails(gymId, selectedClasses[gymId]);
    });
  }, [selectedClasses]); // Watch for changes in selectedClasses object

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classesResponse = await axios.get('http://localhost:8081/classes');
        setClasses(classesResponse.data); // Assuming response.data is an array of classes
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gymsResponse = await axios.get('http://localhost:8081/gym');
        setGyms(gymsResponse.data); // Assuming response.data is an array of gyms with classes array
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
          {gyms.map((gym) => (
            <li key={gym.gym_id} className="gym-container">
              <h2>{gym.gym_name}</h2>
              <p>{gym.address}</p>
              <select onChange={(event) => handleClassChange(event, gym.gym_id)} value={selectedClasses[gym.gym_id] || ''}>
                <option value="">Select a Class</option>
                {classes.map((c) => (
                  <option key={c.class_id} value={c.class_id}>
                    {c.class_name}
                  </option>
                ))}
              </select>
              {selectedClasses[gym.gym_id] && (
                <div>
                  <h3>Selected Class: {classes.find((c) => c.class_id === selectedClasses[gym.gym_id])?.class_name}</h3>
                  <h4>Description:</h4>
                  <p>{classes.find((c) => c.class_id === selectedClasses[gym.gym_id])?.description}</p>
                  <h4>Schedule:</h4>
                  <ul>
                    {selectedClassSchedule[gym.gym_id]?.map((schedule) => (
                      <li key={schedule.schedule_id}>
                        {schedule.start_time} - {schedule.end_time} {/* Assuming schedule times */}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Additional details like amenities, pricing can be added here */}
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
