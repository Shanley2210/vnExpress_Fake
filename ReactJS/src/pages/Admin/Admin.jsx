import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box, Toolbar, Typography } from '@mui/material';
import ArticlesTab from './ArticlesTab';
import CommentsTab from './CommentsTab';
import UsersTab from './UsersTab';
import axios from 'axios';
import Cookies from 'js-cookie';

// Cấu hình base URL cho axios
axios.defaults.baseURL = 'https://vnexpress-fake.onrender.com/';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('articles');

  const handleTabChange = (_, v) => setActiveTab(v);

  return (
    <Box sx={{ backgroundColor: '#f3f6f9', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #1976d2, #2196f3)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Trang Quản Trị</Typography>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab label="Bài Viết" value="articles" />
            <Tab label="Bình Luận" value="comments" />
            <Tab label="Người Dùng" value="users" />
          </Tabs>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
        {activeTab === 'articles' && <ArticlesTab />}
        {activeTab === 'comments' && <CommentsTab />}
        {activeTab === 'users'    && <UsersTab />}
      </Box>
    </Box>
  );
  
}
