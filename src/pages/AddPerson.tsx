import React,{useState,useContext} from 'react'
import {useNavigate} from "react-router-dom";
import PersonList from '../components/addPerson/PersonList';
import AddFormSchema from '../components/addPerson/AddFormSchema';
const AddPerson = () => { 
    const [state,setState] = useState<String>("list");
    const navigate = useNavigate();
    
  return (
    <div>
        <button onClick={() => navigate("/")} type="submit" className='border-[1px] bg-[#3498db] p-[10px] rounded-[12px] text-white mt-[10px] ml-[10px]'>უკან გასვლა</button>
        <div className='flex max-w-[300px] mx-auto rounded-[10px] justify-between mt-[20px] '>
            <div onClick={() => setState("list")} className={`w-[50%] ${state === "list" ? 'bg-green-500' : "bg-red-500"} text-white grid place-content-center text-center rounded-[10px] cursor-pointer`}>ისტორიიდან დამატება</div>
            <div onClick={() => setState("new")} className={`w-[50%] ${state === "new" ? 'bg-green-500' : "bg-red-500"} text-white grid place-content-center rounded-[10px] cursor-pointer`}>ახლის დამატება</div>
        </div>
        {
            state === "list" ? (
             <div>
              <PersonList />
             </div>
            ) : (
                <div className='max-w-[270px] mx-auto mt-[30px]'>
                <div className='grid place-content-center mb-[25px] text-[22px] '>
                <p>ადამიანის დამატება</p>
                </div>
                <AddFormSchema  name="" surname="" mobNumber="" info="" histroyStatus={{status: 'new',id: ""}}  />
                {/* {status: string,id: string} */}
              </div> 
            )
        }
      
    </div>
  )
}


  export default AddPerson
