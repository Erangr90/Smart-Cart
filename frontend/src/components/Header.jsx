import { Navbar, Nav, Container, NavDropdown, Badge } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import logo from "../assets/logo.png";

const Header = () => {
  // const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const adminMenu = [
    {
    name:"משתמשים",
    route:"users"
    },
    {
      name:"קטגוריות",
      route:"categories"
    },
    {
      name:"חנויות",
      route:"stores"
    },
    {
      name:"רשתות",
      route:"chains"
    },
    {
      name:"הזמנות",
      route:"orders"
    },
    {
      name:"מחירים",
      route:"prices"
    },
    {
      name:"מוצרים",
      route:"products"
    },
    {
      name:"מנויים",
      route:"subscriptions"
    },
    {
      name:"יחידות מידה",
      route:"unitsOfMeasure"
    }
  ]

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
    <header>
      <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <LinkContainer to="/">
            <Navbar.Brand className="ms-auto">
              <img src={logo} alt="העגלה שלי" />
              העגלה שלי
            </Navbar.Brand>
          </LinkContainer>
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
                    adminMenu.map((x,i)=>(
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
  );
};

export default Header;
