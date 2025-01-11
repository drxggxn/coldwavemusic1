import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute'; // Импортируем компонент PrivateRoute

function App() {
  return (
    <Router>
      <Switch>
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    </Router>
  );
}

export default App;