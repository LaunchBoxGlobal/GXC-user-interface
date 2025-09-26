import Loader from "./Loader";

const Button = ({ type, title, isLoading }) => {
  return (
    <button
      type={type ? type : "button"}
      className="button relative flex items-center justify-center"
    >
      {isLoading ? <Loader /> : title}
    </button>
  );
};

export default Button;
