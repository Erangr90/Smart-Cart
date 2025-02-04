import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Table } from 'react-bootstrap';
import Message from '../../../components/Message';
import Loader from '../../../components/Loader';
import FormContainer from '../../../components/FormContainer';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import {
  useGetPriceByIdQuery,
  useUpdatePriceMutation,
} from '../../../slices/pricesApiSlice';

const EditPrices = () => {
  const { id: priceId } = useParams();
  const [product, setProduct] = useState({});
  const [store, setStore] = useState({});
  const [chain, setChain] = useState({});
  const [number, setNumber] = useState(0);

  const {
    data: price,
    isLoading,
    error,
    refetch,
  } = useGetPriceByIdQuery(priceId);


  const [updatePrice, { isLoading: loadingUpdate }] = useUpdatePriceMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updatePrice({ priceId, store, chain, number, product });
      toast.success('Price updated successfully');
      refetch();
      navigate('/admin/prices');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };


  useEffect(() => {
    if (price) {
      setStore(price.store);
      setChain(price.chain);
      setNumber(price.number);
      setProduct(price.product);
    }
  }, [price]);

  return (
    <>
      <Link to='/admin/prices' className='btn btn-light my-3'>
        רשימת מחירים
      </Link>
      <FormContainer>
        <h1>עריכת מחיר</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (<>

          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>קטגוריה</th>
                <th>שם</th>
                <th>תיאור</th>
                <th>יצרן</th>
                <th>מדינה</th>
                <th>ברקוד</th>
                <th>כמות</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{price.product?.category?.name}</td>
                <td>
                  {price.product?.name}
                </td>
                <td>{price.product?.description}</td>
                <td>{price.product?.manufacturer}</td>
                <td>{price.product?.country + " " + price.product?.country_code}</td>
                <td>{price.product?.barcode}</td>
                <td>{price.product?.measure + " " + price.product?.unitOfMeasure}</td>
              </tr>
            </tbody>
          </Table>
          <Form onSubmit={submitHandler}>

            {/* <Form.Group className='my-2' controlId='product'>
    <Form.Label>מוצר</Form.Label>
    <Form.Control
        type='name'
        readOnly={true}
        value={product.name}
    ></Form.Control>
</Form.Group> */}

            {/* <Form.Group className='my-2' controlId='store'>
    <Form.Label>חנות</Form.Label>
    <Form.Control
        type='name'
        placeholder='נא לבחור חנות'
        value={store.name}
        onChange={(e) => setStore(e.target.value)}
    ></Form.Control>
</Form.Group> */}

            {
              //     price.chain && <Form.Group className='my-2' controlId='chain'>
              //     <Form.Label>רשת</Form.Label>
              //     <Form.Control
              //         type='name'
              //         placeholder='נא לבחור רשת'
              //         value={chain.name}
              //         onChange={(e) => setChain(e.target.value)}
              //     ></Form.Control>
              // </Form.Group>
            }

            <Form.Group className='my-2' controlId='number'>
              <Form.Label>מחיר</Form.Label>
              <Form.Control
                type='number'
                placeholder='מחיר'
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
              עדכון
            </Button>
          </Form>
        </>

        )}
      </FormContainer>
    </>
  );
};

export default EditPrices;
