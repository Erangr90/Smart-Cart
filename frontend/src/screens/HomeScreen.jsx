
import {
  useGetTopProductsQuery
} from "../slices/productsApiSlice";
import { useEffect } from 'react';
import Product from "../components/Product";




const HomeScreen = () => {

  const {
    data: products,
    isLoading,
    refetch,
    error,
  } = useGetTopProductsQuery();

  useEffect(() => {
    refetch();
  }, [products]);



  console.log(products);
  return (
    <>
      {
        products && products.length > 0 &&
        <div className="horizontal-container">
          {products.map((pro) => (
            <Product product={pro} />
          ))}
        </div>
      }
    </>
  );
};

export default HomeScreen;
