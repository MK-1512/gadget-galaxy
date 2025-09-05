import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Image, ListGroup, Card, Button, Alert } from 'react-bootstrap';
import { fetchProductById } from '../redux/features/productsSlice';
import { addItemToCart, removeItemFromCart } from '../redux/features/cartSlice';
import { toggleWishlistItem } from '../redux/features/wishlistSlice';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';
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

const ProductDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { selectedProduct: product, status, error } = useSelector(state => state.products);
    const { items: cartItems } = useSelector(state => state.cart);
    const { items: wishlistItems } = useSelector(state => state.wishlist);
    const { isAuthenticated } = useSelector(state => state.auth);

    const productInCart = cartItems.find(item => item?.id === product?.id);
    const isInWishlist = wishlistItems.some(item => item?.id === product?.id);

    useEffect(() => {
        dispatch(fetchProductById(id));
    }, [id, dispatch]);

    const handleProtectedAction = (actionCallback, message) => {
        if (!isAuthenticated) {
            toast.error(message);
            navigate('/login');
            return;
        }
        actionCallback();
    };

    const handleAddToCart = () => {
        handleProtectedAction(() => {
            dispatch(addItemToCart(product));
            toast.success(`${product.title} added to cart!`);
        }, "Please log in to add items to your cart.");
    };

    const handleToggleWishlist = () => {
        handleProtectedAction(() => {
            dispatch(toggleWishlistItem(product));
            if (!isInWishlist) {
                toast.info(`${product.title} added to wishlist!`);
            } else {
                toast.warning(`${product.title} removed from wishlist.`);
            }
        }, "Please log in to manage your wishlist.");
    };

    const handleBuyNow = () => {
        handleProtectedAction(() => {
            if (!productInCart) {
                dispatch(addItemToCart(product));
            }
            navigate('/checkout');
        }, "Please log in to proceed to checkout.");
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
                <div className="d-flex justify-content-end mb-3">
                    <Link className="btn btn-outline-primary" to="/products">Go Back To Products</Link>
                </div>

                {status === 'loading' && <Loader />}
                {status === 'failed' && <Alert variant="danger">{error}</Alert>}
                {status === 'succeeded' && product && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <Row>
                            <Col md={6} className="mb-4">
                                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                                    <Image src={product.thumbnail} alt={product.title} fluid rounded />
                                </motion.div>
                            </Col>
                            <Col md={6}>
                                <ListGroup variant="flush">
                                    <ListGroup.Item className="bg-transparent text-light border-secondary"><h3>{product.title}</h3></ListGroup.Item>
                                    <ListGroup.Item className="bg-transparent text-light border-secondary"><p className="text-muted">{product.brand}</p></ListGroup.Item>
                                    {/* === REVERTED: Currency changed back to Dollars ($) === */}
                                    <ListGroup.Item className="bg-transparent text-light border-secondary"><h4>${product.price}</h4></ListGroup.Item>
                                    <ListGroup.Item className="bg-transparent text-light border-secondary"><p>{product.description}</p></ListGroup.Item>
                                </ListGroup>
                                <Card className="mt-3 product-card">
                                    <ListGroup variant="flush">
                                        <ListGroup.Item className="bg-transparent text-light border-secondary">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h5>Status:</h5>
                                                {product.stock > 0 
                                                    ? <span className="text-success fw-bold">In Stock</span> 
                                                    : <span className="text-danger fw-bold">Out Of Stock</span>}
                                            </div>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="bg-transparent text-light border-secondary">
                                            <div className="d-grid gap-2">
                                                {productInCart ? (
                                                    <div className="quantity-controller">
                                                        <Button variant="outline-primary" onClick={() => dispatch(removeItemFromCart(product.id))}>-</Button>
                                                        <span className="quantity-display">{productInCart.quantity}</span>
                                                        <Button variant="outline-primary" onClick={handleAddToCart}>+</Button>
                                                    </div>
                                                ) : (
                                                    <Button onClick={handleAddToCart} type="button" disabled={product.stock === 0} variant="outline-primary">Add To Cart</Button>
                                                )}
                                                <Button onClick={handleBuyNow} type="button" disabled={product.stock === 0} variant="primary">Buy Now</Button>
                                                <Button variant={isInWishlist ? 'danger' : 'outline-danger'} onClick={handleToggleWishlist}>
                                                    {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                                </Button>
                                            </div>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            </Col>
                        </Row>
                    </motion.div>
                )}
            </Container>
        </motion.div>
    );
};

export default ProductDetailPage;