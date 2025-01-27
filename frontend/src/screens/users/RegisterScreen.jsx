import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';

import { useRegisterMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';
import { toast } from 'react-toastify';
import isValidUser from '../../validations/UserValidation';

const RegisterScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();


    if (password !== confirmPassword) {
      toast.error('סיסמאות אינן תואמות');
    } else {
      const valid = isValidUser({ firstName, lastName, email, password });
      if (valid == true) {
        try {
          const res = await register({ firstName, lastName, email, password }).unwrap();
          dispatch(setCredentials({ ...res }));
          navigate(redirect);
        } catch (err) {
          console.log(err?.data?.message || err.error);
        }

      } else {
        valid.map((err) => {
          toast.error(err);
        });
      }

    }
  };

  return (
    <FormContainer>
      <h1>הרשמה</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='firstName'>
          <Form.Label>שם פרטי</Form.Label>
          <Form.Control
            type='name'
            placeholder='נא להכניס שם פרטי'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='lastName'>
          <Form.Label>שם משפחה</Form.Label>
          <Form.Control
            type='name'
            placeholder='נא להכניס שם משפחה'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='email'>
          <Form.Label>כתובת אימייל</Form.Label>
          <Form.Control
            type='email'
            placeholder='נא להכניס אימייל'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='password'>
          <Form.Label>סיסמא</Form.Label>
          <Form.Control
            type='password'
            placeholder='נא להכניס סיסמא'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>אימות סיסמא</Form.Label>
          <Form.Control
            type='password'
            placeholder='אימות הסיסמא'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button disabled={isLoading} type='submit' variant='primary'>
          הרשמה
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className='py-3'>
        <Col>
          יש לך כבר חשבון?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            התחברות
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
