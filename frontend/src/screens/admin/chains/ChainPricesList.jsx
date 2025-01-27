import React, {useEffect} from "react";
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
  useGetChainQuery,
} from "../../../slices/chainsApiSlice";
import { toast } from "react-toastify";
import Paginate from "../../../components/Paginate";
import SearchBox from "../../../components/SearchBox";

const ChainPricesList = () => {
  const navigate = useNavigate();
  const { id: chainId } = useParams();

  const { data: chain, isLoading, error, refetch } = useGetChainQuery(chainId);



  useEffect(() => {
    refetch();
  }, [chain]);

  const [deletePrice] = useDeletePriceMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("האם אתה בטוח?")) {
      try {
        await deletePrice(id);
        refetch();
      } catch (err) {
        toast.error(err?.chain?.message || err.error);
      }
    }
  };


  const createPriceHandler = async ()=>{
    if (window.confirm('האם אתה בטוח שאתה רוצה ליצור מחיר חדש?')) {
      try {
        navigate(`/admin/price/create`)
      } catch (err) {
        toast.error(err?.chain?.message || err.error);
      }
    }
  }


  return (
    <>
      
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.chain?.message || error.error}
        </Message>
      ) : (
        <>
        <h1>מחירים ברשת {chain.name}</h1>
        {
                chain.image && <Image src={`/api/${chain.image}`} rounded className="w-25 m-1" />
        }
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
                <th>רשת</th>
                <th>מחיר</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {chain.prices && chain.prices.length > 0 && chain.prices.map((price) => (
                <tr key={price._id}>
                  <td>{price.product.name}</td>
                  <td>{price.chain.name}</td>
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
            page={chain.page}
            pages={chain.pages}
            isAdmin={true}
            route={"prices"}
          />
        </>
      )}
    </>
  );
};

export default ChainPricesList;
