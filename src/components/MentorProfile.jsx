import { useState } from 'react';

const MentorProfile = ({ mentorData }) => {
  const [showDetailed, setShowDetailed] = useState(false);

  const handleToggleDetails = () => {
    setShowDetailed(!showDetailed);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    console.log(`Filter changed: ${name} = ${value}`);
  };

  return (
    <div className="mentor-profile">
      <div className="profile-header">
        <img src={mentorData.avatar} alt={mentorData.name} />
        <h2>{mentorData.name}</h2>
        <p>{mentorData.title}</p>
      </div>

      <div className="public-info">
        <p>Students Helped: {mentorData.studentsHelped}</p>
        <p>Previous Posts: {mentorData.previousPosts.length}</p>
        <p>Solved Doubts: {mentorData.solvedDoubts}</p>
        <p>Test Materials: {mentorData.testMaterials.length}</p>
      </div>

      <div className="filter-section">
        <select name="language" onChange={handleFilterChange}>
          <option value="all">All Languages</option>
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
        </select>
        <select name="exam" onChange={handleFilterChange}>
          <option value="all">All Exams</option>
          <option value="jee">JEE</option>
          <option value="neet">NEET</option>
        </select>
        <select name="topic" onChange={handleFilterChange}>
          <option value="all">All Topics</option>
          <option value="physics">Physics</option>
          <option value="chemistry">Chemistry</option>
        </select>
        <select name="city" onChange={handleFilterChange}>
          <option value="all">All Cities</option>
          <option value="delhi">Delhi</option>
          <option value="mumbai">Mumbai</option>
        </select>
        <select name="rating" onChange={handleFilterChange}>
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
        </select>
      </div>

      {showDetailed ? (
        <div className="detailed-info">
          <p>Monthly Students: {mentorData.monthlyStudents}</p>
          <p>Coaching Experience: {mentorData.experience} years</p>
          <p>Contact Info: {mentorData.contactInfo}</p>
          <button onClick={handleToggleDetails}>Hide Details</button>
        </div>
      ) : (
        <button onClick={handleToggleDetails}>Show Detailed Info</button>
      )}
    </div>
  );
};

export default MentorProfile;