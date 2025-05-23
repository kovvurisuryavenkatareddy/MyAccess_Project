import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';
import { IoLogOutOutline } from "react-icons/io5";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaCrown } from "react-icons/fa6";
import { HiUsers } from "react-icons/hi";
import { FaBars, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaMicrochip } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";

const Sidebar = ({ userRole, activeTab, onTabChange, onLogout, onSidebarToggle }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
    navigate(`/dashboard?tab=${tabId}`);
  };

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 844;
      setIsMobile(mobile);
      
      // Auto close sidebar on mobile by default
      if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Notify parent component about sidebar state changes
    if (onSidebarToggle) {
      onSidebarToggle(isSidebarOpen);
    }
  }, [isSidebarOpen, onSidebarToggle]);

  const getMenuItems = () => {
    const menuItems = [
      { 
        id: 'dashboard', 
        label: 'Dashboard', 
        icon: <AiOutlineDashboard style={{ fontSize: '20px' }}/>, 
        visible: true 
      },
      { 
        id: 'admins', 
        label: 'Admins', 
        icon: <FaCrown style={{ fontSize: '20px' }}/>, 
        visible: userRole === 'superadmin' 
      },
      { 
        id: 'users', 
        label: 'Users', 
        icon: <HiUsers style={{ fontSize: '20px' }}/>, 
        visible: userRole === 'superadmin' || userRole === 'admin' 
      },
      { 
        id: 'devices', 
        label: 'Devices', 
        icon: <FaMicrochip style={{ fontSize: '20px' }}/>, 
        visible: true 
      },
      { 
        id: 'guests', 
        label: 'Guests', 
        icon: <FiUsers style={{ fontSize: '20px' }}/>, 
        visible: userRole === 'superadmin' || userRole === 'admin' 
      }
    ];
      
    return menuItems.filter(item => item.visible);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleOverlayClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Determine sidebar classes based on state
  const sidebarClasses = `sidebar ${!isSidebarOpen ? 'closed' : ''} ${isMobile ? (isSidebarOpen ? 'open' : '') : ''}`;

  return (
    <>
      {/* Mobile hamburger button to open the sidebar */}
      {isMobile && !isSidebarOpen && (
        <button className="mobile-toggle-button" onClick={toggleSidebar}>
          <FaBars />
        </button>
      )}
      
      <div className={sidebarClasses}>
        <div className="sidebar-header">
          {(isSidebarOpen || !isMobile) && (
            <div className="app-logo">
              <div className="logo-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              {isSidebarOpen && <span className="app-name">PROJECT</span>}
            </div>
          )}
          <button className="toggle-button" onClick={toggleSidebar}>
            {isSidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>

        <div className="sidebar-menu">
          <ul>
            {getMenuItems().map(item => (
              <li key={item.id}>
                <button
                  className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => {
                    handleTabClick(item.id);
                    if (isMobile) {
                      setIsSidebarOpen(false);
                    }
                  }}
                >
                  <div className="menu-icon">{item.icon}</div>
                  {isSidebarOpen && <div className="menu-label">{item.label}</div>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-footer">
          {isSidebarOpen ? (
            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          ) : (
            <button className="logout-button-icon" onClick={onLogout}>
              <IoLogOutOutline />
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile overlay to close sidebar when clicking outside */}
      {isMobile && isSidebarOpen && (
        <div className="sidebar-overlay" onClick={handleOverlayClick}></div>
      )}
    </>
  );
};

export default Sidebar;