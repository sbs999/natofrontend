import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../helper/useAxios";
import { toast } from "react-toastify";

function Note() {
  const [status, setStatus] = useState("readOnly");
  const navigate = useNavigate();
  const [content, setContent] = useState({ saveNote: "", newNote: "" });
  const { getData, postData } = useAxios();

  const backendUrl =
    process.env.REACT_APP_PORT || "https://natobackend.onrender.com";

  useEffect(() => {
    const getTotalMoney = async () => {
      try {
        const api = await getData(`https://natobackend.onrender.com/getNote`);
        setContent({ saveNote: api.text, newNote: api.text });
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
      const api = await postData(`https://natobackend.onrender.com/postNote`, {
        text: content.newNote,
      });
      setContent((note) => ({ ...note, saveNote: api.text }));
    } catch (error) {
      toast.error("შეცდომაა! თავიდან საცდეთ!");
      console.log(error);
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate("/")}
        type="submit"
        className="border-[1px] bg-[#3498db] p-[10px] rounded-[12px] text-white mt-[10px] ml-[10px]"
      >
        უკან გასვლა
      </button>

      <p className="text-center text-[24px] my-[10px] font-bold text-green-500">
        ჩანაწერები
      </p>

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

      <div className="w-[95%] mx-auto flex justify-end mt-[10px]">
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
    </div>
  );
}

export default Note;
