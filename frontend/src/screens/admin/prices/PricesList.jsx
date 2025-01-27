import React, {useEffect} from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../../components/Message";
import Loader from "../../../components/Loader";
import {
    useGetPricesQuery,
    useDeletePriceMutation,
} from "../../../slices/pricesApiSlice";
import { toast } from "react-toastify";
import Paginate from "../../../components/Paginate";
import SearchBox from "../../../components/SearchBox";

const PricesList = () => {
  const { pageNumber, keyword } = useParams();
  const navigate = useNavigate();
  const { data, refetch, isLoading, error } = useGetPricesQuery({
    keyword,
    pageNumber,
  });


  useEffect(() => {
    refetch();
  }, [data]);

  const [deletePrice] = useDeletePriceMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("האם אתה בטוח?")) {
      try {
        await deletePrice(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };


  const createPriceHandler = async ()=>{
    if (window.confirm('האם אתה בטוח שאתה רוצה ליצור מחיר חדש?')) {
      try {
        navigate(`/admin/price/create`)
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  }


  return (
    <>
      <h1>מחירים</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <div className="d-flex justify-content-between">
            <SearchBox route={"/admin/prices"}/>
            <Button type='button' variant='warning' className='my-3' onClick={createPriceHandler}>
                צור מחיר חדש
            </Button>
          </div>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>מוצר</th>
                <th>חנות</th>
                <th>רשת</th>
                <th>מחיר</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.prices && data.prices.length > 0 && data.prices.map((price) => (
                <tr key={price._id}>
                  <td>{price.product.name}</td>
                  <td>{price.store ? price.store.name : ""}</td>
                  <td>
                    {
                        price.chain ? price.chain.name : ""
                    }
                  </td>
                  <td>{price.number}</td> 
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
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate
            page={data.page}
            pages={data.pages}
            isAdmin={true}
            route={"prices"}
          />
        </>
      )}
    </>
  );
};

export default PricesList;
