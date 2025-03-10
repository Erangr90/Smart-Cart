import { useEffect, useState } from 'react';
import { Card, ListGroup, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';


import distance from "../utils/distance";


const Product = ({ product }) => {
    const [name, setName] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [barcode, setBarcode] = useState('');
    const [unitOfMeasure, setUnitOfMeasure] = useState('');
    const [measure, seMeasure] = useState(0);
    const [country, setCountry] = useState('');
    const [country_code, setCountry_code] = useState('');
    const [image, setImage] = useState('');
    const [prices, setPrices] = useState([]);
    const [position, setPosition] = useState({ latitude: null, longitude: null });
    const [stores, setStores] = useState([]);








    useEffect(() => {
        if (product) {
            setName(product.name);
            setManufacturer(product.manufacturer);
            setCategory(product.category);
            setDescription(product.description);
            setBarcode(product.barcode);
            setUnitOfMeasure(product.unitOfMeasure);
            seMeasure(product.measure);
            setImage(product.image);
            setCountry(product.country);
            setCountry_code(product.country_code);
            setPrices(product.prices);
        }
    }, [product]);

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
    }, []);

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

    useEffect(() => {
        if (prices) {
            setDis(prices);
        }
    }, [prices]);
    return (
        <>

            <Card style={{ width: '14rem' }} className="flex-item">

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Card.Img style={{ width: '8rem' }} variant="top" src={`/api/${image}`} />
                </div>
                <Card.Body>
                    <Card.Title>{name}</Card.Title>
                    <Card.Text>
                        {description + ", " + manufacturer + "."}
                    </Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    <ListGroup.Item>{String(prices[0]?.number.toFixed(2)) + ` ש"ח`}{" - "}{stores[0]?.name + ", " + stores[0]?.dis + ` ק"מ` + "."}</ListGroup.Item>
                    <ListGroup.Item>{String(prices[1]?.number.toFixed(2)) + ` ש"ח`}{" - "}{stores[1]?.name + ", " + stores[1]?.dis + ` ק"מ` + "."}</ListGroup.Item>
                    <ListGroup.Item>{String(prices[2]?.number.toFixed(2)) + ` ש"ח`}{" - "}{stores[2]?.name + ", " + stores[2]?.dis + ` ק"מ` + "."}</ListGroup.Item>
                </ListGroup>
                <Card.Body>
                    <Stack gap={2}>
                        <Link className='btn btn-light my-3' to={`/product/${product._id}`}>
                            הצג מוצר
                        </Link>
                        {/* <Card.Link href="#">הצג מוצר</Card.Link> */}
                        {/* <Card.Link href="#">כל המחירים בעיר</Card.Link> */}
                    </Stack>
                </Card.Body>
            </Card>

        </>
    );
};

export default Product;
