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
import { useState, useEffect } from 'react';
import { useGetChainsQuery } from "../../slices/chainsApiSlice";
import { toast } from 'react-toastify';
import {
  useUserClicksAndSubtribeMutation,

} from "../../slices/usersApiSlice";
import { updateUserInfo } from "../../slices/userSlice";
import { useCartCalculationMutation } from "../../slices/cartsApiSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [chainsList, setChainsList] = useState([]);
  const [chainId, setChainId] = useState("");
  const [sum, setSum] = useState(0);
  const [store, setStore] = useState({});
  const [position, setPosition] = useState({ latitude: null, longitude: null });

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);




  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };


  const [updateUserClicks, { isLoading: loadingUpdate }] = useUserClicksAndSubtribeMutation();
  const [calcCart, { isLoading: loading }] = useCartCalculationMutation();

  const checkoutHandler = async () => {
    if (chainId != "") {
      // Check subscription
      if (!userInfo.subscription) {
        // Check time and limit number of clicks
        const userDate = new Date(userInfo.clicks.date);
        const today = new Date();
        const yearsDiffPerMonth = Math.abs(today.getFullYear() - userDate.getFullYear()) * 12;
        const MonthDiff = Math.abs((today.getMonth() + 1) - (userDate.getMonth() + 1));
        const totalDiff = Math.floor(yearsDiffPerMonth + MonthDiff);

        if (userInfo.clicks.numOfClicks >= 40 && totalDiff == 0) {
          toast.error("עברת את המכסה החודשית שלך");
        } else if (userInfo.clicks.numOfClicks >= 40 && totalDiff > 0) {
          const clicks = {
            date: new Date(),
            numOfClicks: 1
          };
          try {
            const res1 = await updateUserClicks({ ...userInfo, clicks, userId: userInfo._id }).unwrap();
            dispatch(updateUserInfo({ ...res1 }));
            const res2 = await calcCart({ chainId, cartItems, position }).unwrap();
            setSum(res2.sum);
            setStore(res2.store);
          } catch (err) {
            toast.error(err?.data?.message || err.error);
          }
        } else if (userInfo.clicks.numOfClicks < 40 && totalDiff == 0) {
          const clicks = {
            date: userInfo.clicks.date,
            numOfClicks: userInfo.clicks.numOfClicks + 1
          };
          try {
            const res1 = await updateUserClicks({ ...userInfo, clicks, userId: userInfo._id }).unwrap();
            dispatch(updateUserInfo({ ...res1 }));
            const res2 = await calcCart({ chainId, cartItems, position }).unwrap();
            setSum(res2.sum);
            setStore(res2.store);
          } catch (err) {
            toast.error(err?.data?.message || err.error);
          }
        }

      } else {
        try {
          const res2 = await calcCart({ chainId, cartItems, position }).unwrap();
          setSum(res2.sum);
          setStore(res2.store);
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }

      }
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
      <Col md={3}>
        <>
          <Form.Group className="my-2">
            <Form.Select
              onChange={(e) => setChainId(e.target.value)}
              className="my-2"
              value={chainId}
              disabled={cartItems.length == 0}
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
          {sum > 0 && cartItems.length > 0 &&
            <Card className="my-4">
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>
                    ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                    פריטים
                  </h2>
                  {Number(sum).toFixed(2)}{" "}
                  {`ש"ח`}
                </ListGroup.Item>
                <ListGroup.Item>
                  {store.name}{" - "}{Number(store.dis).toFixed(2)}{" "}{`ק"מ`}
                </ListGroup.Item>
              </ListGroup>
              <Button
                type='button'
                variant='light'
                className='btn-block'
                disabled={cartItems.length === 0}
              // onClick={checkoutHandler}
              >
                שמור עגלת פריטים
              </Button>
            </Card>
          }

        </>


      </Col>
      {/* <Col md={2} className='my-4'>

      </Col> */}
    </Row>
  );
};

export default Cart;
