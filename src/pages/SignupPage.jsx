import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        
        try {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const existingUser = users.find(user => user.email === email);

            if (existingUser) {
                setError('An account with this email already exists.');
                return;
            }
            
            const newUser = { username, email, password };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            alert('Signup successful! Please log in.');
            navigate('/login');

        } catch (e) {
            setError('An error occurred during signup. Please try again.');
            console.error(e);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Container className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '80vh' }}>
                <div className="w-100" style={{ maxWidth: '400px' }}>
                    <Card className="product-card">
                        <Card.Body>
                            <h2 className="text-center mb-4">Sign Up</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group id="username" className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" required value={username} onChange={(e) => setUsername(e.target.value)} />
                                </Form.Group>
                                <Form.Group id="email" className="mb-3">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                                </Form.Group>
                                <Form.Group id="password"  className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                                </Form.Group>
                                <Form.Group id="confirm-password"  className="mb-3">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                </Form.Group>
                                <Button className="w-100 mt-2" type="submit">Sign Up</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    <div className="w-100 text-center mt-2">
                        Already have an account? <Link to="/login">Log In</Link>
                    </div>
                </div>
            </Container>
        </motion.div>
    );
};

export default SignupPage;