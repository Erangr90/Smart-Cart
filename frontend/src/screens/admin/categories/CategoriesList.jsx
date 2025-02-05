import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaTrash, FaEdit, FaCheck, } from "react-icons/fa";
import Message from "../../../components/Message";
import Loader from "../../../components/Loader";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
  useCreateCategoryMutation,
} from "../../../slices/categoriesApiSlice";
import { toast } from "react-toastify";
import Paginate from "../../../components/Paginate";
import SearchBox from "../../../components/SearchBox";
import { useSelector } from 'react-redux';



const CategoriesList = () => {


  const { pageNumber, keyword } = useParams();
  const navigate = useNavigate();
  const { data, refetch, isLoading, error } = useGetCategoriesQuery({
    keyword,
    pageNumber,
  });





  useEffect(() => {
    refetch();
  }, [data]);



  const [deleteCategory] = useDeleteCategoryMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("האם אתה בטוח?")) {
      try {
        await deleteCategory(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };


  const [createCategory, { isLoading: loadingCreate }] =
    useCreateCategoryMutation();

  const createCategoryHandler = async () => {
    if (window.confirm('האם אתה בטוח שאתה רוצה ליצור קטגוריה חדשה?')) {
      try {
        const { data: newCategory } = await createCategory();
        navigate(`/admin/category/${newCategory._id}/edit`);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <h1>קטגוריות</h1>
      <div className="d-flex justify-content-between">
        <SearchBox route={"/admin/categories"} />
        <Button type='button' variant='warning' className='my-3' onClick={createCategoryHandler}>
          צור קטגוריה
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
            <tbody >
              {data.categories.map((category) => (
                <tr key={category._id}>
                  <>

                    <td>{category.name}</td>
                    <td>
                      <LinkContainer
                        to={`/admin/category/${category._id}/edit`}
                        style={{ marginRight: "10px" }}
                      >
                        <Button variant="light" className="btn-sm mx-2">
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        variant="danger"
                        className="btn-sm  mx-3"
                        onClick={() => deleteHandler(category._id)}
                      >
                        <FaTrash style={{ color: "white" }} />
                      </Button>
                    </td>
                  </>

                </tr>

              ))}
            </tbody>

          </Table>
          <Paginate
            page={data.page}
            pages={data.pages}
            isAdmin={true}
            route={"categories"}
          />
        </>
      )}


    </>
  );
};

export default CategoriesList;
