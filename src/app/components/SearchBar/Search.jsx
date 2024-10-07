import { useState } from "react";
import { usePosts } from "../../home/PostContext";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import "./searchStyles.css";

function Search() {
  const { posts, setPosts, setSearchQuery } = usePosts();
  const [sortOption, setSortOption] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (option) => {
    setSortOption(option);
    if (option === "dateAsc") {
      sortByDateAsc();
    } else if (option === "dateDesc") {
      sortByDateDesc();
    } else if (option === "title") {
      sortByTitle();
    }
  };

  const sortByDateAsc = () => {
    const sortedPosts = [...posts].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    setPosts(sortedPosts);
  };

  const sortByDateDesc = () => {
    const sortedPosts = [...posts].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setPosts(sortedPosts);
  };

  const sortByTitle = () => {
    const sortedPosts = [...posts].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    setPosts(sortedPosts);
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
            onChange={handleSearch}
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
              <Dropdown.Item onClick={() => handleSort("dateAsc")}>
                Date (Ascending)
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSort("dateDesc")}>
                Date (Descending)
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
