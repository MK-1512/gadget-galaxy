import React, { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Alert, Placeholder } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import ProductCard from '../components/products/ProductCard';
import ProductCardSkeleton from '../components/common/ProductCardSkeleton';
import FilterBar from '../components/products/FilterBar';
import { motion } from 'framer-motion';

const MotionCol = motion(Col);

const pageVariants = {
  initial: { opacity: 0, scale: 0.99 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 0.99 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const defaultFilters = {
    category: 'all',
    maxPrice: 4000,
    sortBy: 'default',
    searchQuery: ''
};

// A simple skeleton component for the filter bar area
const FilterBarSkeleton = () => (
    <div className="filter-bar" style={{ height: '70px', display: 'flex', alignItems: 'center' }}>
        <Container>
            <Row className="w-100 gx-3">
                <Col><Placeholder animation="glow"><Placeholder xs={12} /></Placeholder></Col>
                <Col><Placeholder animation="glow"><Placeholder xs={12} /></Placeholder></Col>
                <Col><Placeholder animation="glow"><Placeholder xs={12} /></Placeholder></Col>
                <Col><Placeholder animation="glow"><Placeholder xs={12} /></Placeholder></Col>
            </Row>
        </Container>
    </div>
);


const ProductsPage = () => {
  const { items: products, status, error } = useSelector((state) => state.products);

  const [filters, setFilters] = useState(() => {
    try {
        const savedFilters = localStorage.getItem('productFilters');
        if (savedFilters) {
            return { ...defaultFilters, ...JSON.parse(savedFilters) };
        }
    } catch (e) {
        console.error("Could not parse filters from localStorage", e);
    }
    return defaultFilters;
  });

  useEffect(() => {
    try {
        localStorage.setItem('productFilters', JSON.stringify(filters));
    } catch (e) {
        console.error("Could not save filters to localStorage", e);
    }
  }, [filters]);


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const categories = useMemo(() => {
    if (!Array.isArray(products)) return ['all'];
    const valid = products.filter(p => p && p.category);
    return ['all', ...new Set(valid.map(p => p.category))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products) || !filters) return [];
    let list = products.filter(Boolean);

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(p => p.title?.toLowerCase().includes(q));
    }
    if (filters.category !== 'all') {
      list = list.filter(p => p.category === filters.category);
    }
    list = list.filter(p => Number(p.price) <= Number(filters.maxPrice));

    switch (filters.sortBy) {
      case 'price-asc':  list.sort((a,b) => a.price - b.price); break;
      case 'price-desc': list.sort((a,b) => b.price - a.price); break;
      case 'name-asc':   list.sort((a,b) => a.title.localeCompare(b.title)); break;
      case 'name-desc':  list.sort((a,b) => b.title.localeCompare(a.title)); break;
      default: break;
    }
    return list;
  }, [products, filters]);

  const dynamicTitle = useMemo(() => (
    filters.category === 'all'
      ? 'All Gadgets'
      : filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
  ), [filters.category]);

  // === RENDER LOGIC RESTRUCTURED ===
  
  // Loading State
  if (status === 'loading' || status === 'idle') {
    return (
        <>
            <FilterBarSkeleton />
            <Container className="products-grid-container pb-5">
                <h1 className="mb-4 page-title"><Placeholder xs={4} /></h1>
                <Row className="g-4 row-cols-1 row-cols-sm-2 row-cols-md-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <Col key={i}><ProductCardSkeleton /></Col>
                    ))}
                </Row>
            </Container>
        </>
    );
  }

  // Error State
  if (status === 'failed') {
      return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>;
  }

  // Succeeded State
  return (
    <>
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={categories}
      />

      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Container className="products-grid-container pb-5">
          <h1 className="mb-4 page-title">{dynamicTitle}</h1>
          
          {filteredProducts.length ? (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Row className="g-4 row-cols-1 row-cols-sm-2 row-cols-md-3 justify-content-center">
                {filteredProducts.map((product) => (
                  <MotionCol key={product.id} variants={itemVariants}>
                    <ProductCard product={product} />
                  </MotionCol>
                ))}
              </Row>
            </motion.div>
          ) : (
            <Alert variant="warning">No products match your criteria.</Alert>
          )}
        </Container>
      </motion.div>
    </>
  );
};

export default ProductsPage;