import React, { useState } from 'react';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import Button from './Button';

const EventFilters = ({ onApplyFilters, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    category: initialFilters.category || '',
    status: initialFilters.status || '',
    sortBy: initialFilters.sortBy || 'createdAt',
    sortOrder: initialFilters.sortOrder || 'desc',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      category: '',
      status: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'politics', label: 'Politics' },
    { value: 'sports', label: 'Sports' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'technology', label: 'Technology' },
    { value: 'science', label: 'Science' },
    { value: 'business', label: 'Business' },
    { value: 'other', label: 'Other' },
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'settled', label: 'Settled' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const sortByOptions = [
    { value: 'createdAt', label: 'Creation Date' },
    { value: 'endDate', label: 'End Date' },
    { value: 'title', label: 'Title' },
    { value: 'popularity', label: 'Popularity' },
  ];

  const sortOrderOptions = [
    { value: 'desc', label: 'Descending' },
    { value: 'asc', label: 'Ascending' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormInput
            label="Search"
            id="search"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search events..."
          />

          <FormSelect
            label="Category"
            id="category"
            name="category"
            value={filters.category}
            onChange={handleChange}
            options={categoryOptions}
          />

          <FormSelect
            label="Status"
            id="status"
            name="status"
            value={filters.status}
            onChange={handleChange}
            options={statusOptions}
          />

          <div className="grid grid-cols-2 gap-2">
            <FormSelect
              label="Sort By"
              id="sortBy"
              name="sortBy"
              value={filters.sortBy}
              onChange={handleChange}
              options={sortByOptions}
            />

            <FormSelect
              label="Order"
              id="sortOrder"
              name="sortOrder"
              value={filters.sortOrder}
              onChange={handleChange}
              options={sortOrderOptions}
            />
          </div>
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button type="submit">Apply Filters</Button>
        </div>
      </form>
    </div>
  );
};

export default EventFilters; 