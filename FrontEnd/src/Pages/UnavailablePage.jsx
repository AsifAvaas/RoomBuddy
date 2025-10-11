import { Link } from "react-router-dom";

function UnavailablePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-3">
        404 - Page Not Found
      </h1>
      <p className="text-gray-700 mb-6">
        The page you’re trying to access doesn’t exist.
      </p>
      <Link
        to="/"
        className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default UnavailablePage;
