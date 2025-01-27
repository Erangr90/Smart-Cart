import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Image } from "react-bootstrap";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../../components/Message";
import Loader from "../../../components/Loader";
import {
  useDeletePriceMutation,
} from "../../../slices/pricesApiSlice";
import {
  useGetStoreQuery,
  useUpdateStoreMutation,
} from "../../../slices/storesApiSlice";
import { toast } from "react-toastify";
import Paginate from "../../../components/Paginate";
import SearchBox from "../../../components/SearchBox";

const StorePricesList = () => {
  const navigate = useNavigate();
  const { id: storeId } = useParams();

  const { data: store, isLoading, error, refetch } = useGetStoreQuery(storeId);



  useEffect(() => {
    refetch();
  }, [store]);

  const [deletePrice] = useDeletePriceMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("האם אתה בטוח?")) {
      try {
        await deletePrice(id);
        refetch();
      } catch (err) {
        toast.error(err?.store?.message || err.error);
      }
    }
  };


  const createPriceHandler = async () => {
    if (window.confirm('האם אתה בטוח שאתה רוצה ליצור מחיר חדש?')) {
      try {
        navigate(`/admin/price/create`)
      } catch (err) {
        toast.error(err?.store?.message || err.error);
      }
    }
  }


  return (
    <>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.store?.message || error.error}
        </Message>
      ) : (
        <>
          {
            store.chain ? <h1>מחירים ברשת {store.chain.name} סניף: {store.name}</h1> : <h1>מחירים {store.name}</h1>
          }
          {
                store.image && <Image src={`/api/${store.image}`} rounded className="w-25 m-1" />
          }
          <div className="d-flex justify-content-between">
            <SearchBox route={"/admin/prices"} />
            <Button type='button' variant='warning' className='my-3' onClick={createPriceHandler}>
              צור מחיר חדש
            </Button>
          </div>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>מוצר</th>
                <th>חנות</th>
                {
                  store.chain ? <th>רשת</th> : null
                }

                <th>מחיר</th>
                {
                  store.chain ? null : <th></th>
                }

              </tr>
            </thead>
            <tbody>
              {
                console.log("22", store.prices[0])
              }
              {store.prices && store.prices.length > 0 && store.prices.map((price) => (
                <tr key={price._id}>
                  <td>{price.product.name}</td>
                  <td>{store.name}</td>
                  {
                    price.chain ? <td> {store.chain.name} </td> : null
                  }
                  <td>{price.number}</td>
                  {
                    store.chain ? null : (
                      <td>
                        <>
                          <LinkContainer
                            to={`/admin/price/${price._id}/edit`}
                            style={{ marginRight: "10px" }}
                          >
                            <Button variant="light" className="btn-sm mx-2">
                              <FaEdit />
                            </Button>
                          </LinkContainer>
                          <Button
                            variant="danger"
                            className="btn-sm"
                            onClick={() => deleteHandler(price._id)}
                          >
                            <FaTrash style={{ color: "white" }} />
                          </Button>
                        </>
                      </td>

                    )
                  }
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate
            page={store.page}
            pages={store.pages}
            isAdmin={true}
            route={"prices"}
          />
        </>
      )}
    </>
  );
};

export default StorePricesList;
