
import {
  useGetTopProductsQuery,
  useGetProductsByUserQuery
} from "../slices/productsApiSlice";
import { useEffect } from 'react';
import Product from "../components/Product";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";





const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const {
    data: products,
    isLoading,
    refetch,
    error,
  } = useGetTopProductsQuery();

  useEffect(() => {
    refetch();
  }, [products]);

  const { data, refetch: queryRefetch, isLoading: queryLoading, error: queryError } = useGetProductsByUserQuery({
    keyword,
    pageNumber,
  });

  useEffect(() => {
    queryRefetch();

  }, [keyword, pageNumber]);



  // console.log(data);
  return (
    <>
      {!keyword ?
        isLoading ? <Loader /> : error ? <Message>{error?.data?.message || error.error}</Message> :
          products && products.length > 0 &&
          <div className="horizontal-container">
            {products.map((pro, index) => (
              <Product key={index} product={pro} />
            ))}
          </div>
        :
        queryLoading ? <Loader /> : queryError ? <Message>{queryError?.data?.message}</Message> :
          data.products && data.products.length > 0 &&

          <div className="horizontal-container">
            {
              data.products.map((pro, index) => (
                <Product key={index} product={pro} />
              ))
            }
          </div>
      }

    </>
  );
};

export default HomeScreen;
