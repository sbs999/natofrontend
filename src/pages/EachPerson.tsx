import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/reduxStore";
import EachPersonForm from "../components/EachPerson/EachPersonForm";
import CustomerMarkBadge from "../components/customer-mark/CustomerMarkBadge";
import CustomerMarkModal from "../components/customer-mark/CustomerMarkModal";
import { usePersonMarkModal } from "../hooks/usePersonMarkModal";
import useAxios from "../helper/useAxios";
import { getPersons } from "../store/debts";
import { toast } from "react-toastify";

const EachPerson = () => {
  const { persons } = useAppSelector((state) => state.persons);
  const { personId } = useParams();
  const dispatch = useAppDispatch();
  const { deleteData } = useAxios();
  const { open, ctx, openModal, closeModal } = usePersonMarkModal();
  const [state, setState] = useState(
    persons.filter((p) => p._id.toString() === personId?.toString())
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setState(persons.filter((p) => p._id === personId));
  }, [persons]);

  const confirmDeletePerson = async () => {
    if (!state[0]?._id) return;
    setDeleteSubmitting(true);
    try {
      await deleteData(`deleteActivePerson/${state[0]._id}`);
      dispatch(getPersons({}));
      toast.success("წაშლილია.");
      setDeleteConfirmOpen(false);
      navigate("/");
    } catch {
      toast.error("შეცდომაა, სცადეთ თავიდან.");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-end">
        <button
          onClick={() => navigate("/")}
          type="submit"
          className="border-[1px] bg-[#3498db] p-[10px] rounded-[12px] text-white mt-[10px] ml-[10px]"
        >
          უკან გასვლა
        </button>
        {state.length > 0 && (
          <div className="mr-[10px] flex flex-col items-end gap-2 sm:flex-row sm:items-center">
            <p
              onClick={() => navigate(`/updatePersonInfo/${state[0]._id}`)}
              className="text-gray-400 underline cursor-pointer"
            >
              განახლება
            </p>
            <button
              type="button"
              onClick={() => setDeleteConfirmOpen(true)}
              className="rounded-[10px] border border-red-600 bg-red-500 px-3 py-2 text-sm font-semibold text-white"
            >
              წაშლა
            </button>
          </div>
        )}
      </div>
      {state.length <= 0 ? (
        <div className="mt-[50px]">
          შეცდომაა,თავიდან სცადეთ! არა არის ასეთი ადამიანი!
        </div>
      ) : (
        <div className="mt-[30px] ">
          <div className="mx-[6px] flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2 text-[22px]">
              <CustomerMarkBadge
                mark={state[0].displayMark ?? state[0].adminMark}
                onOpen={() => openModal(state[0]._id, "active")}
              />
              <span>
                {state[0].name} {state[0].surname}
              </span>
            </div>
            <div className="text-[22px] mt-[10px]">
              ვალი - {state[0].money}ლ{" "}
            </div>
            {state[0].mobNumber && (
              <div className="mt-[10px]">
                ტელეფონის ნომერი - {state[0].mobNumber}
              </div>
            )}
            {state[0].info && (
              <div className="mt-[10px]">
                დამატებითი ინფორმაცია - {state[0].info}
              </div>
            )}
          </div>
          <div className="max-w-[280px] mx-auto mt-[30px] border-[1px] p-[5px] bg-[#95a5a6] rounded-[10px] ">
            <EachPersonForm id={state[0]._id} />
          </div>
          <div className="mt-[20px]">
            {state[0].payment.map((d, index) => {
              return (
                <div
                  key={index}
                  className={` ${
                    d.status === "add"
                      ? "bg-[#2ecc71]"
                      : d.status === "edit"
                      ? "bg-[#3498db]"
                      : "bg-[#e74c3c]"
                  } text-white rounded-[10px] text-center  max-w-[285px] mx-auto mt-[15px] min-h-[50px]  cursor-pointer flex justify-between items-center p-[4px] text-[17px] flex-wrap`}
                >
                  <div className="text-start mr-[5px]">
                    <p>
                      {d.date.day}/{d.date.month + 1}/{d.date.year}
                    </p>
                    <p>
                      {d.date.hour}:{d.date.minute}
                    </p>
                  </div>
                  <div className="text-start">
                    {d.status === "edit" ? (
                      <p> განახლებულია თანხა</p>
                    ) : (
                      <p>
                        {d.status === "add" ? "დაამატა" : "მოიტანა"} ვალი -{" "}
                        {d.money}ლ
                      </p>
                    )}
                    <p>ჯამში ვალი - {d.sumOfMoney}ლ</p>
                  </div>
                  {d.info && (
                    <div className="text-start mt-[5px]">
                      <p>დამატებითი ინფორმაცია - {d.info}</p>
                    </div>
                  )}
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
      )}
      {deleteConfirmOpen && state.length > 0 && (
        <div
          className="fixed inset-0 z-[190] flex items-center justify-center bg-black/50 p-4"
          onClick={() => !deleteSubmitting && setDeleteConfirmOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-center text-[17px] text-slate-800">
              დარწმუნებული ხართ რომ გსურთ ამ ადამიანის წაშლა სიიდან?
            </p>
            <p className="mt-2 text-center text-sm text-slate-600">
              {state[0].name} {state[0].surname} — ვალი {state[0].money}ლ
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                type="button"
                disabled={deleteSubmitting}
                onClick={() => setDeleteConfirmOpen(false)}
                className="rounded-[10px] border border-slate-300 px-4 py-2 text-slate-700"
              >
                არა
              </button>
              <button
                type="button"
                disabled={deleteSubmitting}
                onClick={confirmDeletePerson}
                className="rounded-[10px] bg-red-600 px-4 py-2 font-semibold text-white disabled:opacity-60"
              >
                {deleteSubmitting ? "…" : "დიახ, წაშლა"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EachPerson;
