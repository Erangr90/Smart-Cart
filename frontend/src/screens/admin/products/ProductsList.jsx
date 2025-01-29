import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../../components/Message";
import Loader from "../../../components/Loader";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
  useCreateProductMutation
} from "../../../slices/productsApiSlice";
import { toast } from "react-toastify";
import Paginate from "../../../components/Paginate";
import SearchBox from "../../../components/SearchBox";


const ProductsList = () => {
  let { pageNumber, keyword, category } = useParams();
  const navigate = useNavigate();
  const { data, refetch, isLoading, error } = useGetProductsQuery({
    keyword,
    category,
    pageNumber,
  });

  useEffect(() => {
    refetch();
  }, [data, keyword, category, pageNumber]);



  const [deleteProduct] = useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const createProductHandler = async () => {
    if (window.confirm('האם אתה בטוח שאתה רוצה ליצור מוצר חדש?')) {
      try {
        const { data: newProduct } = await createProduct();
        navigate(`/admin/product/${newProduct._id}/edit`);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  return (
    <>
      <h1>מוצרים</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <div className="d-flex justify-content-between">
            <SearchBox route={"/admin/products"} pageNumber={pageNumber = 1} />
            <Button type='button' variant='warning' className='my-3' onClick={createProductHandler}>
              צור מוצר חדש
            </Button>
          </div>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>קטגוריה</th>
                <th>שם</th>
                <th>תיאור</th>
                <th>יצרן</th>
                <th>מדינה</th>
                <th>ברקוד</th>
                <th>כמות</th>
                {/* <th>מחיר</th> */}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product.category.name}</td>
                  <td>
                    {product.name}
                  </td>
                  <td>{product.description}</td>
                  <td>{product.manufacturer}</td>
                  <td>{product.country + " " + product.country_code}</td>
                  <td>{product.barcode}</td>
                  <td>{product.measure + " " + product.unitOfMeasure}</td>
                  {/* <td>{product.price.number}</td> */}
                  <td>
                    <>
                      <LinkContainer
                        to={`/admin/product/${product._id}/edit`}
                        style={{ marginRight: "10px" }}
                      >
                        <Button variant="light" className="btn-sm mx-2">
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(product._id)}
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
            keyword={keyword || ""}
            pages={data.pages}
            isAdmin={true}
            route={"products"}
          />
        </>
      )}
    </>
  );
};

export default ProductsList;
