import React from "react";
import { useAuth } from "../context/AuthProvider";

function About() {
  const { profile } = useAuth();
  console.log(profile);
  return (
    <>
      <div className="container mx-auto my-12 p-4 space-y-9">
        <h1 className="text-2xl font-bold mb-6">About</h1>
        <h2 className="font-semibold text-red-800 text-xl">BookStore</h2>
        <img
          src="https://img.freepik.com/free-vector/gradient-bookstore-logo_23-2149332421.jpg?ga=GA1.1.134665576.1696907568&semt=ais_hybrid"
          className="md:w-[550px] md:h-[460px] md:ml-12 rounded-lg"
          alt="BookStore"
        />
        <p>
          BookStore works to connect readers with independent booksellers all
          over the world. ‍We believe local bookstores are essential community
          hubs that foster culture, curiosity, and a love of reading, and we're
          committed to helping them thrive. Every purchase on the site
          financially supports independent bookstores. Our platform gives
          independent bookstores tools to compete online and financial support
          to help them maintain their presence in local communities.
        </p>
      </div>
    </>
  );
}

export default About;
