import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../helper/useAxios";
import { toast } from "react-toastify";

interface DateType {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

function Note() {
  const [status, setStatus] = useState("readOnly");
  const navigate = useNavigate();
  const [content, setContent] = useState({ saveNote: "", newNote: "" });
  const [date, setDate] = useState<string>("");
  const { getData, postData } = useAxios();

  useEffect(() => {
    const getTotalMoney = async () => {
      try {
        const api = await getData(`getNote`);
        setContent({ saveNote: api.text, newNote: api.text });
        setDate(modifeDate(api.date));
      } catch (error) {
        console.log(error);
        navigate("/");
        toast.error("შეცდომაა! თავიდან საცდეთ!");
      }
    };
    getTotalMoney();
  }, []);

  const updateNote = async () => {
    try {
      const api = await postData(`postNote`, {
        text: content.newNote,
      });
      setContent((note) => ({ ...note, saveNote: api.text }));
      toast.success("წარმატებით შეინახა.");
    } catch (error) {
      toast.error("შეცდომაა! თავიდან საცდეთ!");
      console.log(error);
    }
  };

  const modifeDate = (date: DateType) => {
    return `${date.day}/${
      date.month.toString().length > 1 ? date.month : "0" + date.month
    }/${date.year}  `;
    //  ${date.hour}:${
    //   date.minute.toString().length > 1 ? date.minute : "0" + date.minute
    // }
  };

  return (
    <div>
      <div className="flex justify-between">
        <button
          onClick={() => navigate("/")}
          type="submit"
          className="border-[1px] bg-[#3498db] p-[10px] rounded-[12px] text-white mt-[10px] ml-[10px]"
        >
          უკან გასვლა
        </button>

        <p className="text-center text-[20px] my-[10px] font-bold text-green-500 mr-[2.5%]">
          ჩანაწერები
        </p>
      </div>

      <div className="w-[95%] mx-auto flex justify-end mt-[20px] mb-[15px]">
        {status === "readOnly" ? (
          <button
            onClick={() => setStatus("edit")}
            className="bg-green-400 text-white p-[7px] text-[20px] rounded-[5px] font-bold"
          >
            განახლება
          </button>
        ) : (
          <div>
            <button
              onClick={async () => {
                await updateNote();
                setStatus("readOnly");
              }}
              className="bg-green-400 text-white p-[7px] text-[20px] rounded-[5px] font-bold mr-5"
            >
              შენახვა
            </button>

            <button
              onClick={() => {
                setContent((note) => ({ ...note, newNote: note.saveNote }));
                setStatus("readOnly");
              }}
              className="bg-red-400 text-white p-[7px] text-[20px] rounded-[5px] font-bold"
            >
              უარყოფა
            </button>
          </div>
        )}
      </div>

      <div className="w-[95%] mx-auto text-[18px] mb-1">
        {date && <p>{`ბოლო განახლება - ${date}`}</p>}
      </div>

      <div className="w-[95%] h-[75vh] border border-black rounded-[10px]  mx-[2.5%]">
        {status === "edit" ? (
          <textarea
            value={content.newNote}
            onChange={(e) =>
              setContent((note) => ({ ...note, newNote: e.target.value }))
            }
            className="w-[100%] max-h-[75vh] min-h-[75vh] text-[21px] p-2"
          />
        ) : (
          <textarea
            readOnly
            value={content.saveNote}
            className="w-[100%] h-[75vh] overflow-hidden overflow-y-scroll text-[21px] p-2"
          />
        )}
      </div>
    </div>
  );
}

export default Note;
