import { useState } from "react";
import { ISaveCategoryCredentials } from "../../interfaces";

const SimpleCard = ({
  data,
  saveCategory,
  editing,
  undoUpdate,
  onDelete,
}: {
  data: { name: string; description?: string; id: string };
  editing?: boolean;
  saveCategory: (credentials: ISaveCategoryCredentials) => Promise<void>;
  undoUpdate?: () => void;
  onDelete: (id: string) => Promise<void>;
}) => {
  const [isEditing, setIsEditing] = useState(editing || false);
  const [category, setCategory] = useState({
    name: data.name,
    description: data.description,
  });

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    if (category.name) {
      await saveCategory({
        id: data.id,
        name: category.name,
        description: category.description,
      });

      setIsEditing(false);
    }
  };

  return (
    <div className="my-[10px] bg-gray-100 border border-gray-300 shadow-sm px-4 py-2 rounded-lg flex flex-col justify-between hover:bg-gray-200 transition-colors duration-150">
      {isEditing ? (
        <>
          <input
            className="font-bold text-lg border p-1 rounded"
            value={category.name}
            placeholder="დასახელება"
            autoFocus
            required
            onChange={(e) =>
              setCategory((category) => ({ ...category, name: e.target.value }))
            }
          />
          <textarea
            className="text-gray-600 text-sm mt-2 border p-1 rounded"
            value={category.description || ""}
            placeholder="დამატებითი ინფორმაცია"
            onChange={(e) =>
              setCategory((category) => ({
                ...category,
                description: e.target.value,
              }))
            }
          />
        </>
      ) : (
        <>
          <h2 className="font-bold text-lg">{category.name}</h2>
          {category.description && (
            <p className="text-gray-600 text-sm ">{category.description}</p>
          )}
        </>
      )}
      <div
        className={`flex justify-end space-x-2 ${
          category.description ? "mt-1" : ""
        }`}
      >
        {isEditing ? (
          <div>
            <button
              className="text-blue-500 hover:text-blue-700 transition-colors duration-150 mr-3"
              onClick={handleSave}
            >
              შენახვა
            </button>
            <button
              onClick={() => {
                if (undoUpdate) {
                  undoUpdate();
                }
                setIsEditing(false);
              }}
              className="text-red-500 hover:text-red-700 transition-colors duration-150"
              aria-label="Delete"
            >
              გამოსვლა
            </button>
          </div>
        ) : (
          <button
            className="text-blue-500 hover:text-blue-700 transition-colors duration-150"
            onClick={handleEdit}
          >
            განახლება
          </button>
        )}
        {!isEditing && (
          <button
            onClick={() => onDelete(data.id)}
            className="text-red-500 hover:text-red-700 transition-colors duration-150"
            aria-label="Delete"
          >
            წაშლა
          </button>
        )}
      </div>
    </div>
  );
};

export default SimpleCard;
