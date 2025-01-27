import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import './cartsModal.css';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useProfileMutation } from '../../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../../slices/ordersApiSlice';
import { useGetCartsQuery } from '../../slices/cartsSliceApi';
import { setCredentials } from '../../slices/authSlice';
import isValidUser from '../../validations/UserValidation';


const ProfileScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [subscription, setSubscription] = useState('ללא מנוי');
  const [clicks, setClicks] = useState(null);

  const [isCartModalOpen, setCartModalOpen] = useState(false);
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);


  const { userInfo } = useSelector((state) => state.auth);
  const { subscriptions } = userInfo;



  const { data: orders, isLoading: loadingOrders, error: ordersError } = useGetMyOrdersQuery();
  const { data: carts, isLoading: loadingCarts, error: cartsError } = useGetCartsQuery();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setFirstName(userInfo.firstName);
    setLastName(userInfo.lastName);
    setEmail(userInfo.email);
    if (subscriptions && subscriptions.length > 0) {
      setSubscription(subscriptions[subscriptions.length - 1].name);
    } else {
      setClicks(userInfo.clicks);
    }
  }, [userInfo.email, userInfo.name]);

  const dispatch = useDispatch();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('סיסמאות אינן תואמות');
    } else {
      const valid = isValidUser({ firstName, lastName, email, password, });
      if (valid == true) {
        try {
          const res = await updateProfile({
            _id: userInfo._id,
            firstName,
            lastName,
            email,
            password,
          }).unwrap();
          dispatch(setCredentials({ ...res }));
          toast.success('הפרופיל עודכן בהצלחה');
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
    <Row>
      <Col md={3} className="mx-5">
        <h2>הפרופיל שלי</h2>

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


          <Form.Group className='my-2' controlId='subscription'>
            <Form.Label>מנוי</Form.Label>
            <Form.Control
              type='text'
              value={subscription}
              readOnly={true}
            ></Form.Control>
          </Form.Group>

          {clicks !== null && <>
            <Form.Group className='my-2' controlId='clicks'>
              <Form.Label>מספר פעולות לחודש זה</Form.Label>
              <Form.Control
                readOnly={true}
                type='number'
                value={clicks.numOfClicks}
              ></Form.Control>
            </Form.Group>
          </>}

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
              placeholder='אימות סיסמא'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary'>
            עדכון
          </Button>
          {loadingUpdateProfile && <Loader />}
        </Form>
      </Col>
      <Col md={3} className="mx-5">
        <h2>העגלות שלי</h2>
        {
          carts.length > 0 ? (

            cartsError ? <Message variant='danger'>{cartsError}</Message> :
              (
                loadingCarts ? <Loader /> :
                  <Table striped bordered hover responsive className="table-sm">
                    <thead>
                      <tr>
                        <th>תאריך</th>
                        <th>חנות</th>
                        <th>פריטים</th>
                        <th>מחיר</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carts.map((cart) => (
                        <tr key={cart._id}>
                          <td>{cart.createdAt}</td>
                          <td>{cart.store}</td>
                          <td>
                            {
                              isCartModalOpen ? (
                                <>
                                  <div className="modal-overlay">
                                    <div className="modal">
                                      <Button onClick={setCartModalOpen(false)}>סגירה</Button>
                                      <h2>Modal Title</h2>
                                      <p>Modal content...</p>
                                    </div>
                                  </div>
                                </>
                              ) : <Button onClick={setCartModalOpen(true)}>צפייה בפריטים</Button>
                            }
                          </td>
                          <td>{cart.totalPrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
              )

          ) : null
        }

      </Col>
      <Col md={3} className="mx-5">
        <h2>ההזמנות שלי</h2>
        {
          orders.length > 0 ? (
            ordersError ? <Message>{ordersError}</Message> :
              loadingOrders ? <Loader /> :
                <Table striped bordered hover responsive className="table-sm">
                  <thead>
                    <tr>
                      <th>תאריך</th>
                      <th>חנות</th>
                      <th>פריטים</th>
                      <th>מחיר</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order.createdAt}</td>
                        <td>{order.store}</td>
                        <td>
                          {
                            isOrderModalOpen ? (
                              <>
                                <div className="modal-overlay">
                                  <div className="modal">
                                    <Button onClick={setOrderModalOpen(false)}>סגירה</Button>
                                    <h2>Modal Title</h2>
                                    <p>Modal content...</p>
                                  </div>
                                </div>
                              </>
                            ) : <Button onClick={setOrderModalOpen(true)}>צפייה בפריטים</Button>
                          }
                        </td>
                        <td>{order.totalPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
          ) : null
        }

      </Col>
    </Row>
  );
};

export default ProfileScreen;
