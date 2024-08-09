import React, { useState, useEffect } from 'react';
import axios from 'axios';


function Admin() {
  const [classes, setClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classIdToDelete, setClassIdToDelete] = useState('');
  const [instructorIdToDelete, setInstructorIdToDelete] = useState('');
  const [memberIdToDelete, setMemberIdToDelete] = useState('');
  const [triggerClassDelete, setTriggerClassDelete] = useState(false);
  const [triggerInstructorDelete, setTriggerInstructorDelete] = useState(false);
  const [triggerMemberDelete, setTriggerMemberDelete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesResponse, instructorsResponse, membersResponse] = await Promise.all([
          axios.get('http://localhost:8081/classes'),
          axios.get('http://localhost:8081/instructor'),
          axios.get('http://localhost:8081/customer')
        ]);

        setClasses(classesResponse.data);
        setInstructors(instructorsResponse.data);
        setMembers(membersResponse.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleDeleteMember = async () => {
      if (triggerMemberDelete && memberIdToDelete) {
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
          setTriggerMemberDelete(false);
        }
      }
    };

    handleDeleteMember();
  }, [triggerMemberDelete, memberIdToDelete]);

  useEffect(() => {
    const handleDeleteInstructor = async () => {
      if (triggerInstructorDelete && instructorIdToDelete) {
        try {
          await axios.delete('http://localhost:8081/deleteInstructorById', {
            headers: { 'Content-Type': 'application/json' },
            params: { instructor_id: instructorIdToDelete }
          });
          alert('Instructor deleted successfully.');
          setInstructorIdToDelete('');
        } catch (error) {
          console.error('Error deleting instructor:', error.response ? error.response.data : error.message);
          alert('Failed to delete instructor.');
        } finally {
          setTriggerInstructorDelete(false);
        }
      }
    };

    handleDeleteInstructor();
  }, [triggerInstructorDelete, instructorIdToDelete]);

  useEffect(() => {
    const handleDeleteClass = async () => {
      if (triggerClassDelete && classIdToDelete) {
        try {
          await axios.delete('http://localhost:8081/deleteClassById', {
            headers: { 'Content-Type': 'application/json' },
            params: { class_id: classIdToDelete }
          });
          alert('Class deleted successfully.');
          setClassIdToDelete('');
        } catch (error) {
          console.error('Error deleting class:', error.response ? error.response.data : error.message);
          alert('Failed to delete class.');
        } finally {
          setTriggerClassDelete(false);
        }
      }
    };

    handleDeleteClass();
  }, [triggerClassDelete, classIdToDelete]);

  return (
    <div className="admin-dashboard">
      {isLoading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <div className="admin-content">
          <div className="admin-container">
            <h3>Delete Class</h3>
            <input
              type="text"
              value={classIdToDelete}
              onChange={(e) => setClassIdToDelete(e.target.value)}
              placeholder="Enter Class ID"
            />
            <button onClick={() => setTriggerClassDelete(true)}>Delete Class</button>
          </div>

          <div className="admin-container">
            <h3>Delete Instructor</h3>
            <input
              type="text"
              value={instructorIdToDelete}
              onChange={(e) => setInstructorIdToDelete(e.target.value)}
              placeholder="Enter Instructor ID"
            />
            <button onClick={() => setTriggerInstructorDelete(true)}>Delete Instructor</button>
          </div>

          <div className="admin-container">
            <h3>Delete Member</h3>
            <input
              type="text"
              value={memberIdToDelete}
              onChange={(e) => setMemberIdToDelete(e.target.value)}
              placeholder="Enter Member ID"
            />
            <button onClick={() => setTriggerMemberDelete(true)}>Delete Member</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
