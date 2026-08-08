import React from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import useBooks from "../hooks/useBooks";
import BookCard from "./BookCard";

function Freebook() {
  const { books, loading, error } = useBooks(
    (item) => item.category === "Free",
  );

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return null;
  }

  return (
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4">
      <div>
        <h1 className="font-semibold text-xl pb-2">Free Offered Courses</h1>
        <p>
          Explore our collection of free books. These are great resources to get
          you started on your learning journey without any cost.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-5">
        {books.map((item) => (
          <BookCard item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
}

export default Freebook;
