import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Row, Col, ListGroup, Image, Button, Card, Alert } from 'react-bootstrap';
import { addItemToCart, removeItemFromCart, deleteItemFromCart, clearCart } from '../redux/features/cartSlice';
import { motion } from 'framer-motion';

const pageVariants = {
    initial: { opacity: 0, scale: 0.99 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 0.99 },
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
};

const CartPage = () => {
    const dispatch = useDispatch();
    const { items: cartItems, totalAmount, totalQuantity } = useSelector(state => state.cart);

    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to remove all items from your cart?')) {
            dispatch(clearCart());
        }
    };

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            <Container className="mt-5 py-5">
                <Row className="justify-content-between align-items-center mb-4">
                    <Col>
                        <h1>Shopping Cart</h1>
                    </Col>
                    {cartItems.length > 0 && (
                        <Col xs="auto">
                            <Button variant="danger" onClick={handleClearCart}>
                                Clear Cart
                            </Button>
                        </Col>
                    )}
                </Row>

                {cartItems.length === 0 ? (
                    <div className="text-center">
                        <Alert variant="info">
                            <h2>Your Shopping Cart is Empty</h2>
                            <p>Looks like you haven't added anything to your cart yet.</p>
                            <Link to="/products" className="btn btn-primary">Browse Products</Link>
                        </Alert>
                    </div>
                ) : (
                    <Row>
                        <Col md={8}>
                            <ListGroup variant="flush">
                                {cartItems.map(item => (
                                    <ListGroup.Item key={item.id} className="mb-3 bg-transparent text-light">
                                        <Row className="align-items-center">
                                            <Col xs={3} sm={2}><Image src={item.thumbnail} alt={item.title} fluid rounded /></Col>
                                            <Col xs={9} sm={3}><Link to={`/product/${item.id}`}>{item.title}</Link></Col>
                                            <Col xs={4} sm={2} className="text-start text-sm-center mt-2 mt-sm-0">${(item.price * item.quantity).toFixed(2)}</Col>
                                            <Col xs={5} sm={3} className="d-flex align-items-center justify-content-start justify-content-sm-center mt-2 mt-sm-0">
                                                <Button size="sm" variant="outline-light" onClick={() => dispatch(removeItemFromCart(item.id))}>-</Button>
                                                <span className="mx-3 fw-bold">{item.quantity}</span>
                                                <Button size="sm" variant="outline-light" onClick={() => dispatch(addItemToCart(item))}>+</Button>
                                            </Col>
                                            <Col xs={3} sm={2} className="text-end mt-2 mt-sm-0">
                                                <Button variant="danger" size="sm" onClick={() => dispatch(deleteItemFromCart(item.id))}>
                                                    Remove
                                                </Button>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>
                        <Col md={4} className="mt-4 mt-md-0">
                            <Card className="product-card">
                                <Card.Body>
                                    <Card.Title as="h2" className="mb-3">Order Summary</Card.Title>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item className="d-flex justify-content-between bg-transparent border-secondary text-light">
                                            <span>Items ({totalQuantity})</span>
                                            <strong>${totalAmount.toFixed(2)}</strong>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="bg-transparent border-secondary text-light">
                                            {/* You can add Shipping, Tax, etc. here */}
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between bg-transparent text-light">
                                            <h4>Total</h4>
                                            <h4>${totalAmount.toFixed(2)}</h4>
                                        </ListGroup.Item>
                                    </ListGroup>
                                    <div className="d-grid mt-3">
                                        <Link to="/checkout" className="btn btn-primary btn-lg" role="button">
                                            Proceed To Checkout
                                        </Link>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>
        </motion.div>
    );
};

export default CartPage;