import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Public from './components/Public';
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout';
import UsersList from './features/users/UsersList';
import PostsList from './features/posts/PostsList';
import EditUser from './features/users/EditUser';
import NewUserForm from './features/users/NewUserForm';
import EditPost from './features/posts/EditPost';
import NewPost from './features/posts/NewPost';
import Prefetch from './features/auth/Prefetch';
import PersistLogin from './features/auth/PersistLogin';
import RequireAuth from './features/auth/requireAuth';
import Signup from './components/Signup';
import PublicLayout from './components/PublicLayout';
import useTitle from './hooks/useTitle';

function App() {
  useTitle('GroupoNet');

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Public />} />
        <Route element={<PublicLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>

          <Route element={<Prefetch />}>
            <Route path="dash" element={<DashLayout />}>

              <Route index element={<PostsList />} />

              <Route element={<RequireAuth />}>
                <Route path="users">
                  <Route index element={<UsersList />} />
                  <Route path=":id" element={<EditUser />} />
                  <Route path="new" element={<NewUserForm />} />
                </Route>
              </Route>

              <Route path="posts">

                <Route path=":id" element={<EditPost />} />
                <Route path="new" element={<NewPost />} />
              </Route>

            </Route>{/* End Dash */}
          </Route>
        </Route>{/* End Protected Routes */}

      </Route>
    </Routes>
  );
}

export default App;
