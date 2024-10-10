"use client"; // Ensure client-side rendering for Next.js

import { useState } from "react";
import { usePosts } from "../../home/PostContext"; // Adjust the import path
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import "./searchStyles.css";

function Search() {
  const { posts, setPosts, setSearchQuery, sortOption, setSortOption } =
    usePosts(); // Ensure setSearchQuery works
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchText(query); // For local control
    setSearchQuery(query); // This will update the search query in context
  };

  const handleSort = (option) => {
    setSortOption(option); // Update sort option in context
  };

  return (
    <div className="search-section">
      <Form className="d-flex">
        <div className="search-bar">
          <Form.Control
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
            value={searchText}
            onChange={handleSearch} // This triggers the search
          />
        </div>
        <div className="sort-button">
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
              Sort By{" "}
              {sortOption &&
                `(${sortOption.charAt(0).toUpperCase() + sortOption.slice(1)})`}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleSort("date")}>
                Date
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSort("title")}>
                Title (A-Z)
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Form>
    </div>
  );
}

export default Search;
