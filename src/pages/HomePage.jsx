import React, { useEffect, useMemo } from 'react';
import { Container, Row, Col, Alert, Carousel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';
import Hero3D from '../components/common/Hero3D';
import AnimatedSection from '../components/common/AnimatedSection';

const pageVariants = {
    initial: { opacity: 0, x: "-100vw" },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "100vw" },
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
};

const HomePage = () => {
    const { items: products, status, error } = useSelector((state) => state.products);

    const [newArrivals, featuredProducts] = useMemo(() => {
        if (!products || products.length < 9) {
            return [[], []];
        }
        
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        
        const arrivals = shuffled.slice(0, 5);
        const featured = shuffled.slice(5, 9);
        
        return [arrivals, featured];
    }, [products]);

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            <div className="hero-section">
                <div className="hero-background"><Hero3D /></div>
                <div className="hero-content">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        <h1 className="display-3 fw-bold">Enter the Galaxy</h1>
                        <p className="fs-4 text-secondary">Discover the next generation of gadgets. Unbeatable prices, unparalleled performance.</p>
                        <Link to="/products"><Button variant="primary" size="lg" className="mt-3">Explore Products</Button></Link>
                    </motion.div>
                </div>
            </div>

            <Container className="mt-5 py-5">
                <AnimatedSection>
                    <h2 className="mb-4 text-center">New Arrivals</h2>
                    <Carousel pause="hover" className="bg-lighten-5 rounded mb-5 shadow-lg">
                        {newArrivals.map(product => (
                            <Carousel.Item key={product.id} style={{ height: '400px' }}>
                                <Link to={`/product/${product.id}`} className="text-decoration-none">
                                   <Row className="align-items-center justify-content-center h-100 p-5">
                                        <Col md={4}><img className="d-block w-100" style={{ objectFit: 'contain', height: '300px' }} src={product.thumbnail} alt={product.title} /></Col>
                                        
                                        <Col md={4} className="d-none d-md-block">
                                            <h3>{product.title}</h3>
                                            <p>{product.description.substring(0, 100)}...</p>
                                        </Col>
                                   </Row>
                                </Link>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </AnimatedSection>

                <AnimatedSection>
                    <h2 className="mb-4 text-center">Featured Products</h2>
                     {status === 'loading' && <Loader />}
                     {status === 'failed' && <Alert variant="danger">{error}</Alert>}
                     {status === 'succeeded' && (
                         <Row>
                             {featuredProducts.map(product => (
                                 <Col key={product.id} xs={6} md={4} lg={3} className="mb-4">
                                     <ProductCard product={product} />
                                 </Col>
                             ))}
                         </Row>
                     )}
                </AnimatedSection>
            </Container>
        </motion.div>
    );
};

export default HomePage;