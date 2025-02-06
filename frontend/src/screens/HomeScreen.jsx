

import Product from "../components/Product";
import ProductCarousel from "../components/ProductCarousel";
import '../assets/styles/index.css';





const arr = [
  '679bc8e95c8a420064a782bd',
  '679bc8e95c8a420064a782bd',
  '679bc8e95c8a420064a782bd',
  '679bc8e95c8a420064a782bd',
  '679bc8e95c8a420064a782bd'
];


const HomeScreen = () => {

  return (
    <>
      {/* <Product productId={'679bc8e95c8a420064a782bd'} /> */}
      <ProductCarousel productsIds={arr} />
    </>
  );
};

export default HomeScreen;
