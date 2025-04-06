import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleList from './component/Roles/RoleList';
import AddRoleForm from './component/Roles/AddRoleForm';
import EditRoleForm from './component/Roles/EditRoleForm';
import UserList from './component/Users/UserList';
import AddUserForm from './component/Users/AddUserForm';
import EditUserForm from './component/Users/EditUserForm';
import CategoryList from './component/Categories/CategoriesList';
import EditCategoryForm from './component/Categories/EditCategoryForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Role routes */}
          <Route path="/" element={<RoleList />} />
          <Route path="/roles" element={<RoleList />} />
          <Route path="/add-role" element={<AddRoleForm />} />
          <Route path="/edit-role/:id" element={<EditRoleForm />} />
           {/* User routes */}
          <Route path="/users" element={<UserList />} />
          <Route path="/add-user" element={<AddUserForm />} />
          <Route path="/edit-user/:id" element={<EditUserForm />} />
            {/* Categories routes */}
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/categories/:id" element={<EditCategoryForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
