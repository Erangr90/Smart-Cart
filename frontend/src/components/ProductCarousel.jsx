
import Product from "./Product";
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";




const ProductCarousel = ({ productsIds }) => {

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };



  return (

    <Carousel rtl={true} responsive={responsive}>
      {
        productsIds.map((id) => (
          <Product className="mx-3" key={id} productId={id} />
        ))
      }
    </Carousel>



  );
};

export default ProductCarousel;
