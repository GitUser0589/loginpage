import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GymList() {
  const [gyms, setGyms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState({});
  const [selectedClassSchedule, setSelectedClassSchedule] = useState({});
  const [classes, setClasses] = useState([]);
  const [memberIdToDelete, setMemberIdToDelete] = useState('');
  const [triggerDelete, setTriggerDelete] = useState(false);

  useEffect(() => {
    const handleDeleteMember = async () => {
      if (triggerDelete && memberIdToDelete) {
        try {
          await axios.delete('http://localhost:8081/deleteMemberById', {
            headers: { 'Content-Type': 'application/json' },
            params: { customer_id: memberIdToDelete }
          });
          alert('Member deleted successfully.');
          setMemberIdToDelete('');
        } catch (error) {
          console.error('Error deleting member:', error.response ? error.response.data : error.message);
          alert('Failed to delete member.');
        } finally {
          setTriggerDelete(false); // Reset trigger state
        }
      }
    };

    handleDeleteMember();
  }, [triggerDelete, memberIdToDelete]);

  const handleClassChange = (event, gymId) => {
    const classId = event.target.value;
    setSelectedClasses({ ...selectedClasses, [gymId]: classId });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gymsResponse, classesResponse] = await Promise.all([
          axios.get('http://localhost:8081/gym'),
          axios.get('http://localhost:8081/classes')
        ]);

        setGyms(gymsResponse.data);
        setClasses(classesResponse.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchScheduleAndClassDetails = async (gymId, classId) => {
      if (classId) {
        try {
          const [scheduleResponse, classResponse] = await Promise.all([
            axios.get(`http://localhost:8081/schedule?schedule_id=${classId}`),
            axios.get(`http://localhost:8081/classes?class_id=${classId}`)
          ]);

          setSelectedClassSchedule((prevSchedule) => ({
            ...prevSchedule,
            [gymId]: scheduleResponse.data,
          }));

          const selectedClass = classResponse.data;

          setClasses((prevClasses) => {
            const updatedClasses = prevClasses.map((c) =>
              c.class_id === classId ? selectedClass : c
            );
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
  }, [selectedClasses]);

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
                        {schedule.start_time} - {schedule.end_time}
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

      <div>
        <h3>Delete Member</h3>
        <input
          type="text"
          value={memberIdToDelete}
          onChange={(e) => setMemberIdToDelete(e.target.value)}
          placeholder="Enter Member ID"
        />
        <button onClick={() => setTriggerDelete(true)}>Delete Member</button>
      </div>
    </div>
  );
}

export default GymList;
