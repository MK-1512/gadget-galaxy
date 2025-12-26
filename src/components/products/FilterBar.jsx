import React from 'react';
import { Form } from 'react-bootstrap';

const FilterBar = ({ filters, onFilterChange, categories }) => {
  return (
    <div className="filter-bar">
      <div className="filter-inner">
        <Form className="filter-form d-flex align-items-center justify-content-center flex-wrap">
          <Form.Control
            type="text"
            name="searchQuery"
            value={filters.searchQuery}
            onChange={onFilterChange}
            placeholder="Search by Name..."
            className="me-2"
            style={{ maxWidth: 320 }}
          />

          <Form.Select
            name="category"
            value={filters.category}
            onChange={onFilterChange}
            className="me-2"
            style={{ maxWidth: 220 }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </Form.Select>

          <Form.Select
            name="sortBy"
            value={filters.sortBy}
            onChange={onFilterChange}
            className="me-2"
            style={{ maxWidth: 220 }}
          >
            <option value="default">Sort By: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </Form.Select>

          <div className="price-range-wrapper ms-2 d-flex align-items-center">
            <span className="me-2 d-none d-md-inline">Max Price: ${filters.maxPrice}</span>
            <Form.Range
              name="maxPrice"
              min="0"
              max="4000"
              step="50"
              value={filters.maxPrice}
              onChange={onFilterChange}
            />
          </div>
        </Form>
      </div>
    </div>
  );
};

export default FilterBar;
