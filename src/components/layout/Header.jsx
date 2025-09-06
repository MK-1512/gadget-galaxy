import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Badge, Offcanvas, ListGroup, Image, Button, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { deleteItemFromCart } from '../../redux/features/cartSlice';
import { logout } from '../../redux/features/authSlice';
import { toast } from 'react-toastify';
import logo from '../../assets/images/logo.png'; 

const Header = () => {
  const [showCart, setShowCart] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: cartItems, totalQuantity: cartQuantity, totalAmount } = useSelector(state => state.cart);
  const { items: compareItems } = useSelector(state => state.compare);
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  const { isAuthenticated, user } = useSelector(state => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCloseCart = () => setShowCart(false);
  const handleShowCart = () => setShowCart(true);

  const handleLogout = () => {
      dispatch(logout());
      toast.info("You have been logged out.");
      navigate('/login');
  };

  return (
    <>
      <header>
        <Navbar 
          variant="dark" 
          expand="lg" 
          collapseOnSelect
          className={`navbar-gadget-galaxy ${isScrolled ? 'scrolled' : ''}`}
        >
          <Container>
            <LinkContainer to="/" > 
              <Navbar.Brand className="d-flex align-items-center">
                <img
                  src={logo}
                  width="60"
                  height="50"
                  className="d-inline-block align-top me-2"
                  alt="Gadget Galaxy logo"
                />
                <span>Gadget Galaxy</span>
              </Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto align-items-center">
                <LinkContainer to="/" end>
                  <Nav.Link active={location.pathname === '/'}><i className="fas fa-home me-2"></i>Home</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/products">
                  <Nav.Link active={location.pathname.startsWith('/products')}><i className="fas fa-box-open me-2"></i>Products</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/wishlist">
                  <Nav.Link active={location.pathname === '/wishlist'}><i className="fas fa-heart me-2"></i>Wishlist
                    {wishlistItems.length > 0 && (
                       <Badge pill bg="info" className="ms-1">{wishlistItems.length}</Badge>
                    )}
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/compare">
                  <Nav.Link active={location.pathname === '/compare'}><i className="fas fa-exchange-alt me-2"></i>Compare
                    {compareItems.length > 0 && (
                       <Badge pill bg="info" className="ms-1">{compareItems.length}</Badge>
                    )}
                  </Nav.Link>
                </LinkContainer>

                {/* === FIX: Re-added the missing Cart Nav.Link === */}
                <Nav.Link 
                  onClick={handleShowCart} 
                  className={`position-relative ${location.pathname.startsWith('/cart') ? 'active' : ''}`}
                >
                  <i className="fas fa-shopping-cart me-2"></i>Cart
                  {cartQuantity > 0 && (
                     <Badge pill bg="info" className="ms-1">{cartQuantity}</Badge>
                  )}
                </Nav.Link>

                {isAuthenticated && user ? (
                    <NavDropdown title={`Hi, ${user.username}`} id="user-nav-dropdown">
                        <LinkContainer to="/account">
                            <NavDropdown.Item>My Account</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={handleLogout}>
                            Logout
                        </NavDropdown.Item>
                    </NavDropdown>
                ) : (
                    <LinkContainer to="/login">
                      <Nav.Link active={location.pathname === '/login'}><i className="fas fa-user me-2"></i>Login</Nav.Link>
                    </LinkContainer>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      
      <Offcanvas show={showCart} onHide={handleCloseCart} placement="end" name="cart">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Your Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {cartItems.length > 0 ? (
            <>
              <ListGroup variant="flush">
                {cartItems.map(item => (
                  <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                    <Image src={item.thumbnail} rounded width={50} />
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">{item.title}</div>
                      <small>{item.quantity} x ${item.price.toFixed(2)}</small>
                    </div>
                    <Button variant="outline-danger" size="sm" onClick={() => dispatch(deleteItemFromCart(item.id))}>&times;</Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <div className="mt-4">
                <h5>Subtotal: ${totalAmount.toFixed(2)}</h5>
                <div className="d-grid gap-2 mt-3">
                    <Link to="/cart" className="btn btn-outline-primary" role="button" onClick={handleCloseCart}>View Full Cart</Link>
                    <Link to="/checkout" className="btn btn-primary" role="button" onClick={handleCloseCart}>Proceed to Checkout</Link>
                </div>
              </div>
            </>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;