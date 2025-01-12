import React, { useEffect, useState } from "react";
import Card from "./Cards";
import { Link } from "react-router-dom";
import axios from "axios";

function Books() {
  const [book, setBook] = useState([]);
  useEffect(() => {
    const getBook = async () => {
      try {
        const res = await axios.get("https://bookstore-g1p7.onrender.com");
        console.log(res.data);
        setBook(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getBook();
  }, []);

  return (
    <>
      <div className="max-w-screen-2xl container mx-auto md:px-20 px-4">
        <div className="mt-28 item-center justify-center text-center">
          <h1 className="text-2xl font-semibold md:text-4xl">
            We're delighted to have you {""}
            <span className="text-blue-700">Here! :)</span>
          </h1>
          <p className="mt-12">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam
            tenetur amet beatae ipsum facere et minus iusto corrupti ea, quasi
            enim sint dolores sunt quo unde quibusdam optio natus est.
          </p>
          <Link to="/">
            <button className=" mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-900 duration-300">
              Back
            </button>
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4">
          {book.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Books;
