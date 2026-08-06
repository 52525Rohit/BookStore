import Card from "./Cards";
import { Link, useSearchParams } from "react-router-dom";
import useBooks from "../hooks/useBooks";

function Books() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search")?.trim().toLowerCase() || "";
  const { books: book, loading, error } = useBooks();
  const filtered = search
    ? book.filter((item) =>
        [item.name, item.title].some((field) =>
          field?.toLowerCase().includes(search)
        )
      )
    : book;

  return (
    <>
      <div className="max-w-screen-2xl container mx-auto md:px-20 px-4">
        <div className="mt-28 item-center justify-center text-center">
          <h1 className="text-2xl font-semibold md:text-4xl">
            We&apos;re delighted to have you {""}
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
        {loading ? (
          <p className="text-center py-12 text-gray-500 dark:text-gray-400">
            Loading books...
          </p>
        ) : error ? (
          <p className="text-center py-12 text-red-500">
            Couldn&apos;t load books right now. Please try again later.
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-12 text-gray-500 dark:text-gray-400">
            {search ? `No books match "${search}"` : "No books available yet."}
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4">
            {filtered.map((item) => (
              <Card key={item._id || item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Books;
