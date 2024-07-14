import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const notifications = [
  { id: 1, message: 'John Doe liked your post' },
  { id: 2, message: 'Jane Smith commented on your photo' },
  { id: 3, message: 'You have a new follower' },
  // Add more notifications as needed
];

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="relative focus:outline-none">
        <FontAwesomeIcon icon={faBell} className="text-2xl" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-500 rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-4 font-bold border-b border-gray-300">Notifications</div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-4 border-b border-gray-200 hover:bg-gray-100">
                {notification.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
