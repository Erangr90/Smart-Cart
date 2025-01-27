import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Image } from 'react-bootstrap';
import Message from '../../../components/Message';
import Loader from '../../../components/Loader';
import FormContainer from '../../../components/FormContainer';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from '../../../slices/productsApiSlice';
import {
  useUploadImgMutation
} from "../../../slices/filesApiSlice";
import isValidProduct from '../../../validations/ProductValidation';

const EditProduct = () => {
  const { id: productId } = useParams();
  const [name, setName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [category, setCategory] = useState({});
  const [description, setDescription] = useState('');
  const [barcode, setBarcode] = useState('');
  const [unitOfMeasure, setUnitOfMeasure] = useState('');
  const [measure, seMeasure] = useState(0);
  const [country, setCountry] = useState('');
  const [country_code, setCountry_code] = useState('');
  const [image, setImage] = useState('');


  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [uploadImg, { isLoading: loadingUpload }] = useUploadImgMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const valid = isValidProduct({ productId, name, manufacturer, category, description, barcode, unitOfMeasure, measure, country, country_code, image });
    if (valid == true) {
      try {
        await updateProduct({ productId, name, manufacturer, category, description, barcode, unitOfMeasure, measure, country, country_code, image }).unwrap();
        toast.success('product updated successfully');
        refetch();
        navigate('/admin/products');
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
    if (product) {
      setName(product.name);
      setManufacturer(product.manufacturer);
      setCategory(product.category.name);
      setDescription(product.description);
      setBarcode(product.barcode);
      setUnitOfMeasure(product.unitOfMeasure);
      seMeasure(product.measure);
      setImage(product.image);
      setCountry(product.country);
      setCountry_code(product.country_code);
    }
  }, [product]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadImg(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to='/admin/products' className='btn btn-light my-3'>
        רשימת מוצרים
      </Link>
      <FormContainer>
        <h1>עריכת מוצר : {name}</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Form onSubmit={submitHandler}>

            <Form.Group controlId='image'>

              <Image src={`/api/${image}`} rounded className="w-50 m-3 d-grid gap-2" />
              <Form.Label>תמונה</Form.Label>

              {/* <Form.Control
                type='text'
                placeholder='הכנס כתובת'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control> */}
              <Form.Control
                label='Choose File'
                onChange={uploadFileHandler}
                type='file'
              ></Form.Control>
              {loadingUpload && <Loader />}
            </Form.Group>

            <Form.Group className='my-2' controlId='category'>
              <Form.Label>קטגוריה</Form.Label>
              <Form.Control
                type='name'
                value={category}
                readOnly={true}
              ></Form.Control>
            </Form.Group>


            <Form.Group className='my-2' controlId='name'>
              <Form.Label>שם</Form.Label>
              <Form.Control
                type='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='description'>
              <Form.Label>תיאור</Form.Label>
              <Form.Control
                type='name'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='manufacturer'>
              <Form.Label>יצרן</Form.Label>
              <Form.Control
                type='name'
                onChange={(e) => setManufacturer(e.target.value)}
              ></Form.Control>
            </Form.Group>


            <Form.Group className='my-2' controlId='country'>
              <Form.Label>מדינה</Form.Label>
              <Form.Control
                type='name'
                value={country}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>


            <Form.Group className='my-2' controlId='country_code'>
              <Form.Label>קוד מדינה</Form.Label>
              <Form.Control
                type='name'
                value={country_code}
                onChange={(e) => setCountry_code(e.target.value)}
              ></Form.Control>
            </Form.Group>


            <Form.Group className='my-2' controlId='barcode'>
              <Form.Label>ברקוד</Form.Label>
              <Form.Control
                type='name'
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='measure'>
              <Form.Label>כמות</Form.Label>
              <Form.Control
                type='name'
                value={measure}
                onChange={(e) => seMeasure(e.target.value)}
              ></Form.Control>
            </Form.Group>


            <Form.Group className='my-2' controlId='unitOfMeasure'>
              <Form.Label>יחידת מידה</Form.Label>
              <Form.Control
                type='name'
                value={unitOfMeasure}
                onChange={(e) => setUnitOfMeasure(e.target.value)}
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

export default EditProduct;
