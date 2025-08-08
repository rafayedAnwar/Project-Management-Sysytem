import React from 'react'
import '../styles/Dashboard.css'
const TeamMembersCard = () => {
  // Placeholder data
  const teamMembers = [
    { id: 1, name: 'John Doe', role: 'Frontend Developer', status: 'online' },
    { id: 2, name: 'Jane Smith', role: 'Backend Developer', status: 'offline' },
    { id: 3, name: 'Robert Johnson', role: 'UI/UX Designer', status: 'online' }
  ]
  return (
    <div className="dashboard-card team-members">
      <h2>Team Members</h2>
      <div className="card-content">
        {teamMembers.map(member => (
          <div key={member.id} className="member-item">
            <div className="member-avatar">
              {member.name.charAt(0)}
            </div>
            <div className="member-info">
              <div className="member-name">{member.name}</div>
              <div className="member-role">{member.role}</div>
            </div>
            <div className={`member-status ${member.status}`}>
              {member.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default TeamMembersCard