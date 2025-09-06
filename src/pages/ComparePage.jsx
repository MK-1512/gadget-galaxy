import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Table, Button, Image, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toggleCompareItem, clearCompareList } from '../redux/features/compareSlice';
import { addItemToCart, removeItemFromCart } from '../redux/features/cartSlice';
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

const ComparePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { items: compareItems } = useSelector(state => state.compare);
    const { items: cartItems } = useSelector(state => state.cart);
    const { isAuthenticated } = useSelector(state => state.auth);

    const handleClearCompare = () => {
        dispatch(clearCompareList());
    };

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

    const attributes = [
        { key: 'brand', label: 'Brand' },
        { key: 'price', label: 'Price' },
        { key: 'rating', label: 'Rating' },
        { key: 'stock', label: 'Stock' },
        { key: 'category', label: 'Category' },
    ];

    if (compareItems.length === 0) {
        return (
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <Container className="text-center mt-5 py-5">
                    <Alert variant="info">
                        <h2>Nothing to Compare</h2>
                        <p>You have not selected any items for comparison.</p>
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
                        <h1>Product Comparison</h1>
                    </Col>
                    <Col xs="auto">
                        <Button variant="danger" onClick={handleClearCompare}>
                            Clear All
                        </Button>
                    </Col>
                </Row>
                
                <Table striped bordered hover responsive variant="dark">
                    <thead>
                        <tr>
                            <th style={{ width: '15%' }}>Feature</th>
                            {compareItems.map(item => (
                                <th key={item.id} className="text-center">
                                    <Link to={`/product/${item.id}`}>
                                        <Image src={item.thumbnail} alt={item.title} thumbnail style={{ width: '100px', marginBottom: '10px' }} />
                                        <p>{item.title}</p>
                                    </Link>
                                    <Button variant="outline-danger" size="sm" onClick={() => dispatch(toggleCompareItem(item))}>
                                        Remove
                                    </Button>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {attributes.map(attr => (
                            <tr key={attr.key}>
                                <td><strong>{attr.label}</strong></td>
                                {compareItems.map(item => (
                                    <td key={item.id} className="text-center">
                                        {attr.key === 'price' ? `$${item[attr.key]}` : item[attr.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        
                        <tr>
                            <td><strong>Actions</strong></td>
                            {compareItems.map(item => {
                                const productInCart = cartItems.find(cartItem => cartItem.id === item.id);
                                return (
                                    <td key={item.id} className="text-center align-middle">
                                        <div className="d-flex flex-column gap-2">
                                            {productInCart ? (
                                                <div className="quantity-controller">
                                                    <Button size="sm" variant="outline-primary" onClick={() => dispatch(removeItemFromCart(item.id))}>-</Button>
                                                    <span className="quantity-display">{productInCart.quantity}</span>
                                                    <Button size="sm" variant="outline-primary" onClick={() => handleAddToCart(item)}>+</Button>
                                                </div>
                                            ) : (
                                                <Button size="sm" variant="outline-primary" onClick={() => handleAddToCart(item)}>Add to Cart</Button>
                                            )}
                                            <Button size="sm" variant="primary" onClick={() => handleBuyNow(item)}>Buy Now</Button>
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </Table>
            </Container>
        </motion.div>
    );
};

export default ComparePage;