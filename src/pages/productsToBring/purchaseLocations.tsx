import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/reduxStore";
import { useNavigate } from "react-router-dom";
import SimpleCard from "../../Reusable/cards/simple-card.cards";
import { ISaveLocationCredentials } from "../../interfaces";
import { v4 as uuidv4 } from "uuid";
import {
  createPurchaseLocation,
  deletePurchaseLocation,
  getPurchaseLocations,
  updatePurchaseLocation,
} from "../../store/productsToBring/locations";

export const PurchaseLocations = () => {
  const [newLocation, setNewLocation] =
    useState<ISaveLocationCredentials | null>();

  const { locations } = useAppSelector(
    (state) => state.productPurchaseLocations
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getPurchaseLocations({}));
  }, []);

  const saveLocation = async (credentials: ISaveLocationCredentials) => {
    await dispatch(
      updatePurchaseLocation({
        id: credentials.id,
        updateData: {
          name: credentials.name,
          description: credentials.description,
        },
      })
    );
  };

  const deleteLocation = async (id: string) => {
    await dispatch(deletePurchaseLocation({ id }));
  };

  const createNewLocation = async (credentials: ISaveLocationCredentials) => {
    await dispatch(
      createPurchaseLocation({
        name: credentials.name,
        description: credentials.description,
      })
    );
    setNewLocation(null);
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
            setNewLocation({ id: uuidv4(), name: "", description: "" });
          }}
          className="mr-[10px]  pt-3 cursor-pointer"
        >
          შექმნა
        </p>
      </div>

      <div className="w-[90%] mx-auto">
        {newLocation && (
          <SimpleCard
            key={newLocation.id}
            data={{
              id: newLocation.id,
              name: newLocation.name,
              description: newLocation.description,
            }}
            onDelete={deleteLocation}
            undoUpdate={() => setNewLocation(null)}
            editing={true}
            saveCategory={createNewLocation}
          />
        )}

        {locations.map((location) => {
          return (
            <SimpleCard
              key={location._id}
              onDelete={deleteLocation}
              data={{
                id: location._id,
                name: location.name,
                description: location.description,
              }}
              saveCategory={saveLocation}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PurchaseLocations;
