import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    Row,
    Col,
    Image,
    ListGroup,
    Card,
    Button,
    Form,
} from 'react-bootstrap';
import {
    useGetProductDetailsByUserQuery,
    useUpdateProductViewsMutation
} from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { addToCart } from '../../slices/cartSlice';

const ProductDetails = () => {
    const { id: productId } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [qty, setQty] = useState(1);

    const [updateProductViews, { isLoading: loadingUpdate }] = useUpdateProductViewsMutation();

    const addToCartHandler = async () => {
        dispatch(addToCart({ ...product, prices: [], qty }));
        try {
            if (!product.views) {
                await updateProductViews({ ...product, views: 1, productId: product._id }).unwrap();
            } else {
                await updateProductViews({ ...product, views: product.views + 1, productId: product._id }).unwrap();
            }
        } catch (err) {
            console.log(err?.data?.message || err.error);
        }
        navigate(-1);
    };

    const {
        data: product,
        isLoading,
        refetch,
        error,
    } = useGetProductDetailsByUserQuery(productId);




    return (
        <>
            <Link className='btn btn-light my-3' to='/'>
                דף הבית
            </Link>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <>
                    {console.log(product.prices)}
                    <Row>
                        <Col md={3}>
                            <Image style={{ width: '20rem' }} src={`/api/${product.image}`} fluid />
                        </Col>
                        <Col md={4}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    {product.description}{", "}{product.manufacturer}{"."}
                                    <br />
                                    {product.measure}{" "}{product.unitOfMeasure}{" "}
                                    {product.country}{", "}{product.country_code}{"."}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    {product.prices[0].number.toFixed(2)}{` ש"ח `}{product.prices[0].chain.name}
                                    <br />
                                    {product.prices[1].number.toFixed(2)}{` ש"ח `}{product.prices[1].chain.name}
                                    <br />
                                    {product.prices[2].number.toFixed(2)}{` ש"ח `}{product.prices[2].chain.name}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>כמות</Col>
                                            <Col>
                                                <Form.Control
                                                    as='select'
                                                    value={qty}
                                                    onChange={(e) => setQty(Number(e.target.value))}
                                                >
                                                    {[...Array(200).keys()].map(
                                                        (x) => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        )
                                                    )}
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Button
                                            className='btn-block'
                                            type='button'
                                            onClick={addToCartHandler}
                                        >
                                            הוסף לעגלה
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </>
    );
};

export default ProductDetails;
