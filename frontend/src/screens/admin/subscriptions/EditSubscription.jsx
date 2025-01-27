import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap';
import Message from '../../../components/Message';
import Loader from '../../../components/Loader';
import FormContainer from '../../../components/FormContainer';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import {
  useGetSubscriptionQuery,
  useUpdateSubscriptionMutation,
} from '../../../slices/subscriptionsApiSlice';
import isValidSubscription from '../../../validations/SubscriptionValidation';

const EditSubscription = () => {
  const { id: subscriptionId } = useParams();
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [description, setDescription] = useState('');

  const {
    data: subscription,
    isLoading,
    error,
    refetch,
  } = useGetSubscriptionQuery(subscriptionId);


  const [updateSubscription, { isLoading: loadingUpdate }] = useUpdateSubscriptionMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const valid = isValidSubscription({ subscriptionId, name, price, discount, description });
    if (valid == true) {
      try {
        await updateSubscription({ subscriptionId, name, price, discount, description }).unwrap();
        toast.success('subscription updated successfully');
        refetch();
        navigate('/admin/subscriptions');
      } catch (err) {
        console.log(err?.data?.message || err.error);
      }

    } else {
      valid.map((err) => {
        toast.error(err);
      });
    }

  };


  useEffect(() => {
    if (subscription) {
      setName(subscription.name);
      setPrice(subscription.price);
      setDiscount(subscription.discount);
      setDescription(subscription.description);
    }
  }, [subscription]);

  return (
    <>
      <Link to='/admin/subscriptions' className='btn btn-light my-3'>
        רשימת מנויים
      </Link>
      <FormContainer>
        <h1>עריכת מנוי</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Form onSubmit={submitHandler}>

            <Form.Group className='my-2' controlId='name'>
              <Form.Label>שם</Form.Label>
              <Form.Control
                type='name'
                placeholder='נא להכניס שם'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='price'>
              <Form.Label>מחיר</Form.Label>
              <Form.Control
                type='number'
                placeholder='נא להכניס מחיר'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='discount'>
              <Form.Label>הנחה</Form.Label>
              <Form.Control
                type='number'
                placeholder='נא להכניס הנחה'
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              ></Form.Control>
            </Form.Group>



            <Form.Group as={Col} controlId="description">
              <Form.Label>תיאור</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Button type='submit' variant='primary' className='my-3'>
              עדכון
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default EditSubscription;
