import React, { useEffect, useState } from "react";
import useAxios from "../helper/useAxios";
import { useNavigate } from "react-router-dom";

function Statistics() {
  const navigate = useNavigate();
  const [datas, setDatas] = useState<StatisticsType>({
    peopleWithDebt: 0,
    totalDebt: 0,
    allPeople: 0,
  });
  const { getData } = useAxios();

  interface StatisticsType {
    peopleWithDebt: number;
    totalDebt: number;
    allPeople: number;
  }

  useEffect(() => {
    const getTotalMoney = async () => {
      try {
        const api: StatisticsType = await getData(`statistics`);
        setDatas(api);
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
      <div className="mt-[30px] text-center text-[19px]">
        <p>მთლიანობაში ვალი - {datas.totalDebt}ლ</p>
        <p className="mt-4">
          ადამიანები, ვისაც ვალი აქვს - {datas.peopleWithDebt}
        </p>
        <p className="mt-4">ადამიანების რაოდენობა საიტზე - {datas.allPeople}</p>
      </div>
    </div>
  );
}

export default Statistics;
