import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import api from '../utils/api';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socketEnabled, setSocketEnabled] = useState(true); // Re-enable for real-time updates
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // Track connection status

  const fetchStoredNotifications = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      const response = await api.get('/notifications-api');
      if (response.data.notifications) {
        // Convert database notifications to frontend format
        const formattedNotifications = response.data.notifications.map(notif => ({
          id: notif._id,
          type: notif.type,
          message: notif.message,
          event: notif.data.eventId ? {
            id: notif.data.eventId,
            title: notif.data.eventTitle,
            eventType: notif.data.eventType,
            location: notif.data.location,
            startDate: notif.data.startDate
          } : null,
          participation: notif.data.participationId ? {
            id: notif.data.participationId,
            eventId: notif.data.eventId,
            eventTitle: notif.data.eventTitle,
            status: notif.data.status
          } : null,
          timestamp: notif.createdAt,
          read: notif.read
        }));
        setNotifications(formattedNotifications);
        setUnreadCount(response.data.unreadCount || 0);
        console.log(`📬 Loaded ${formattedNotifications.length} stored notifications (${response.data.unreadCount} unread)`);
      }
    } catch (error) {
      console.error('Error fetching stored notifications:', error);
    }
  }, [isAuthenticated, user]);

  // Fetch stored notifications from database when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchStoredNotifications();
    }
  }, [isAuthenticated, user, fetchStoredNotifications]);

  useEffect(() => {
    if (isAuthenticated && user && socketEnabled) {
      (async () => {
        console.log('🔌 Initializing Socket.IO connection for user:', user);
        console.log('   User ID:', user._id || user.id);
        console.log('   User Role:', user.role);
        
        // Connect to Socket.IO server
        // Use environment-based URL for flexibility
        const socketUrl = process.env.REACT_APP_SOCKET_URL || 
          (process.env.NODE_ENV === 'production' 
            ? 'https://nss-portal-backend.onrender.com' 
            : 'http://localhost:5000');
        
        console.log('   Connecting to:', socketUrl);
        console.log('   Environment:', process.env.NODE_ENV);
        
        // Quick health check before attempting Socket.IO connection
        const healthCheck = async () => {
          try {
            const response = await fetch(`${socketUrl}/health`, {
              method: 'GET',
              timeout: 5000
            });
            return response.ok;
          } catch (error) {
            console.log('⚠️ Backend health check failed:', error.message);
            return false;
          }
        };
        
        // Only attempt Socket.IO if backend is responsive
        const isBackendHealthy = await healthCheck();
        if (!isBackendHealthy) {
          console.log('❌ Backend not reachable, skipping Socket.IO connection');
          setConnectionStatus('error');
          toast.error('Backend server unreachable. Real-time features disabled.');
          return;
        }
      
      // Try multiple connection strategies
      const newSocket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 2000,
        reconnectionAttempts: 10,
        timeout: 10000,
        forceNew: true,
        upgrade: true,
        rememberUpgrade: false
      });

      // Fallback: if WebSocket fails, force polling
      let connectionAttempts = 0;
      newSocket.on('connect_error', (error) => {
        connectionAttempts++;
        console.error(`❌ Socket.IO connection error (attempt ${connectionAttempts}):`, error);
        console.error('   Socket URL:', socketUrl);
        
        setConnectionStatus('error');
        
        // Force polling transport after 2 failed attempts
        if (connectionAttempts >= 2) {
          console.log('🔄 Switching to polling transport...');
          newSocket.io.opts.transports = ['polling'];
          newSocket.io.engine.close();
          newSocket.io.engine.open();
        }
        
        // Show user-friendly error message
        if (error.message === 'timeout') {
          toast.error('Connection timeout. Real-time features may be limited.');
        } else {
          toast.error('Real-time features unavailable. Some features may not work.');
        }
      });

      newSocket.on('connect', () => {
        console.log('✅ Socket.IO connected:', newSocket.id);
        setConnectionStatus('connected');
        connectionAttempts = 0; // Reset attempts on successful connection
        
        // Join user's personal room
        const userId = user._id || user.id;
        console.log('👤 Joining user room:', userId);
        if (userId) {
          newSocket.emit('join-user-room', userId.toString());
          console.log('✅ Joined room: user-' + userId);
        } else {
          console.error('❌ No user ID found:', user);
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error('❌ Socket.IO connection error:', error);
        console.error('   Socket URL:', socketUrl);
        console.error('   Transport used:', newSocket.io.engine.transport.name);
        setConnectionStatus('error');
        
        // Show user-friendly error message
        if (error.message === 'timeout') {
          toast.error('Connection timeout. Real-time features may be limited.');
        } else {
          toast.error('Real-time features unavailable. Some features may not work.');
        }
      });

      newSocket.on('disconnect', (reason) => {
        console.log('🔌 Socket disconnected:', reason);
        console.log('   Attempting to reconnect...');
        setConnectionStatus('disconnected');
        
        if (reason === 'io server disconnect') {
          toast.error('Server disconnected. Reconnecting...');
        }
      });

      newSocket.on('reconnect', (attemptNumber) => {
        console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
        setConnectionStatus('connected');
        toast.success('Real-time connection restored!');
      });

      newSocket.on('reconnect_error', (error) => {
        console.error('❌ Socket reconnection failed:', error);
        setConnectionStatus('error');
        toast.error('Failed to restore real-time connection.');
      });

      // Listen for new event notifications
      newSocket.on('new-event', async (data) => {
        console.log('🔔 New event notification received:', data);
        const notification = {
          id: Date.now(),
          type: 'new-event',
          message: data.message,
          event: data.event,
          timestamp: data.timestamp || new Date(),
          read: false
        };
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Refresh stored notifications
        fetchStoredNotifications();
        
        // Show toast with option to refresh events
        toast.success(data.message || 'New event available!', {
          duration: 5000,
          onClick: () => {
            window.location.href = '/student/events';
          }
        });
        
        // Auto-refresh events list after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });

      // Listen for participation approval notifications
      newSocket.on('participation-approved', async (data) => {
        console.log('🔔 Participation approved notification received:', data);
        
        // Check if this notification is for the current user
        const userId = user._id || user.id;
        if (data.targetUserId && data.targetUserId !== userId.toString()) {
          console.log('Notification not for current user, skipping');
          return;
        }
        
        const notification = {
          id: Date.now(),
          type: 'participation-approved',
          message: data.message,
          participation: data.participation,
          timestamp: data.timestamp || new Date(),
          read: false
        };
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Refresh stored notifications
        fetchStoredNotifications();
        
        toast.success(data.message || 'Your participation has been approved!', {
          duration: 5000,
          onClick: () => {
            window.location.href = '/student/profile';
          }
        });
      });

      // Also listen for broadcast events
      newSocket.on('new-event-broadcast', async (data) => {
        console.log('🔔 Broadcast event notification received:', data);
        // Only process if user is a student
        if (user.role === 'student') {
          const notification = {
            id: Date.now(),
            type: 'new-event',
            message: data.message,
            event: data.event,
            timestamp: data.timestamp || new Date(),
            read: false
          };
          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Refresh stored notifications
          fetchStoredNotifications();
          
          toast.success(data.message || 'New event available!', {
            duration: 5000,
            onClick: () => {
              window.location.href = '/student/events';
            }
          });
        }
      });

      newSocket.on('participation-approved-broadcast', async (data) => {
        const userId = user._id || user.id;
        if (data.targetUserId === userId.toString()) {
          console.log('🔔 Broadcast approval notification for current user:', data);
          // Same handling as regular participation-approved
          const notification = {
            id: Date.now(),
            type: 'participation-approved',
            message: data.message,
            participation: data.participation,
            timestamp: data.timestamp || new Date(),
            read: false
          };
          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Refresh stored notifications
          fetchStoredNotifications();
          
          toast.success(data.message || 'Your participation has been approved!', {
            duration: 5000,
            onClick: () => {
              window.location.href = '/student/profile';
            }
          });
        }
      });

      newSocket.on('room-joined', (data) => {
        console.log('✅ Successfully joined room:', data);
      });

      // Debug: Listen for all events
      newSocket.onAny((event, ...args) => {
        console.log('📡 Socket event received:', event, args);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
      })();
    } else {
      // Disconnect if user logs out
      if (socket) {
        socket.close();
        setSocket(null);
        setNotifications([]);
        setUnreadCount(0);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, fetchStoredNotifications]);

  const markAsRead = async (notificationId) => {
    // Update locally
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // Update in database if it's a stored notification
    if (typeof notificationId === 'string' && notificationId.length > 10) {
      try {
        await api.put(`/notifications-api/${notificationId}/read`);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const markAllAsRead = async () => {
    // Update locally
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
    
    // Update in database
    try {
      await api.put('/notifications-api/read-all');
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const clearNotifications = async () => {
    try {
      // Clear from backend
      await api.delete('/notifications-api/clear');
      
      // Clear from local state
      setNotifications([]);
      setUnreadCount(0);
      
      toast.success('All notifications cleared!');
    } catch (error) {
      console.error('Error clearing notifications:', error);
      toast.error('Failed to clear notifications');
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        unreadCount,
        connectionStatus,
        markAsRead,
        markAllAsRead,
        clearNotifications
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

