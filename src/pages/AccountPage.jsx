import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile } from '../redux/features/authSlice';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const AccountPage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [shippingInfo, setShippingInfo] = useState({
        name: '', email: '', address: '', city: '', postalCode: '', country: ''
    });

    useEffect(() => {
        if (user?.shippingInfo) {
            setShippingInfo(user.shippingInfo);
        } else if (user) {
            setShippingInfo(prev => ({...prev, email: user.email}));
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // === NEW: Prevent invalid characters and limit length for postal code ===
        if (name === 'postalCode') {
            const numericValue = value.replace(/\D/g, ''); // Remove all non-digits
            setShippingInfo(prev => ({ ...prev, [name]: numericValue.slice(0, 6) }));
        } else {
            setShippingInfo(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // === NEW: Add a final validation check before dispatching ===
        if (shippingInfo.postalCode && shippingInfo.postalCode.length !== 6) {
            toast.error("Postal Code must be exactly 6 digits.");
            return;
        }

        dispatch(updateUserProfile({ shippingInfo }));
        toast.success("Profile updated successfully!");
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Container className="my-5 py-5">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <h1 className="mb-4">My Account</h1>
                        <Card className="product-card">
                            <Card.Body>
                                <Form onSubmit={handleSubmit}>
                                    <h3>Shipping Information</h3>
                                    <p className="text-muted small">This information will be used to pre-fill the checkout form.</p>
                                    
                                    <Form.Group className="mb-3" controlId="name">
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control type="text" name="name" value={shippingInfo.name} onChange={handleInputChange} required />
                                    </Form.Group>
                                     <Form.Group className="mb-3" controlId="email">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control type="email" name="email" value={shippingInfo.email} onChange={handleInputChange} required />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="address">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control type="text" name="address" value={shippingInfo.address} onChange={handleInputChange} required />
                                    </Form.Group>
                                    <Row>
                                        <Col sm={6}>
                                            <Form.Group className="mb-3" controlId="city">
                                                <Form.Label>City</Form.Label>
                                                <Form.Control type="text" name="city" value={shippingInfo.city} onChange={handleInputChange} required />
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-3" controlId="postalCode">
                                                <Form.Label>Postal Code (PIN)</Form.Label>
                                                {/* === CHANGE: Updated placeholder === */}
                                                <Form.Control type="text" name="postalCode" value={shippingInfo.postalCode} placeholder="6 digits" onChange={handleInputChange} required />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-3" controlId="country">
                                        <Form.Label>Country</Form.Label>
                                        <Form.Control type="text" name="country" value={shippingInfo.country} onChange={handleInputChange} required />
                                    </Form.Group>

                                    <Button type="submit" variant="primary" className="mt-2">Save Changes</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </motion.div>
    );
};

export default AccountPage;