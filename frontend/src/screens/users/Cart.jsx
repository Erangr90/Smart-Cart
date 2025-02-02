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
import { toast } from 'react-toastify';
import {
  useUpdateUserMutation,
  useGetUserDetailsQuery

} from "../../slices/usersApiSlice";
import { setCredentials } from '../../slices/authSlice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [chainsList, setChainsList] = useState([]);
  const [chainId, setChainId] = useState("");

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const { userInfo } = useSelector((state) => state.auth);




  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };
  console.log(userInfo.clicks);
  const userDate = new Date(userInfo.clicks.date);
  const today = new Date();
  const yearsDiffPerMonth = Math.abs(today.getFullYear() - userDate.getFullYear()) * 12;
  const MonthDiff = Math.abs((today.getMonth() + 1) - (userDate.getMonth() + 1));
  const totalDiff = Math.floor(yearsDiffPerMonth + MonthDiff);
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();
  const checkoutHandler = async () => {
    if (chainId != "") {
      // Add num of operations to the user
      // check 10 clicks per month
      if (userInfo.clicks.numOfClicks > 10 && totalDiff <= 1) {
        toast.error("עברת את המכסה החודשית שלך");
      } else {
        //update date and clicks
        const clicks = {
          date: new Date(),
          numOfClicks: userInfo.clicks.numOfClicks + 1
        };
        try {
          const res = await updateUser({ ...userInfo, clicks }).unwrap();
          dispatch(setCredentials({ ...res }));
          // toast.success('user updated successfully');
          // refetch();
          // navigate('/admin/userlist');
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
      }
      // Send chainId and Items to the backend cluc
      navigate(`/login?redirect=/calculation/chain/${chainId}`);
    } else {
      toast.error("נא לבחור רשת");
      navigate(`/cart`);
    }
  };

  // Chain
  const {
    data: chains,
    refetch: refetchChains,
    error: errorChains,
  } = useGetChainsQuery({
    keyword: "",
  });

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
        <>
          <Form.Group className="my-2">
            <Form.Select
              onChange={(e) => setChainId(e.target.value)}
              className="my-2"
              value={chainId}
            >
              <option defaultValue={""}>בחר רשת</option>
              {chains?.chains.map((x) => (
                <option value={x._id} key={x._id}>
                  {`${x.name}`}
                </option>
              ))}
            </Form.Select>
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
