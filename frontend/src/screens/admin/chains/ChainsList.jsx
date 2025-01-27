import React, {useEffect} from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../../components/Message";
import Loader from "../../../components/Loader";
import {
    useGetChainsQuery,
    useDeleteChainMutation,
    useCreateChainMutation
} from "../../../slices/chainsApiSlice";
import { toast } from "react-toastify";
import Paginate from "../../../components/Paginate";
import SearchBox from "../../../components/SearchBox";

const ChainsList = () => {
  const { pageNumber, keyword } = useParams();
  const navigate = useNavigate();
  const { data, refetch, isLoading, error } = useGetChainsQuery({
    keyword,
    pageNumber,
  });



  useEffect(() => {
    refetch();
  }, [data]);

  const [deleteChain] = useDeleteChainMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("האם אתה בטוח?")) {
      try {
        await deleteChain(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createChain, { isLoading: loadingCreate }] =
  useCreateChainMutation();

  const createChainHandler = async ()=>{
    if (window.confirm('האם אתה בטוח שאתה רוצה ליצור רשת חדשה?')) {
      try {
        const {data:newChain} = await createChain()
        navigate(`/admin/chain/${newChain._id}/edit`)
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  }



  return (
    <>
      <h1>רשתות</h1>
      <div className="d-flex justify-content-between">
            <SearchBox route={"/admin/chains"}/>
            <Button type='button' variant='warning' className='my-3' onClick={createChainHandler}>
              צור רשת חדשה
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
                <th>שם</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.chains.map((chain) => (
                <tr key={chain._id}>
                  <td>{chain.name}</td>
                  <td>
                    <>
                      <LinkContainer
                        to={`/admin/chain/${chain._id}/edit`}
                        style={{ marginRight: "10px" }}
                      >
                        <Button variant="light" className="btn-sm mx-2">
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(chain._id)}
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
            route={"chains"}
          />
        </>
      )}
    </>
  );
};

export default ChainsList;
