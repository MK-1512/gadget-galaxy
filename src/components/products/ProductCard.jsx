import React from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, removeItemFromCart } from '../../redux/features/cartSlice';
import { toggleCompareItem } from '../../redux/features/compareSlice';
import { toggleWishlistItem } from '../../redux/features/wishlistSlice';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaHeart } from "react-icons/fa";

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // === 1. GET AUTHENTICATION STATUS FROM REDUX ===
    const { isAuthenticated } = useSelector(state => state.auth);

    const { items: cartItems } = useSelector(state => state.cart);
    const { items: compareItems } = useSelector(state => state.compare);
    const { items: wishlistItems } = useSelector(state => state.wishlist);

    const productInCart = cartItems.find(item => item.id === product.id);
    const isCompared = compareItems.some(item => item.id === product.id);
    const isWishlisted = wishlistItems.some(item => item.id === product.id);

    // === 2. ADD AUTHENTICATION CHECK TO ALL PROTECTED ACTIONS ===
    const handleAddToCart = () => {
        if (!isAuthenticated) {
            toast.error("Please log in to add items to your cart.");
            navigate('/login');
            return;
        }
        dispatch(addItemToCart(product));
        toast.success(`${product.title} added to cart!`);
    };
    
    // This handler is for the '+' button in the quantity controller
    const handleIncreaseQuantity = () => {
        if (!isAuthenticated) {
            toast.error("Please log in to modify your cart.");
            navigate('/login');
            return;
        }
        dispatch(addItemToCart(product));
    };

    const handleBuyNow = () => {
        if (!isAuthenticated) {
            toast.error("Please log in to proceed to checkout.");
            navigate('/login');
            return;
        }
        if (!productInCart) {
            dispatch(addItemToCart(product));
        }
        navigate('/checkout');
    };

    const handleToggleCompare = () => {
        if (!isCompared && compareItems.length >= 4) {
            toast.warning('You can only compare up to 4 items at a time.');
            return;
        }
        dispatch(toggleCompareItem(product));
    };

    const handleToggleWishlist = () => {
        if (!isAuthenticated) {
            toast.error("Please log in to manage your wishlist.");
            navigate('/login');
            return;
        }
        dispatch(toggleWishlistItem(product));
        if (!isWishlisted) {
            toast.info(`${product.title} added to wishlist!`);
        } else {
            toast.warning(`${product.title} removed from wishlist.`);
        }
    };

    return (
        <motion.div whileHover={{ y: -5 }} className="h-100">
            <Card className="product-card h-100">
                <Link to={`/product/${product.id}`}>
                    <Card.Img src={product.thumbnail} variant="top" />
                </Link>
                <Card.Body className="d-flex flex-column">
                    <Link to={`/product/${product.id}`} className="text-decoration-none text-light">
                        <Card.Title as="div" className="mb-2">
                            <strong>{product.title}</strong>
                        </Card.Title>
                    </Link>
                    
                    <Form.Check 
                        type="checkbox"
                        id={`compare-${product.id}`}
                        label="Compare"
                        className="mt-auto mb-2"
                        onChange={handleToggleCompare}
                        checked={isCompared}
                    />
                    
                    <Card.Text as="h3">${product.price}</Card.Text>

                    <div className="d-grid gap-2 d-sm-flex flex-wrap">
                        {productInCart ? (
                            <div className="quantity-controller w-100">
                                <Button 
                                    variant="outline-primary" 
                                    size="sm"
                                    onClick={() => dispatch(removeItemFromCart(product.id))}
                                >-</Button>
                                <span className="quantity-display">{productInCart.quantity}</span>
                                <Button 
                                    variant="outline-primary" 
                                    size="sm"
                                    onClick={handleIncreaseQuantity} // Use updated handler
                                >+</Button>
                            </div>
                        ) : (
                            <Button 
                                variant="outline-primary" 
                                onClick={handleAddToCart} 
                                className="w-100"
                            >
                                Add to Cart
                            </Button>
                        )}

                        <Button 
                            variant="primary" 
                            onClick={handleBuyNow} 
                            className="w-100"
                        >
                            Buy Now
                        </Button>
                        <Button 
                            variant={isWishlisted ? "danger" : "outline-danger"} 
                            onClick={handleToggleWishlist} 
                            className="w-100"
                        >
                            <FaHeart className="me-2" /> 
                            {isWishlisted ? "Remove Wishlist" : "Add to Wishlist"}
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </motion.div>
    );
};

export default ProductCard;