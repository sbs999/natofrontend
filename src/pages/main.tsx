import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { context } from '../store/store';
import { useAppSelector } from "../store/reduxStore";
import CustomerMarkBadge from "../components/customer-mark/CustomerMarkBadge";
import CustomerMarkModal from "../components/customer-mark/CustomerMarkModal";
import { usePersonMarkModal } from "../hooks/usePersonMarkModal";

const Main = () => {
  const navigate = useNavigate();
  const { persons } = useAppSelector((state) => state.persons);
  const { open, ctx, openModal, closeModal } = usePersonMarkModal();
  const [state, setState] = useState(persons);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setState(persons);
  }, [persons]);

  useEffect(() => {
    if (search) {
      const filteredInfo = persons.filter((a) =>
        [a.name, a.surname, a.money, a.info]
          .join("")
          .toLowerCase()
          .includes(search.toString().toLocaleLowerCase().split(" ").join(""))
      );
      setState(filteredInfo as []);
    } else {
      setState(persons);
    }
  }, [search]);

  return (
    <div className="flex justify-center flex-col items-center">
      <div
        onClick={() => navigate("/addPerson")}
        className="w-[285px] text-[17px] bg-[#34495e] text-white p-[7px] py-[11px] flex justify-center rounded-[10px] cursor-pointer mt-[20px] font-bold"
      >
        <p>ადამიანის დამატება სიაში.</p>
      </div>

      <div className="mt-5">
        <div className="flex justify-center gap-3 mb-5">
          <button
            onClick={() => navigate("/statistics")}
            className="border p-2 rounded-[10px] text-[18px] bg-[#0000FF] text-white font-bold"
          >
            სტატისტიკა
          </button>
          <button
            onClick={() => navigate("/productsToBring")}
            className="border p-2 rounded-[10px] text-[18px] bg-[#006400] text-white font-bold "
          >
            ჩანაწერები
          </button>
        </div>
        <div>
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            className="border-[1px]  px-[10px] py-[10px] w-[280px] rounded-[10px] border-black"
            placeholder="გაფილტვრა"
          />
        </div>
      </div>
      <div className="mt-[10px]">
        {state.map((d, index) => {
          return (
            <div
              key={index}
              className="mt-[5px] flex w-[280px] items-center gap-2 bg-[#ecf0f1] px-2 py-2 text-[17px]"
            >
              <CustomerMarkBadge
                mark={d.displayMark ?? d.adminMark}
                onOpen={() => openModal(d._id, "active")}
              />
              <div
                onClick={() => navigate(`/person/${d._id}`)}
                className="flex min-h-[40px] flex-1 cursor-pointer items-center justify-center text-center"
              >
                {d.name} {d.surname} - {d.money}ლ
              </div>
            </div>
          );
        })}
      </div>
      {ctx && (
        <CustomerMarkModal
          open={open}
          personId={ctx.personId}
          source={ctx.source}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Main;
