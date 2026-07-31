import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import BorrowerList from './pages/BorrowerList';
import BorrowerDetail from './pages/BorrowerDetail';
import Analytics from './pages/Analytics';
import ChatbotView from './pages/ChatbotView';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/borrowers" element={<BorrowerList />} />
          <Route path="/borrowers/:id" element={<BorrowerDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/chatbot" element={<ChatbotView />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
