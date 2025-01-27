import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../../components/Message";
import Loader from "../../../components/Loader";
import {
  useGetStoresQuery,
  useDeleteStoreMutation,
  useCreateStoreMutation
} from "../../../slices/storesApiSlice";
import { toast } from "react-toastify";
import Paginate from "../../../components/Paginate";
import SearchBox from "../../../components/SearchBox";
import distance from "../../../utils/distance";


const StoresList = () => {
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const { pageNumber, keyword } = useParams();
  const navigate = useNavigate();
  const { data, refetch, isLoading, error } = useGetStoresQuery({
    keyword,
    pageNumber,
  });


  useEffect(() => {
    refetch();
  }, [data]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);

  const [deleteStore] = useDeleteStoreMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("האם אתה בטוח?")) {
      try {
        await deleteStore(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createStore, { isLoading: loadingCreate }] =
    useCreateStoreMutation();

  const createStoreHandler = async () => {
    if (window.confirm('האם אתה בטוח שאתה רוצה ליצור חנות חדשה?')) {
      try {
        const { data: newStore } = await createStore();
        navigate(`/admin/store/${newStore._id}/edit`);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <h1>חנויות</h1>
      <div className="d-flex justify-content-between">
        <SearchBox route={"/admin/stores"} />
        <Button type='button' variant='warning' className='my-3' onClick={createStoreHandler}>
          צור חנות חדשה
        </Button>
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>רשת</th>
                <th>שם</th>
                <th>כתובת</th>
                <th>מרחק</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.stores.map((store) => (
                <tr key={store._id}>
                  <td>{store.chain ? store.chain.name : ""}</td>
                  <td>{store.name}</td>
                  <td>{store.address.street + ", " + store.address.city}{store.address.postalCode ? ", " + store.address.postalCode : null}</td>
                  <td>
                    {distance(31.2775636, store.location.latitude, 34.7982254, store.location.longitude).toFixed(2)} ק"מ
                  </td>
                  <td>
                    <>
                      <LinkContainer
                        to={`/admin/store/${store._id}/edit`}
                        style={{ marginRight: "10px" }}
                      >
                        <Button variant="light" className="btn-sm mx-2">
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(store._id)}
                      >
                        <FaTrash style={{ color: "white" }} />
                      </Button>
                    </>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate
            page={data.page}
            pages={data.pages}
            isAdmin={true}
            route={"stores"}
          />
        </>
      )}
    </>
  );
};

export default StoresList;
