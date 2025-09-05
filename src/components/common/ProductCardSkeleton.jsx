import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Card } from 'react-bootstrap';

const ProductCardSkeleton = () => {
    return (
        <SkeletonTheme baseColor="#2a3042" highlightColor="#3e455a">
            <Card className="product-card h-100">
                <Skeleton height={200} />
                <Card.Body className="d-flex flex-column">
                    <Card.Title as="div" className="mb-2">
                        <Skeleton count={2} />
                    </Card.Title>
                    <div className="mt-auto">
                        <Skeleton height={30} width={100} />
                        <Skeleton height={40} className="mt-2" />
                    </div>
                </Card.Body>
            </Card>
        </SkeletonTheme>
    );
};

export default ProductCardSkeleton;