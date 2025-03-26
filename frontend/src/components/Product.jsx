import { useEffect, useState } from 'react';
import { Card, ListGroup, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';


import distance from "../utils/distance";


const Product = ({ product }) => {
    const [position, setPosition] = useState({ latitude: null, longitude: null });
    const [stores, setStores] = useState([]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                setPosition({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            });
        } else {
            console.log("Geolocation is not available in your browser.");
        }
        setDis(product.prices);

    }, [position]);

    const sortByDis = (arr) => {
        return arr.sort((a, b) => {
            if (a.dis < b.dis) {
                return -1;
            }
            if (a.dis > b.dis) {
                return 1;
            }
            return 0;
        });
    };


    const setDis = (prices) => {
        let arr = [];
        for (let price of prices) {
            if (price?.store) {
                let dis = distance(position.latitude, price?.store.location.latitude, position.longitude, price?.store.location.longitude).toFixed(2);
                arr.push({
                    ...price.store,
                    dis: dis
                });
            } else {
                let tempStores = [];
                if (price?.chain) {
                    for (let store of price?.chain?.stores) {
                        let dis = distance(position.latitude, store?.location.latitude, position.longitude, store?.location.longitude).toFixed(2);
                        tempStores.push({
                            ...store,
                            dis: dis
                        });
                    }
                    tempStores = sortByDis(tempStores);
                    arr.push(tempStores[0]);

                }

            }
        }
        setStores(arr);

    };
    return (
        <>
            {product.prices[0] &&
                <Card style={{ width: '14rem' }} className="flex-item">

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Card.Img style={{ width: '8rem' }} variant="top" src={`/api/${product.image}`} />
                    </div>
                    <Card.Body>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>
                            {product.description + ", " + product.manufacturer + "."}
                        </Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroup.Item>{String(product.prices[0]?.number.toFixed(2)) + ` ש"ח`}{" - "}{stores[0]?.name + ", " + stores[0]?.dis + ` ק"מ` + "."}</ListGroup.Item>
                        <ListGroup.Item>{String(product.prices[1]?.number.toFixed(2)) + ` ש"ח`}{" - "}{stores[1]?.name + ", " + stores[1]?.dis + ` ק"מ` + "."}</ListGroup.Item>
                        <ListGroup.Item>{String(product.prices[2]?.number.toFixed(2)) + ` ש"ח`}{" - "}{stores[2]?.name + ", " + stores[2]?.dis + ` ק"מ` + "."}</ListGroup.Item>
                    </ListGroup>
                    <Card.Body>
                        <Stack gap={2}>
                            <Link className='btn btn-light my-3' to={`/product/${product._id}`}>
                                הצג מוצר
                            </Link>
                        </Stack>
                    </Card.Body>
                </Card>
            }



        </>
    );
};

export default Product;
