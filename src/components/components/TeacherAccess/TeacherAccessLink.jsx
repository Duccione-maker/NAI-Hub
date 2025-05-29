import React from 'react';
import { Link } from 'react-router-dom';
import './TeacherAccessLink.css';

const TeacherAccessLink = () => {
  return (
    <div className="teacher-access-link">
      <Link to="/admin" className="admin-link">
        <span className="admin-icon">👨‍🏫</span>
        <span className="admin-text">Area Docenti</span>
      </Link>
    </div>
  );
};

export default TeacherAccessLink;