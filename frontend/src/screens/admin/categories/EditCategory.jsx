// React packages
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LinkContainer } from "react-router-bootstrap";
// BootStrap
import { Form, Button, Table, Stack, InputGroup } from 'react-bootstrap';
import { FaTrash } from "react-icons/fa";

// Components
import Message from '../../../components/Message';
import Loader from '../../../components/Loader';
import FormContainer from '../../../components/FormContainer';
// Toastify
import { toast } from 'react-toastify';
// Api Slices
import {
  useGetCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteProductFromCategoryMutation,
  useAddProductToCategoryMutation
} from '../../../slices/categoriesApiSlice';
import {
  useGetProductsQuery,
} from "../../../slices/productsApiSlice";


const EditCategory = () => {
  // State variables
  const { id: categoryId } = useParams('');
  const [name, setName] = useState('');
  const [products, setProducts] = useState([]);
  const [searchProducts, setSearchProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [keyword, setKeyword] = useState('');
  const [addProdId, setAddProdId] = useState('');
  const navigate = useNavigate();

  // Api Slices
  const {
    data: category,
    isLoading,
    error,
    refetch,
  } = useGetCategoryQuery(categoryId);

  // Update category slice
  const [updateCategory, { isLoading: loadingUpdate }] = useUpdateCategoryMutation();

  // Fetch categories and set name and products
  useEffect(() => {
    if (category) {
      setName(category.name);
      setProducts(category.products);
    }
  }, [category]);

  // Submit update form Handler
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!name.trim()) {
        toast.error("שם הקטגוריה אינו תקין");
      } else {
        await updateCategory({ categoryId, name });
        toast.success('הקטגוריה עודכנה');
        refetch();
        navigate('/admin/categories');
      }

    } catch (err) {
      toast.error(err?.data?.message ? err.data.message : err?.error ? err.error : err);
    }
  };

  // Delete product
  const [deleteProductFromCategory] = useDeleteProductFromCategoryMutation();
  const deleteHandler = async (productId) => {
    if (window.confirm("האם אתה בטוח?")) {
      try {
        await deleteProductFromCategory({ categoryId, productId });
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  // Add product
  const [addProductToCategory] = useAddProductToCategoryMutation();
  const AddProductHandler = async () => {
    if (window.confirm("האם אתה בטוח?")) {
      try {
        await addProductToCategory({ categoryId, productId: addProdId });
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const shouldFetch = Boolean(search && search.trim().length > 0);
  const { data, refetch: refetchProducts } = useGetProductsQuery({ keyword: search }, { skip: !shouldFetch });

  useEffect(() => {
    if (shouldFetch && refetchProducts) {
      refetchProducts();
    }
    if (data?.products) {
      setSearchProducts(data.products);
    }
  }, [shouldFetch, data]);

  const submitHandler2 = (e) => {
    e.preventDefault();
    if (keyword.trim() !== "") {
      console.log(keyword);
      let temp = [];
      for (const prod of products) {
        if (prod.name.includes(keyword) || prod.manufacturer.includes(keyword) || prod.barcode.includes(keyword) || prod.description.includes(keyword)) {
          temp.push(prod);
        }
      }
      setProducts(temp);
    } else {
      setProducts(category.products);
    }
  };

  return (
    <>
      <Link to='/admin/categories' className='btn btn-light my-3'>
        רשימת קטגוריות
      </Link>
      <FormContainer>
        <h1>עריכת קטגוריה {isLoading ? '...' : category?.name}</h1>
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
              <Form.Label>שם הקטגוריה</Form.Label>
              <Form.Control
                type='text'
                placeholder='נא להכניס שם'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button type='submit' variant='primary'>
              עדכון
            </Button>
            <InputGroup className='my-3'>
              <Form.Control
                type='text'
                name='q'
                onChange={(e) => setKeyword(e.target.value)}
                value={keyword}
                placeholder='חיפוש...'
                className='mr-sm-2 ml-sm-5'
              />
              <Button onClick={submitHandler2} variant='outline-success' className='p-2 mx-2'>
                מצא
              </Button>
            </InputGroup>
            {products && products.length > 0 ? (
              <Form.Group className='my-2' controlId='productsList'>
                <Form.Label>רשימת מוצרים</Form.Label>
                <Table striped bordered hover responsive className="table-sm">
                  <thead>
                    <tr>
                      <th>שם</th>
                      <th>תיאור</th>
                      <th>יצרן</th>
                      <th>מדינה</th>
                      <th>ברקוד</th>
                      <th>כמות</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>{product.manufacturer}</td>
                        <td>{product.country + " " + product.country_code}</td>
                        <td>{product.barcode}</td>
                        <td>{product.measure + " " + product.unitOfMeasure}</td>
                        <td>
                          <Button
                            variant="danger"
                            className="btn-sm"
                            onClick={() => deleteHandler(product._id)}
                          >
                            <FaTrash style={{ color: "white" }} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Form.Group>
            ) : null}
          </Form>
        )}
      </FormContainer>
      <FormContainer>
        <Stack gap={3}>
          <Form>
            <Form.Group className='my-2' controlId='addProduct'>
              <Form.Label>הוספת מוצר</Form.Label>
              <Form.Control
                type='text'
                placeholder='חיפוש מוצר'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Form>
          <Form.Select
            onChange={(e) => setAddProdId(e.target.value)}
            value={addProdId}
            aria-label="Default select example">
            <option>בחר מוצר</option>
            {searchProducts.map((prod) => (
              <option key={prod._id} value={prod._id}>
                {prod.name + " - " + prod.description + " - " + prod.manufacturer + " - " + prod.barcode}
              </option>
            ))}
          </Form.Select>
        </Stack>
        <Button className="my-3" variant='primary' onClick={AddProductHandler}>
          הוספה
        </Button>
      </FormContainer>
    </>
  );
};

export default EditCategory;
