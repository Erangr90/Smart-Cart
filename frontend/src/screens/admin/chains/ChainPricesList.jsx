import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Image, Form, InputGroup } from "react-bootstrap";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../../components/Message";
import Loader from "../../../components/Loader";
import {
  useDeletePriceMutation,
} from "../../../slices/pricesApiSlice";
import {
  useGetChainQuery,
} from "../../../slices/chainsApiSlice";
import { toast } from "react-toastify";
import Paginate from "../../../components/Paginate";
import SearchBox from "../../../components/SearchBox";

const ChainPricesList = () => {
  const navigate = useNavigate();
  const { id: chainId } = useParams();
  const [keyword, setKeyword] = useState('');
  const [prices, setPrices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pricesPerPage] = useState(5);

  const indexOfLastPrice = currentPage * pricesPerPage;
  const indexOfFirstPrice = indexOfLastPrice - pricesPerPage;
  const currentPrices = prices.slice(indexOfFirstPrice, indexOfLastPrice);
  const totalPages = Math.ceil(prices.length / pricesPerPage);




  const { data: chain, isLoading, error, refetch } = useGetChainQuery(chainId);

  useEffect(() => {
    if (chain && chain.prices) {
      setPrices(chain.prices);
    }
    refetch();
  }, [chain]);

  const [deletePrice] = useDeletePriceMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("האם אתה בטוח?")) {
      try {
        await deletePrice(id);
        refetch();
      } catch (err) {
        toast.error(err?.chain?.message || err.error);
      }
    }
  };


  const createPriceHandler = async () => {
    if (window.confirm('האם אתה בטוח שאתה רוצה ליצור מחיר חדש?')) {
      try {
        navigate(`/admin/price/create`);
      } catch (err) {
        toast.error(err?.chain?.message || err.error);
      }
    }
  };

  // Filter prices by keyword
  const submitHandler2 = (e) => {
    e.preventDefault();
    if (keyword.trim() !== "") {
      let temp = [];
      for (const price of prices) {
        if (price.product.name.includes(keyword) || price.product.barcode.includes(keyword)) {
          temp.push(price);
          continue;
        }
        if (price.chain) {
          if (price.chain.name.includes(keyword)) {
            temp.push(price);
            continue;
          }
        }
        if (price.store) {
          if (price.store.name.includes(keyword)) {
            temp.push(price);
            continue;
          }
        }
      }
      setPrices(temp);
    } else {
      setPrices(chain.prices);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleKeywordChange = (e) => {
    const { value } = e.target;
    setKeyword(value || '');
  };


  return (
    <>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.chain?.message || error.error}
        </Message>
      ) : (
        <>
          <h1>מחירים ברשת {chain.name}</h1>
          {
            chain.image && <Image src={`/api/${chain.image}`} rounded style={{ width: '12rem' }} />
          }
          <div className="d-flex justify-content-between">
            <Button type='button' variant='warning' className='my-3' onClick={createPriceHandler}>
              צור מחיר חדש
            </Button>
          </div>
          <div>
            <Form>
              <InputGroup className='my-3'>
                <Form.Control
                  type='text'
                  name='q'
                  onChange={handleKeywordChange}
                  value={keyword}
                  placeholder='חיפוש...'
                  className='mr-sm-2 ml-sm-5'
                />
                <Button onClick={submitHandler2} variant='outline-success' className='p-2 mx-2'>
                  מצא
                </Button>
              </InputGroup>
            </Form>
          </div>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>מוצר</th>
                <th>רשת</th>
                <th>מחיר</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {chain.prices && chain.prices.length > 0 && currentPrices.map((price) => (
                <tr key={price._id}>
                  <td>{price.product.name + " - " + price.product.barcode}</td>
                  <td>{price.chain.name}</td>
                  <td>{price.number}</td>
                  <td>
                    <>
                      <LinkContainer
                        to={`/admin/price/${price._id}/edit`}
                        style={{ marginRight: "10px" }}
                      >
                        <Button variant="light" className="btn-sm mx-2">
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(price._id)}
                      >
                        <FaTrash style={{ color: "white" }} />
                      </Button>
                    </>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="pagination">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="mx-3"
            >
              הקודם
            </Button>
            <span>{` עמוד ${currentPage} מתוך ${totalPages} `}</span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="mx-3"
            >
              הבא
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default ChainPricesList;
