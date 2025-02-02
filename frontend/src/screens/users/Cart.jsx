import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../../components/Message';
import { addToCart, removeFromCart } from '../../slices/cartSlice';
import { useState } from 'react';
import { useGetChainsQuery } from "../../slices/chainsApiSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [chainsList, setChainsList] = useState([]);
  const [chainId, setChainId] = useState("");
  const [chainQuery, setChainQuery] = useState("");

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;


  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate(`/login?redirect=/calculation/chain/${chainId}`);
  };

  // Chain
  const {
    data: chains,
    refetch: refetchChains,
    error: errorChains,
  } = useGetChainsQuery({
    keyword: chainQuery,
  });

  const selectChainHandler = (e) => {
    const obj = JSON.parse(e);
    setChainId(obj._id);
    setChainQuery(
      `${obj.name}`
    );
  };

  console.log(cartItems);

  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: '20px' }}>העגלה שלי</h1>
        {cartItems.length === 0 ? (
          <Message>
            העגלה שלך ריקה <Link to='/'>לדף הבית</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src={`/api/${item.image}`} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={2}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  {/* <Col md={2}>${item.price}</Col> */}
                  <Col md={2}>
                    <Form.Control
                      as='select'
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(200).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={2}>

        {/* Chains */}

        <>
          <Form.Group className="my-2" controlId="chainQuery">
            <Form.Label>רשת</Form.Label>
            <Form.Control
              type="name"
              value={chainQuery}
              onChange={(e) => setChainQuery(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="my-2">
            {chains && chains.chains.length > 0 && chainQuery.length > 1 ? (
              <Form.Select
                onChange={(e) => selectChainHandler(e.target.value)}
                className="my-2"
              >
                <option defaultValue={""}>בחר רשת</option>
                {chains.chains.map((x) => (
                  <option value={JSON.stringify(x)} key={x._id}>
                    {`${x.name}`}
                  </option>
                ))}
              </Form.Select>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Button
              type='button'
              className='btn-block'
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              חישוב העגלה
            </Button>
          </Form.Group>
        </>


      </Col>
      {/* <Col md={2} className='my-4'>
        <Card>
        <ListGroup variant='flush'>
        <ListGroup.Item>
              <h2>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h2>
              $
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
        <ListGroup.Item>

        </ListGroup.Item>
        </ListGroup>
        </Card>
      </Col> */}
    </Row>
  );
};

export default Cart;
