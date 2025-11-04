import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout, getCurrentUser } from '../features/auth/authSlice';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CssBaseline,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Tooltip,
  ListItemButton
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  Business as BusinessIcon,
  AccountBalance as BankIcon,
  Payment as PaymentIcon,
  AccountCircle,
  Logout
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { text: 'Agents', path: '/agents', icon: <PeopleIcon /> },
  { text: 'Contrats', path: '/contrats', icon: <DescriptionIcon /> },
  { text: 'Structures', path: '/structures', icon: <BusinessIcon /> },
  { text: 'Banques', path: '/banques', icon: <BankIcon /> },
  { text: 'États Paiements', path: '/paiements', icon: <PaymentIcon /> },
];

const MainLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    dispatch(logout())
      .unwrap()
      .then(() => {
        navigate('/login');
      })
      .catch(() => {
        navigate('/login');
      });
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            E-GesCom
          </Typography>
          
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right' }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {user.email}
                </Typography>
              </Box>
              
              <Tooltip title="Mon compte">
                <IconButton
                  onClick={handleMenuOpen}
                  size="small"
                  sx={{ ml: 1 }}
                  aria-controls={anchorEl ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={anchorEl ? 'true' : undefined}
                >
                  <Avatar sx={{ width: 40, height: 40, bgcolor: 'secondary.main' }}>
                    {getInitials(user.name)}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          )}

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                minWidth: 200,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              Mon profil
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              <Typography color="error">Déconnexion</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItemButton
                  key={item.text}
                  component={Link}
                  to={item.path}
                  selected={isActive}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      '& .MuiListItemText-primary': { 
                        fontWeight: isActive ? 600 : 400 
                      } 
                    }} 
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
