import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  useGetCategoriesQuery,
} from "../slices/categoriesApiSlice";
import Loader from './Loader';
import Message from './Message';

const CategorySearchBox = ({ route }) => {
  const navigate = useNavigate();
  const { category: urlCategory, pageNumber, keyword } = useParams();
  const [category, setCategory] = useState(urlCategory || '');

  const { data, refetch, isLoading, error } = useGetCategoriesQuery({
    keyword,
    pageNumber,
  });

  useEffect(() => {
    refetch();
  }, [data]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (category) {
      navigate(`${route}/category/${category.trim()}/page/${pageNumber}`);
    } else {
      navigate(`${route}`);
    }
  };


  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant={"danger"}>{error}</Message>
      ) : (
        <Form onSubmit={submitHandler} className='d-flex my-3'>
          <Form.Select aria-label="בחירת קטגוריה" onChange={(e) => setCategory(e.target.value)}>
            <option>בחירת קטגוריה</option>
            {data.categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </Form.Select>
          <Button type='submit' variant='outline-success' className='p-2 mx-2'>
            מצא
          </Button>
        </Form>
      )}
    </div>
  );




};

export default CategorySearchBox;