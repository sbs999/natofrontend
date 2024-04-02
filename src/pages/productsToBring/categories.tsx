import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/reduxStore";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../store/productsToBring/categories";
import { useNavigate } from "react-router-dom";
import SimpleCard from "../../Reusable/cards/simple-card.cards";
import { ISaveCategoryCredentials } from "../../interfaces";
import { v4 as uuidv4 } from "uuid";

export const Categories = () => {
  const [newCategory, setNewCategory] =
    useState<ISaveCategoryCredentials | null>();

  const { categories } = useAppSelector((state) => state.ProductCategories);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCategories({}));
  }, []);

  const saveCategory = async (credentials: ISaveCategoryCredentials) => {
    await dispatch(
      updateCategory({
        id: credentials.id,
        updateData: {
          name: credentials.name,
          description: credentials.description,
        },
      })
    );
  };

  const deleteCategoryHandler = async (id: string) => {
    await dispatch(deleteCategory({ id }));
  };

  const createNewCategory = async (credentials: ISaveCategoryCredentials) => {
    await dispatch(
      createCategory({
        name: credentials.name,
        description: credentials.description,
      })
    );
    setNewCategory(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate("/productsToBring")}
          type="submit"
          className="border-[1px] bg-[#3498db] p-[10px] rounded-[12px] text-white mt-[10px] ml-[10px]"
        >
          უკან გასვლა
        </button>

        <p
          onClick={() => {
            setNewCategory({ id: uuidv4(), name: "", description: "" });
          }}
          className="mr-[10px]  pt-3 cursor-pointer"
        >
          შექმნა
        </p>
      </div>

      <div className="w-[90%] mx-auto">
        {newCategory && (
          <SimpleCard
            key={newCategory.id}
            data={{
              id: newCategory.id,
              name: newCategory.name,
              description: newCategory.description,
            }}
            onDelete={deleteCategoryHandler}
            undoUpdate={() => setNewCategory(null)}
            editing={true}
            saveCategory={createNewCategory}
          />
        )}

        {categories.map((category) => {
          return (
            <SimpleCard
              key={category._id}
              onDelete={deleteCategoryHandler}
              data={{
                id: category._id,
                name: category.name,
                description: category.description,
              }}
              saveCategory={saveCategory}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
