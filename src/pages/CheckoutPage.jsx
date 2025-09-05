import React, { useState, useEffect } from 'react';
import { Container, Alert, Button, Row, Col, Form, Card, ListGroup, Nav } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { clearCart } from '../redux/features/cartSlice';
import { updateUserProfile } from '../redux/features/authSlice';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import qrCodeImage from '../assets/images/qr-code.png';

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

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector(state => state.auth);
    const { items: cartItems, totalAmount } = useSelector(state => state.cart);

    const [orderStatus, setOrderStatus] = useState('form');
    const [placedOrderData, setPlacedOrderData] = useState(null);
    const [formData, setFormData] = useState({
        name: '', email: '', address: '', city: '', postalCode: '', country: '',
        cardName: '', cardNumber: '', expiry: '', cvv: ''
    });
    const [errors, setErrors] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [saveCard, setSaveCard] = useState(false);

    // Pre-fill forms with the user's saved info
    useEffect(() => {
        if (user) {
            const initialFormData = {
                name: user.shippingInfo?.name || '',
                email: user.shippingInfo?.email || user.email || '',
                address: user.shippingInfo?.address || '',
                city: user.shippingInfo?.city || '',
                postalCode: user.shippingInfo?.postalCode || '',
                country: user.shippingInfo?.country || '',
                cardName: user.paymentInfo?.cardName || '',
                cardNumber: user.paymentInfo?.cardNumberMasked || '',
                expiry: user.paymentInfo?.expiry || '',
                cvv: '',
            };
            setFormData(initialFormData);
        }
    }, [user]);

    // Redirect if cart is empty
    useEffect(() => {
        if (cartItems.length === 0 && orderStatus === 'form') {
            navigate('/products');
        }
    }, [cartItems, orderStatus, navigate]);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'cardNumber') {
            formattedValue = value.replace(/\D/g, '').match(/.{1,4}/g)?.join(' ').substr(0, 19) || '';
        }

        if (name === 'expiry') {
            formattedValue = value.replace(/\D/g, '');
            if (formattedValue.length > 2) {
                formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
            }
        }

        if (name === 'postalCode') {
            formattedValue = value.replace(/\D/g, '').slice(0, 6); // only numbers, max 6 digits
        }

        setFormData(prev => ({ ...prev, [name]: formattedValue }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };
    
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Full Name is required.';
        if (!formData.email) newErrors.email = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email address is invalid.';
        if (!formData.address) newErrors.address = 'Address is required.';
        if (!formData.city) newErrors.city = 'City is required.';
        if (!formData.postalCode) newErrors.postalCode = 'Postal Code is required.';
        else if (!/^\d{6}$/.test(formData.postalCode)) newErrors.postalCode = 'Postal Code must be 6 digits.';
        if (!formData.country) newErrors.country = 'Country is required.';
        if (!formData.cardName) newErrors.cardName = 'Name on Card is required.';
        const cardNumberDigits = formData.cardNumber.replace(/\s/g, '');
        if (!cardNumberDigits) newErrors.cardNumber = 'Card Number is required.';
        else if (cardNumberDigits.length !== 16) newErrors.cardNumber = 'Card Number must be 16 digits.';
        if (!formData.expiry) newErrors.expiry = 'Expiry Date is required.';
        else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) newErrors.expiry = 'Expiry Date must be in MM/YY format.';
        else {
            const [month, year] = formData.expiry.split('/');
            const expiryDate = new Date(`20${year}`, month - 1);
            const now = new Date();
            now.setMonth(now.getMonth() -1);
            if (expiryDate < now) newErrors.expiry = 'Card has expired.';
        }
        if (!formData.cvv) newErrors.cvv = 'CVV is required.';
        else if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = 'CVV must be 3 or 4 digits.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        let isValid = true;
        if (paymentMethod === 'card') {
            isValid = validateForm();
        }
        if (isValid) {
            const orderData = { items: [...cartItems], total: totalAmount, customer: { ...formData }, paymentMethod };
            setPlacedOrderData(orderData);
            if (paymentMethod === 'card' && saveCard) {
                const cardInfoToSave = {
                    cardName: formData.cardName,
                    expiry: formData.expiry,
                    cardNumberMasked: `**** **** **** ${formData.cardNumber.slice(-4)}`,
                };
                dispatch(updateUserProfile({ paymentInfo: cardInfoToSave }));
            }
            dispatch(clearCart());
            setOrderStatus('success');
        }
    };
    
    const handleDownloadInvoice = () => {
        if (!placedOrderData) { return; }
        const { items, total, customer } = placedOrderData;
        const doc = new jsPDF();
        const orderId = Math.floor(100000 + Math.random() * 900000);
        const orderDate = new Date().toLocaleDateString('en-GB');
        doc.setFontSize(22);
        doc.text("Gadget Galaxy Invoice", 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Order ID: ${orderId}`, 14, 35);
        doc.text(`Date: ${orderDate}`, 14, 42);
        doc.setFontSize(14);
        doc.text("Bill To:", 14, 55);
        doc.setFontSize(12);
        doc.text(customer.name, 14, 62);
        doc.text(customer.address, 14, 69);
        doc.text(`${customer.city}, ${customer.postalCode}`, 14, 76);
        doc.text(customer.country, 14, 83);
        const tableColumn = ["Item", "Quantity", "Price", "Total"];
        const tableRows = items.map(item => [item.title, item.quantity, `$${item.price.toFixed(2)}`, `$${(item.price * item.quantity).toFixed(2)}`]);
        autoTable(doc, {
            startY: 95,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            didDrawPage: data => {
                const finalY = data.cursor.y;
                doc.setFontSize(14);
                doc.text(`Total: $${total.toFixed(2)}`, 14, finalY + 15);
                doc.setFontSize(10);
                doc.text("Thank you for your purchase!", 105, finalY + 30, { align: 'center' });
            }
        });
        doc.save(`invoice-${orderId}.pdf`);
    };

    if (orderStatus === 'success') {
        return (
             <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <Container className="mt-5 py-5 text-center">
                    <Alert variant="success">
                        <Alert.Heading><h2>Order Placed Successfully!</h2></Alert.Heading>
                        <p>Thank you for your purchase. Your order is being processed.</p>
                        <hr />
                        <p className="mb-0">You can now download your invoice.</p>
                    </Alert>
                    <Button variant="primary" size="lg" className="m-2" onClick={handleDownloadInvoice}>
                        Download Invoice
                    </Button>
                    <Link to="/" className="btn btn-outline-primary btn-lg m-2">
                        Continue Shopping
                    </Link>
                </Container>
            </motion.div>
        );
    }
    
    return (
        <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <Container className="mt-5 py-5">
                 <h1 className="mb-4">Checkout</h1>
                <Form noValidate onSubmit={handlePlaceOrder}>
                    <Row>
                        <Col md={7}>
                            <Card className="p-4 mb-4 product-card">
                                <h3>Shipping Information</h3>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control type="text" name="name" value={formData.name} placeholder="John Doe" required onChange={handleInputChange} isInvalid={!!errors.name} />
                                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control type="email" name="email" value={formData.email} placeholder="john.doe@example.com" required onChange={handleInputChange} isInvalid={!!errors.email} />
                                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="address">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control type="text" name="address" value={formData.address} placeholder="1234 Main St" required onChange={handleInputChange} isInvalid={!!errors.address} />
                                    <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                                </Form.Group>
                                <Row>
                                    <Col sm={6}>
                                        <Form.Group className="mb-3" controlId="city">
                                            <Form.Label>City</Form.Label>
                                            <Form.Control type="text" name="city" value={formData.city} placeholder="New York" required onChange={handleInputChange} isInvalid={!!errors.city} />
                                            <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-3" controlId="postalCode">
                                            <Form.Label>Postal Code</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                name="postalCode" 
                                                value={formData.postalCode} 
                                                placeholder="6 digits" 
                                                required 
                                                onChange={handleInputChange} 
                                                isInvalid={!!errors.postalCode} 
                                                maxLength={6}
                                                pattern="\d{6}"
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.postalCode}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3" controlId="country">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control type="text" name="country" value={formData.country} placeholder="United States" required onChange={handleInputChange} isInvalid={!!errors.country} />
                                    <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
                                </Form.Group>
                            </Card>

                            <Card className="p-4 product-card">
                                <h3>Payment Method</h3>
                                <Nav variant="pills" activeKey={paymentMethod} onSelect={(k) => setPaymentMethod(k)} className="mb-3">
                                    <Nav.Item><Nav.Link eventKey="card">Credit Card</Nav.Link></Nav.Item>
                                    <Nav.Item><Nav.Link eventKey="cod">Cash on Delivery</Nav.Link></Nav.Item>
                                    <Nav.Item><Nav.Link eventKey="gpay">GPay</Nav.Link></Nav.Item>
                                </Nav>
                                
                                {paymentMethod === 'card' && (
                                    <div>
                                        <Form.Group className="mb-3" controlId="cardName">
                                            <Form.Label>Name on Card</Form.Label>
                                            <Form.Control type="text" name="cardName" value={formData.cardName} placeholder="John M Doe" required onChange={handleInputChange} isInvalid={!!errors.cardName} />
                                            <Form.Control.Feedback type="invalid">{errors.cardName}</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="cardNumber">
                                            <Form.Label>Card Number</Form.Label>
                                            <Form.Control type="text" name="cardNumber" value={formData.cardNumber} placeholder="xxxx xxxx xxxx xxxx" required onChange={handleInputChange} isInvalid={!!errors.cardNumber} />
                                            <Form.Control.Feedback type="invalid">{errors.cardNumber}</Form.Control.Feedback>
                                        </Form.Group>
                                        <Row>
                                            <Col sm={6}>
                                                <Form.Group className="mb-3" controlId="expiry">
                                                    <Form.Label>Expiry Date</Form.Label>
                                                    <Form.Control type="text" name="expiry" value={formData.expiry} placeholder="MM/YY" required onChange={handleInputChange} isInvalid={!!errors.expiry} />
                                                    <Form.Control.Feedback type="invalid">{errors.expiry}</Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
                                            <Col sm={6}>
                                                <Form.Group className="mb-3" controlId="cvv">
                                                    <Form.Label>CVV</Form.Label>
                                                    <Form.Control type="text" name="cvv" value={formData.cvv} placeholder="123" required onChange={handleInputChange} isInvalid={!!errors.cvv} />
                                                    <Form.Control.Feedback type="invalid">{errors.cvv}</Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Form.Check 
                                            type="checkbox"
                                            id="save-card"
                                            label="Save this card for future payments"
                                            checked={saveCard}
                                            onChange={(e) => setSaveCard(e.target.checked)}
                                            className="mt-3"
                                        />
                                    </div>
                                )}
                                {paymentMethod === 'cod' && (
                                    <Alert variant="info">You have selected Cash on Delivery. Please pay the delivery agent upon receiving your order.</Alert>
                                )}
                                {paymentMethod === 'gpay' && (
                                    <div className="text-center">
                                        <p>Scan the QR code below with your GPay app to complete the payment.</p>
                                        <img src={qrCodeImage} alt="GPay QR Code" style={{width: '200px', borderRadius: '8px'}} />
                                    </div>
                                )}
                            </Card>
                        </Col>

                        <Col md={5}>
                            <Card className="product-card" style={{position: 'sticky', top: '100px'}}>
                                <Card.Body>
                                    <Card.Title as="h3" className="mb-3">Order Summary</Card.Title>
                                    <ListGroup variant="flush">
                                        {cartItems.map(item => (
                                            <ListGroup.Item key={item.id} className="d-flex justify-content-between bg-transparent border-secondary text-light">
                                                <span>{item.title} (x{item.quantity})</span>
                                                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                                            </ListGroup.Item>
                                        ))}
                                        <ListGroup.Item className="d-flex justify-content-between bg-transparent text-light mt-3">
                                            <h4>Total</h4>
                                            <h4>${totalAmount.toFixed(2)}</h4>
                                        </ListGroup.Item>
                                    </ListGroup>
                                    <div className="d-grid mt-4">
                                        <Button variant="primary" type="submit" size="lg">Place Your Order</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </motion.div>
    );
};

export default CheckoutPage;
