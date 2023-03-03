import React, { useState,useEffect } from 'react'
import excel from "../../imgs/excel.svg";
import { read, utils } from 'xlsx';
import { useNavigate,Link } from 'react-router-dom';
import {toast} from "react-toastify";
import useAxios from '../../helper/useAxios';
import { useAppDispatch } from '../../store/reduxStore';
import { getBooks } from '../../store/books';
const AddBooks = ({publishedBy}) => {
  const {postData} = useAxios();
  const [csvFiles, setCsvFiles] = useState();
  const [validBooks,setValidBooks] = useState();
  const [InvalidBooks,setInvalidBooks] = useState();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // console.log(validBooks,InvalidBooks);
  // console.log(publishedBy);
  console.log(11.55.toFixed(1));
  useEffect(() => {
  if (csvFiles?.length > 0) {
    const file = csvFiles[0];
    const reader = new FileReader();
    reader.onload = event => {
      const wb = read(event.target.result);
      const sheets = wb.SheetNames;

      if (sheets.length) {
        const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
        let columns = [];
        let range = utils.decode_range(wb.Sheets[sheets[0]]['!ref']);
        let C,
          R = range.s.r; /* start in the first row */
        /* walk every column in the range */
        for (C = range.s.c; C <= range.e.c; ++C) {
          let cell =
            wb.Sheets[sheets[0]][
              utils.encode_cell({ c: C, r: R })
            ]; /* find the cell in the first row */

          let hdr = '';
          if (cell && cell.t) hdr = utils.format_cell(cell);

          columns.push(hdr);
        }
        const modifiedValidBooks = [];
        const modifiedInvalidBooks = [];
        rows.forEach(r => {
          if(r['საქონლის დასახელება'] && typeof r['საქონლის დასახელება'] === "string" && r["ერთ.ფასი"] && typeof r["ერთ.ფასი"] === "number"  && r["საქონლისკოდი"] && r['რაოდ.']) {

            const companyPrice = publishedBy === "სულაკაური" ? (+r["ერთ.ფასი"] * 1.428).toFixed(1) : (+r["ერთ.ფასი"] * 1.3335).toFixed(2);

            modifiedValidBooks.push({name: r['საქონლის დასახელება'].trim(),takePrice: +r["ერთ.ფასი"].toFixed(2),payPrice: companyPrice,code: r["საქონლისკოდი"].toString(),quantity: r['რაოდ.'],description: publishedBy})
          }else {
            modifiedInvalidBooks.push({name: r['საქონლის დასახელება'] || "error",takePrice: +r["ერთ.ფასი"] ? +r["ერთ.ფასი"].toFixed(2) : "error",payPrice: +r["ერთ.ფასი"] ? +r["ერთ.ფასი"] * 1.33 : "error",code: r["საქონლისკოდი"] || "error",quantity: r['რაოდ.'] || "error"});
          }
        })
        setValidBooks(modifiedValidBooks);
        setInvalidBooks(modifiedInvalidBooks);
      }
    };
    reader.readAsArrayBuffer(file);
  }
}, [csvFiles]);

    const publishedCompany = publishedBy === "სულაკაური" ? "sulakauri" : "palitra";
const saveNewBooks = async () => {
     try {
      await postData(`http://localhost:8080/postBooks/${publishedCompany}`,validBooks);
      dispatch(getBooks());
      toast.success("წარმატებით დაემატა!");
      navigate(`/books/${publishedCompany}`);
     }catch(error){
      console.log(error);
      toast.error("ვერ შეინახა ინფორმაცია, სცადეთ თავიდან!");
     }
}
return (
  <div>
     <div className='flex justify-between items-center mt-[10px] '>
    <button onClick={() => navigate(`/books/${publishedCompany}`)} type="submit" className='border-[1px] bg-[#3498db] p-[10px] rounded-[12px] text-white ml-[10px]'>უკან გასვლა</button>
      <Link to="/" className='mr-[9px] text-gray-500'><p>დასაწყისი</p></Link> 
    </div>
    <div className='flex justify-center flex-col items-center'>
        <div  className='text-[20px] mt-[10px]'>გამომცემლობა {publishedBy}</div>
    </div>
      <div>
        <div className='mt-[20px] grid place-content-center'>
    <label className="custom-file-label" htmlFor="file">
      <input
          id="file"
          type="file"
          onChange={({target}) => setCsvFiles(target.files)}
          onClick={event => (event.target.value = null)}
          className="hidden"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
      <img className="w-[216px] h-[50px] cursor-pointer" src={excel} alt="excel" />
  </label>
  </div>
  </div>
  {InvalidBooks && validBooks && (
    <>
  {validBooks.length && (
    <div className=' mt-[20px] overflow-x-auto  overflow-scroll px-[5%] '>
      <div className='grid place-content-center mb-[10px]'>
      <p className='mb-[10px] text-blue-500 '>წარმატებით დაემატება {validBooks.length} წიგნი.</p>
      </div>
      <table className='border-[1px] w-[100%] max-w-[800px] validTable mx-[auto]' >
        <thead>
          <tr>
          <th>N:</th>
          <th>დასახელება</th>
          <th>რაოდენობა</th>
          <th>ასაღები ფასი</th>
          <th>გასაყიდი ფასი</th>
          <th>კოდი</th>
          </tr>
        </thead>
        <tbody>
          {validBooks.map((b,index) => {
            return (
               <tr key={index}>
             <td>{index + 1}</td>
             <td>{b.name}</td>
             <td>{b.quantity}</td>
             <td>{b.takePrice}</td>
             <td>{b.payPrice}</td>
             <td>{b.code}</td>
           </tr>
            )
          })}
       </tbody>
      </table>
      </div>
  )}
   {InvalidBooks.length && (
    <div className=' mt-[20px] overflow-x-auto  overflow-scroll px-[5%] '>
    <div className='grid place-content-center mb-[10px]'>
    <p className='mb-[10px] text-red-500 '>წარუმატებლად დაემატება {InvalidBooks.length} წიგნი.</p>
    </div>
    <table className='border-[1px] w-[100%] max-w-[800px] InvalidBooks mx-[auto]' >
      <thead>
        <tr>
        <th>დასახელება</th>
        <th>რაოდენობა</th>
        <th>ასაღები ფასი</th>
        <th>გასაყიდი ფასი</th>
        <th>კოდი</th>
        </tr>
      </thead>
      <tbody>
        {InvalidBooks.map((b,index) => {
          return (
             <tr key={index}>
           <td>{b.name}</td>
           <td>{b.quantity}</td>
           <td>{b.takePrice}</td>
           <td>{b.payPrice}</td>
           <td>{b.code}</td>
         </tr>
          )
        })}
      </tbody>
    </table>
    </div>
   )}
     <div className='mt-[35px] grid place-content-center'>
     <button onClick={saveNewBooks} className='border-[1px] bg-[#f1c40f] p-[10px] rounded-[12px] text-[18px] px-[20px]'>შენახვა</button>
     </div>
    </>
  )}

  </div>

)
}

export default AddBooks
