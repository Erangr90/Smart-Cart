import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SearchBox = ({ route, pageNumber }) => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || '');
  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`${route}/search/${keyword.trim()}/page/${pageNumber}`);
    } else {
      navigate(`${route}`);
    }
  };

  return (
    <Form onSubmit={submitHandler} className='d-flex my-3' >
      <Form.Control
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder='חיפוש...'
        className='mr-sm-2 ml-sm-5'
      ></Form.Control>
      <Button type='submit' variant='outline-success' className='p-2 mx-2'>
        מצא
      </Button>
    </Form>
  );
};

export default SearchBox;