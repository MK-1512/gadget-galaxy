import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Alert, Button, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { removeWishlistItem, clearWishlist } from '../redux/features/wishlistSlice';
import { addItemToCart, removeItemFromCart } from '../redux/features/cartSlice';
import { toast } from 'react-toastify';

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

const WishlistPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { items: wishlistItems } = useSelector(state => state.wishlist);
    const { items: cartItems } = useSelector(state => state.cart);
    const { isAuthenticated } = useSelector(state => state.auth);

    const handleProtectedAction = (actionCallback, message) => {
        if (!isAuthenticated) {
            toast.error(message);
            navigate('/login');
            return;
        }
        actionCallback();
    };

    const handleAddToCart = (product) => {
        handleProtectedAction(() => {
            dispatch(addItemToCart(product));
            toast.success(`${product.title} added to cart!`);
        }, "Please log in to add items to your cart.");
    };

    const handleBuyNow = (product) => {
        handleProtectedAction(() => {
            const isInCart = cartItems.some(item => item.id === product.id);
            if (!isInCart) {
                dispatch(addItemToCart(product));
            }
            navigate('/checkout');
        }, "Please log in to proceed to checkout.");
    };

    if (wishlistItems.length === 0) {
        return (
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <Container className="text-center mt-5 py-5">
                    <Alert variant="info">
                        <h2>Your Wishlist is Empty</h2>
                        <p>You have not added any items to your wishlist yet.</p>
                        <Link to="/products" className="btn btn-primary">Browse Products</Link>
                    </Alert>
                </Container>
            </motion.div>
        );
    }

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
                        <h1>My Wishlist</h1>
                    </Col>
                    <Col xs="auto">
                        <Button variant="danger" onClick={() => dispatch(clearWishlist())}>
                            Clear Wishlist
                        </Button>
                    </Col>
                </Row>

                <Row className="justify-content-center">
                    {wishlistItems.map(product => {
                        const productInCart = cartItems.find(item => item.id === product.id);
                        return (
                            <Col key={product.id} sm={12} md={6} lg={4} xl={3} className="mb-4">
                                <Card className="product-card h-100">
                                    <Link to={`/product/${product.id}`} className="text-decoration-none">
                                        <Card.Img
                                            variant="top"
                                            src={product.thumbnail}
                                            alt={product.title}
                                        />
                                    </Link>
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title>
                                            <Link to={`/product/${product.id}`} className="text-decoration-none text-light">
                                                {product.title}
                                            </Link>
                                        </Card.Title>
                                        {/* === REVERTED: Currency changed back to Dollars ($) === */}
                                        <Card.Text className="text-primary fw-bold h4">
                                            ${product.price}
                                        </Card.Text>
                                        <div className="mt-auto d-grid gap-2">
                                            {productInCart ? (
                                                <div className="quantity-controller">
                                                    <Button variant="outline-primary" onClick={() => dispatch(removeItemFromCart(product.id))}>-</Button>
                                                    <span className="quantity-display">{productInCart.quantity}</span>
                                                    <Button variant="outline-primary" onClick={() => handleAddToCart(product)}>+</Button>
                                                </div>
                                            ) : (
                                                <Button variant="outline-primary" onClick={() => handleAddToCart(product)}>Add to Cart</Button>
                                            )}
                                            <Button variant="primary" onClick={() => handleBuyNow(product)}>Buy Now</Button>
                                            <Button
                                                variant="outline-danger"
                                                onClick={() => dispatch(removeWishlistItem(product.id))}
                                            >
                                                Remove from Wishlist
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </motion.div>
    );
};

export default WishlistPage;