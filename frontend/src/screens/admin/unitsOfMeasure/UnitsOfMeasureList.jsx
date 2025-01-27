import React, {useEffect} from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../../components/Message";
import Loader from "../../../components/Loader";
import {
  useGetUnitsOfMeasureQuery,
  useDeleteUnitOfMeasureMutation,
  useCreateUnitOfMeasureMutation
} from "../../../slices/unitOfMeasureApiSlice";
import { toast } from "react-toastify";
import Paginate from "../../../components/Paginate";
import SearchBox from "../../../components/SearchBox";

const UnitsOfMeasureList = () => {
  const { pageNumber, keyword } = useParams();
  const navigate = useNavigate();
  const { data, refetch, isLoading, error } = useGetUnitsOfMeasureQuery({
    keyword,
    pageNumber,
  });


  useEffect(() => {
    refetch();
  }, [data]);

  const [deleteUnitOfMeasure] = useDeleteUnitOfMeasureMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("האם אתה בטוח?")) {
      try {
        await deleteUnitOfMeasure(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createUnitOfMeasure ,{ isLoading: loadingCreate }] =
  useCreateUnitOfMeasureMutation();

  const createUnitOfMeasureHandler = async ()=>{
    if (window.confirm('האם אתה בטוח שאתה רוצה ליצור יחידת מידה חדש?')) {
      try {
        const {data:newUnit} = await createUnitOfMeasure()
        navigate(`/admin/unitOfMeasure/${newUnit._id}/edit`)
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  }

  return (
    <>
      <h1>יחידות מידה</h1>
      <div className="d-flex justify-content-between">
            <SearchBox route={"/admin/unitsOfMeasure"}/>
            <Button type='button' variant='warning' className='my-3' onClick={createUnitOfMeasureHandler}>
              צור יחידת מידה חדשה
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
                <th>שם בעברית</th>
                <th>שם באנגלית</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((unitOfMeasure) => (
                <tr key={unitOfMeasure._id}>
                  <td>{unitOfMeasure.name_he}</td>
                  <td>{unitOfMeasure.name_en}</td>
                  <td>
                    <>
                      <LinkContainer
                        to={`/admin/unitOfMeasure/${unitOfMeasure._id}/edit`}
                        style={{ marginRight: "10px" }}
                      >
                        <Button variant="light" className="btn-sm mx-2">
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(unitOfMeasure._id)}
                      >
                        <FaTrash style={{ color: "white" }} />
                      </Button>
                    </>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default UnitsOfMeasureList;
