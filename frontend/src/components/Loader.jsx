import { ClipLoader } from "react-spinners";

const Loader = () => {
  
  return (
    <div className="flex justify-center items-center">
      <ClipLoader color="#00000" size={30} />
    </div>
  );
};
export default Loader;