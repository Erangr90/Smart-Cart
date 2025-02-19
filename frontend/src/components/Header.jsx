import { Navbar, Nav, Container, NavDropdown, Badge } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import logo from "../assets/logo.png";
import {
  useGetAllCategoriesQuery
} from "../slices/categoriesApiSlice";
import { useEffect, useState } from 'react';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [dbCategories, setDbCategories] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: categoryRefetch,
  } = useGetAllCategoriesQuery();

  useEffect(() => {
    if (categories) {
      setDbCategories(categories);
    }
  }, [categories]);

  const adminMenu = [
    {
      name: "משתמשים",
      route: "users"
    },
    {
      name: "קטגוריות",
      route: "categories"
    },
    {
      name: "חנויות",
      route: "stores"
    },
    {
      name: "רשתות",
      route: "chains"
    },
    {
      name: "מחירים",
      route: "prices"
    },
    {
      name: "מוצרים",
      route: "products/page/1"
    },
    {
      name: "מנויים",
      route: "subscriptions"
    },
    {
      name: "יחידות מידה",
      route: "unitsOfMeasure"
    }
  ];

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <header>
        <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <LinkContainer to="/">
                <Navbar.Brand className="ms-auto">
                  <img src={logo} alt="העגלה שלי" />
                  עגלה חכמה
                </Navbar.Brand>
              </LinkContainer>
              {cartItems && cartItems.length > 0 ? (
                <LinkContainer to="/cart">
                  <Navbar.Brand className="ms-auto">
                    {`העגלה שלך (${cartItems.length}) פריטים`}
                  </Navbar.Brand>
                </LinkContainer>
              ) : null}

              <Nav className="me-auto">
                {userInfo ? (
                  <>
                    <NavDropdown
                      title={userInfo.firstName + " " + userInfo.lastName}
                      id="username"
                    >
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>הפרופיל שלי</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Item onClick={logoutHandler}>
                        התנתקות
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
                ) : (
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <FaUser /> התחברות
                    </Nav.Link>
                  </LinkContainer>
                )}
                {userInfo && userInfo.isAdmin && (
                  <NavDropdown title="ניהול" id="adminMenu">
                    {
                      adminMenu.map((x, i) => (
                        <LinkContainer key={i} to={`/admin/${x.route}`}>
                          <NavDropdown.Item>{x.name}</NavDropdown.Item>
                        </LinkContainer>
                      ))
                    }
                  </NavDropdown>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      <header>
        <Navbar bg="light" variant="dark">
          <Container>
            {
              dbCategories && dbCategories.length > 0 &&
              dbCategories.map((cat) => (
                <Nav.Item key={cat._id}>
                  <LinkContainer to={`/category/${cat._id}`}>
                    <Nav.Link>
                      {cat.name}
                    </Nav.Link>
                  </LinkContainer>
                </Nav.Item>
              ))
            }
          </Container>
        </Navbar>
      </header>

    </>
  );
};

export default Header;
