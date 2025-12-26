import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/features/authSlice';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        try {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email);

            if (!user) {
                setError('Invalid email or password.');
                return;
            }

            if (user.password === password) {
                dispatch(loginSuccess({ email: user.email, username: user.username }));
                navigate('/');
            } else {
                setError('Invalid email or password.');
            }
        } catch (e) {
            setError('An error occurred during login. Please try again.');
            console.error(e);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
                <div className="w-100" style={{ maxWidth: '400px' }}>
                    <Card className="product-card">
                        <Card.Body>
                            <h2 className="text-center mb-4">Log In</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group id="email" className="mb-3">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                                </Form.Group>
                                <Form.Group id="password"  className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                                </Form.Group>
                                <Button className="w-100 mt-2" type="submit">Sign In</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    <div className="w-100 text-center mt-2">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </div>
                </div>
            </Container>
        </motion.div>
    );
};

export default LoginPage;