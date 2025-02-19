import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Image, Form, InputGroup } from "react-bootstrap";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../../components/Message";
import Loader from "../../../components/Loader";
import {
    useGetProductDetailsQuery,
} from "../../../slices/productsApiSlice";
import { toast } from "react-toastify";

const ProductPricesList = () => {
    const navigate = useNavigate();
    const { id: productId } = useParams();
    const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
    const [keyword, setKeyword] = useState('');
    const [prices, setPrices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pricesPerPage] = useState(5);

    const indexOfLastPrice = currentPage * pricesPerPage;
    const indexOfFirstPrice = indexOfLastPrice - pricesPerPage;
    const currentPrices = prices.slice(indexOfFirstPrice, indexOfLastPrice);
    const totalPages = Math.ceil(prices.length / pricesPerPage);




    useEffect(() => {
        if (product && product.prices) {
            setPrices(product.prices);
        }
        refetch();
    }, [product]);


    // Filter prices by keyword
    const submitHandler2 = (e) => {
        e.preventDefault();
        if (keyword.trim() !== "") {
            let temp = [];
            for (const price of prices) {
                if (price?.chain) {
                    if (price.chain.name.includes(keyword)) {
                        temp.push(price);
                        continue;
                    }
                }
                if (price?.store) {
                    if (price.store.name.includes(keyword)) {
                        temp.push(price);
                        continue;
                    }
                }
            }
            setPrices(temp);
        } else {
            setPrices(product.prices);
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
                    {error?.product?.message || error.error}
                </Message>
            ) : (
                <>
                    {
                        <h1>מחירי מוצר {product.name} </h1>
                    }
                    {
                        product.image && <Image style={{ width: '12rem' }} src={`/api/${product.image}`} rounded />
                    }
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
                                <th>חנות</th>
                                <th>רשת</th>

                                <th>מחיר</th>

                            </tr>
                        </thead>
                        <tbody>
                            {console.log(currentPrices[0])}
                            {product.prices && product.prices.length > 0 && currentPrices.map((price) => (
                                <tr key={price._id}>
                                    <td>{price.store ? price.store.name : ""}</td>
                                    <td>{price.chain ? price.chain.name : ""}</td>
                                    <td>{price.number}</td>
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

export default ProductPricesList;
