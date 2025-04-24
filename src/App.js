import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import Register from './pages/Register';
import CatalogueBoissons from './pages/CatalogueBoissons';
import AdminCommandes from "./pages/AdminCommandes";
import ChooseTable from './pages/ChooseTable';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route  path="/admin" element={<ProtectedRoute> <AdminCommandes /></ProtectedRoute>}/>
        <Route path="/choose-table" element={<ChooseTable />} />
        <Route 
  path="/table/:table_numero" 
  element={<CatalogueBoissons />} 
/>

        <Route 
           path="/dashboard/:id/:login" 
          element={
            <ProtectedRoute>
              < CatalogueBoissons/>
            </ProtectedRoute>
          } 
        />
        
      </Routes>
    </Router>
  );
}

export default App;

