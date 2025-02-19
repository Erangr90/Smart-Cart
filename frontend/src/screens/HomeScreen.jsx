

import ProductCarousel from "../components/ProductCarousel";





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
      <ProductCarousel productsIds={arr} />
    </>
  );
};

export default HomeScreen;
