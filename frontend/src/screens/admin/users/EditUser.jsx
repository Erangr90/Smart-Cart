// React packages
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
// BootStrap
import { Form, Button } from 'react-bootstrap';
// Components
import Message from '../../../components/Message';
import Loader from '../../../components/Loader';
import FormContainer from '../../../components/FormContainer';
// Toastify
import { toast } from 'react-toastify';
// Api Slices
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from '../../../slices/usersApiSlice';

// The component
const EditUser = () => {
  const { id: userId } = useParams();
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, isAdmin });
      toast.success('user updated successfully');
      refetch();
      navigate('/admin/users');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (user) {
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  return (
    <>
      <Link to='/admin/users' className='btn btn-light my-3'>
        רשימת משתמשים
      </Link>
      <FormContainer>
        <h1>עריכת תנאי משתמש</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Form onSubmit={submitHandler}>


            <Form.Group className='my-2' controlId='isadmin'>
              <Form.Check
                type='checkbox'
                label='גישת מנהל'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type='submit' variant='primary'>
              עדכון
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default EditUser;
