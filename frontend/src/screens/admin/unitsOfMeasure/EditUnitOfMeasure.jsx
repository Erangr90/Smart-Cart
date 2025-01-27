import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../../components/Message';
import Loader from '../../../components/Loader';
import FormContainer from '../../../components/FormContainer';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import {
  useGetUnitOfMeasureQuery,
  useUpdateUnitOfMeasureMutation,
} from '../../../slices/unitOfMeasureApiSlice';
import isValidUnit from '../../../validations/MeasureUnitsValidation';

const EditUnitOfMeasure = () => {
  const { id: unitOfMeasureId } = useParams();
  const [name_he, setName_he] = useState('');
  const [name_en, setName_en] = useState('');

  const {
    data: unitOfMeasure,
    isLoading,
    error,
    refetch,
  } = useGetUnitOfMeasureQuery(unitOfMeasureId);


  const [updateUnitOfMeasureMutation, { isLoading: loadingUpdate }] = useUpdateUnitOfMeasureMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (isValidUnit({ unitOfMeasureId, name_he, name_en })) {
      try {
        await updateUnitOfMeasureMutation({ unitOfMeasureId, name_he, name_en }).unwrap();
        toast.success('יחידת המידה עודכנה בהצלחה');
        refetch();
        navigate('/admin/unitsOfMeasure');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }

    } else {
      toast.error("שם אינו תקין");
    }

  };

  useEffect(() => {
    if (unitOfMeasure) {
      setName_he(unitOfMeasure.name_he);
      setName_en(unitOfMeasure.name_en);

    }
  }, [unitOfMeasure]);

  return (
    <>
      <Link to='/admin/unitsOfMeasure' className='btn btn-light my-3'>
        רשימת יחידות מידה
      </Link>
      <FormContainer>
        <h1>עריכת יחידת מידה</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Form onSubmit={submitHandler}>

            <Form.Group className='my-2' controlId='name_he'>
              <Form.Label>שם בעברית</Form.Label>
              <Form.Control
                type='name'
                placeholder='נא להכניס שם'
                value={name_he}
                onChange={(e) => setName_he(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='name_en'>
              <Form.Label>שם באנגלית</Form.Label>
              <Form.Control
                type='name'
                placeholder='Please enter a name'
                value={name_en}
                onChange={(e) => setName_en(e.target.value)}
              ></Form.Control>
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

export default EditUnitOfMeasure;
