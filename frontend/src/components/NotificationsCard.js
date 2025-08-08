import React from 'react'
import '../styles/Dashboard.css'
const NotificationsCard = () => {
  // Placeholder data
  const notifications = [
    { id: 1, message: 'New comment on your post', time: '5 minutes ago', read: false },
    { id: 2, message: 'Your project was approved', time: '2 hours ago', read: false },
    { id: 3, message: 'Meeting scheduled for tomorrow', time: 'Yesterday', read: true }
  ]
  return (
    <div className="dashboard-card notifications">
      <h2>Notifications</h2>
      <div className="card-content">
        {notifications.length > 0 ? (
          <ul className="notification-list">
            {notifications.map(notification => (
              <li 
                key={notification.id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              >
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time">{notification.time}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-data">No new notifications</p>
        )}
      </div>
    </div>
  )
}
export default NotificationsCard