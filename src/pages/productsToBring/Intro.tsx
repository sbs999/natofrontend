import { useNavigate } from "react-router-dom";

const ProductsToBringIntro = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => navigate("/")}
        type="submit"
        className="border-[1px] bg-[#3498db] p-[10px] rounded-[12px] text-white mt-[10px] ml-[10px]"
      >
        უკან გასვლა
      </button>

      <div className="flex flex-col w-[90%] mx-auto mt-[50px]">
        <button
          onClick={() => navigate("/productsToBring/add")}
          className="mb-2 text-[17px] font-medium text-gray-900 rounded-lg bg-[#f0f0f0] hover:bg-[#dddddd] p-[12px] w-full text-left text-[22px]"
        >
          პროდუქტის დამატება
        </button>
        <button
          onClick={() => navigate("/productsToBring/active-products")}
          className="mb-2 text-[17px] font-medium text-gray-900 rounded-lg bg-[#f0f0f0] hover:bg-[#dddddd] p-[12px] w-full text-left text-[22px]"
        >
          მოსატანი პროდუქტები
        </button>

        <button
          onClick={() => navigate("/productsToBring/categories")}
          className="mt-8 mb-2 text-[17px] font-medium text-gray-900 rounded-lg bg-[#f0f0f0] hover:bg-[#dddddd] p-[12px] w-full text-left text-[22px]"
        >
          კატეგორიები
        </button>
        <button
          onClick={() => navigate("/productsToBring/locations")}
          className="mb-2 text-[17px] font-medium text-gray-900 rounded-lg bg-[#f0f0f0] hover:bg-[#dddddd] p-[12px] w-full text-left text-[22px]"
        >
          ლოკაციები
        </button>

        <button
          onClick={() => navigate("/productsToBring/done-products")}
          className="mt-8 mb-2 text-[17px] font-medium text-gray-900 rounded-lg bg-[#f0f0f0] hover:bg-[#dddddd] p-[12px] w-full text-left text-[22px]"
        >
          მოტანილი პროდუქტები
        </button>
        <button
          onClick={() => navigate("/productsToBring/remove-products")}
          className="mb-2 text-[17px] font-medium text-gray-900 rounded-lg bg-[#f0f0f0] hover:bg-[#dddddd] p-[12px] w-full text-left text-[22px]"
        >
          წაშლილი პროდუქტები
        </button>
      </div>
    </div>
  );
};

export default ProductsToBringIntro;
