import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-[32px] font-semibold">Oops! Page not found!</h1>
      <Link
        to={`/`}
        className="button max-w-[120px] flex items-center justify-center"
      >
        Go Back
      </Link>
    </main>
  );
};

export default NotFound;
