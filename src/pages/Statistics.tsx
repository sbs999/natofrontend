import React, { useEffect, useState } from "react";
import useAxios from "../helper/useAxios";
import { useNavigate } from "react-router-dom";

function Statistics() {
  const navigate = useNavigate();
  const [totalMoney, setTotlaMoney] = useState(0);
  const { getData } = useAxios();
  const backendUrl =
    process.env.REACT_APP_PORT || "https://natobackend.onrender.com";

  useEffect(() => {
    const getTotalMoney = async () => {
      try {
        const api = await getData(
          `https://natobackend.onrender.com/getTotalMoney`
        );
        setTotlaMoney(api.totalMoney);
      } catch (error) {
        console.log(error);
        navigate("/statistics");
      }
    };
    getTotalMoney();
  }, []);

  return (
    <div>
      <button
        onClick={() => navigate("/")}
        type="submit"
        className="border-[1px] bg-[#3498db] p-[10px] rounded-[12px] text-white mt-[10px] ml-[10px]"
      >
        უკან გასვლა
      </button>
      <div className="mt-[30px] text-center text-[22px]">
        <p>მთლიანობაში ვალი - {totalMoney}ლ</p>
      </div>
    </div>
  );
}

export default Statistics;
