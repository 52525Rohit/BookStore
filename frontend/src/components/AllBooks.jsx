import React from "react";
import useBooks from "../hooks/useBooks";
import BookCard from "./BookCard";
import { Link } from "react-router-dom";

function AllBooks() {
  const { books, loading, error } = useBooks(null, 8);

  if (loading) {
    return <div className="text-center my-8">Loading books...</div>;
  }
  if (error) {
    return (
      <div className="text-center my-8 text-red-500">
        Error loading books: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 my-12">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-xl pb-2">All Books</h1>
        <Link to="/books" className="text-blue-600 hover:underline">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-5">
        {books.map((item) => (
          <BookCard item={item} key={item._id} />
        ))}
      </div>
    </div>
  );
}

export default AllBooks;
