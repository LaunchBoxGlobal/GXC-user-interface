import Loader from "./Loader";

const Button = ({ type, title, isLoading }) => {
  return (
    <button
      type={type ? type : "button"}
      disabled={isLoading}
      className="button relative flex items-center justify-center disabled:cursor-progress"
    >
      {isLoading ? <Loader /> : title}
    </button>
  );
};

export default Button;
