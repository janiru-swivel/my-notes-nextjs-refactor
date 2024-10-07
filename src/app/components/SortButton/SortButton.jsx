import { useState } from "react";
import { usePosts } from "../../pages/HomePage/PostContext";
import Dropdown from "react-bootstrap/Dropdown";
import "./sortButton.css";

function SortButton() {
  const { posts, setPosts } = usePosts(); // Assuming `setPosts` is available in the context
  const [sortOption, setSortOption] = useState("");

  const handleSort = (option) => {
    setSortOption(option);
    if (option === "date") {
      SortByDate();
    } else if (option === "title") {
      SortByTitle();
    }
  };

  function SortByDate() {
    const sortedPosts = [...posts].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setPosts(sortedPosts);
  }

  function SortByTitle() {
    const sortedPosts = [...posts].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    setPosts(sortedPosts);
  }

  return (
    <div className="sort-button">
      <Dropdown>
        <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
          Sort By
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleSort("date")}>Date</Dropdown.Item>
          <Dropdown.Item onClick={() => handleSort("title")}>
            Title
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default SortButton;
