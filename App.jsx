import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WebSocketProvider } from "./contexts/WebSocketContext"; 
import Join from './Join_page/Join';
import Login from './Login_page/Login';
import MainPage from './Main_page/Main';
import MyPage from './MY_page/Mypage';
import Edit from'./MY_page/Edit';
import BMSPage from './BMS_page/BMS1';
import BMSPage2 from './BMS_page/BMS2';
import MMSPage from './MMS_page/MMS';
import RoutePage from './Route_page/Route';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/MYpage" element={<MyPage />} />
          <Route path="/Edit" element={<Edit />} />
          <Route path="/BMS1" element={<BMSPage />} />
          <Route path="/BMS2" element={<BMSPage2 />} />
          <Route path="/MMS" element={ <WebSocketProvider><MMSPage /> </WebSocketProvider>} />
          <Route path="/Route" element={<RoutePage />} />
          <Route path="/Join" element={<Join />} />
        </Routes>
      </Router>
  );
}

export default App;

