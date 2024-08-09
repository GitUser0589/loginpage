import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GymList() {
  const [gyms, setGyms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGym, setSelectedGym] = useState(null); // Track selected gym
  const [selectedClass, setSelectedClass] = useState(null); // Track selected class
  const [selectedInstructor, setSelectedInstructor] = useState(null); // Track selected instructor
  const [selectedClassSchedule, setSelectedClassSchedule] = useState([]);
  const [classes, setClasses] = useState([]);
  const [instructors, setInstructors] = useState([]); // State to store instructors
  const [triggerInstructorView, setTriggerInstructorView] = useState(false); // State for "View Instructor"
  const [triggerClassView, setTriggerClassView] = useState(false); // State for "View Class and Schedule"
  const [notification, setNotification] = useState(''); // State for notifications
  const [confirmationMessage, setConfirmationMessage] = useState(''); // State for confirmation message

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
    if (selectedClass) {
      const fetchSchedule = async () => {
        try {
          const response = await axios.get(`http://localhost:8081/schedule?schedule_id=${selectedClass}`);
          setSelectedClassSchedule(response.data);
        } catch (error) {
          console.error('Error fetching schedule details:', error);
        }
      };

      fetchSchedule();
    }
  }, [selectedClass]);

  useEffect(() => {
    if (triggerInstructorView) {
      const fetchInstructors = async () => {
        try {
          const response = await axios.get('http://localhost:8081/view-instructors');
          setInstructors(response.data);
        } catch (error) {
          console.error('Error fetching instructors:', error);
          setError(error);
        }
      };

      fetchInstructors();
    }
  }, [triggerInstructorView]);

  const handleConfirmSelection = () => {
    if (selectedGym && selectedClass && selectedInstructor) {
      setConfirmationMessage('Selections confirmed successfully.');
    } else {
      setConfirmationMessage('Please select a gym, class, and instructor before confirming.');
    }
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading gyms...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : gyms.length > 0 ? (
        <ul className="gym-list">
          {gyms.map((gym) => (
            <li key={gym.gym_id} className="gym-container">
              <h2>{gym.gym_name}</h2>
              <p>{gym.address}</p>
              <button 
                onClick={() => setSelectedGym(gym.gym_id)}
                className="select-gym-button"
              >
                Select This Gym
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No gyms found.</p>
      )}

      <div className="container">
        <div className="instructor-container">
          <h3>View Instructor</h3>
          <button 
            onClick={() => setTriggerInstructorView(!triggerInstructorView)}
            className="toggle-button"
          >
            {triggerInstructorView ? 'Hide Instructor' : 'View Instructor'}
          </button>
          {triggerInstructorView && (
            <div>
              {instructors.length > 0 ? (
                <ul>
                  {instructors.map((instructor) => (
                    <li key={instructor.instructor_id}>
                      <p>Name: {instructor.instructor_name}</p>
                      <p>{instructor.instructor_details}</p>
                      <button 
                        onClick={() => setSelectedInstructor(instructor.instructor_name)}
                        className="select-button"
                      >
                        Select
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No instructors available.</p>
              )}
            </div>
          )}
        </div>

        <div className="class-schedule-container">
          <h3>View Class</h3>
          <button 
            onClick={() => setTriggerClassView(!triggerClassView)}
            className="toggle-button"
          >
            {triggerClassView ? 'Hide Class' : 'View Class'}
          </button>
          {triggerClassView && (
            <div>
              {classes.length > 0 ? (
                <ul>
                  {classes.map((c) => (
                    <li key={c.class_id}>
                      <h4>Class: {c.class_name}</h4>
                      <p>Description: {c.description}</p>
                      <button 
                        onClick={() => setSelectedClass(c.class_id)}
                        className="select-button"
                      >
                        Select
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No classes available.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="selected-info">
        <h3>Selected Information</h3>
        <p><strong>Selected Gym:</strong> {selectedGym ? gyms.find(gym => gym.gym_id === selectedGym)?.gym_name : 'None'}</p>
        <p><strong>Selected Class:</strong> {selectedClass ? classes.find(c => c.class_id === selectedClass)?.class_name : 'None'}</p>
        <p><strong>Selected Instructor:</strong> {selectedInstructor || 'None'}</p>
        <button 
          onClick={handleConfirmSelection}
          className="confirm-selection-button"
        >
          Confirm Selections
        </button>
        {confirmationMessage && (
          <div className="notification">
            <p>{confirmationMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GymList;
