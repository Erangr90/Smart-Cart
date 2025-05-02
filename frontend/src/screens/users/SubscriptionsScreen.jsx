
import Card from 'react-bootstrap/Card';
import React from 'react';

const SubscriptionsScreen = () => {
    const arr = [
        {
            id: "dasasas",
            name: "מנוי חודשי",
            price: 40,
            discount: 10,
            description: ""
        },
        {
            id: "kloniojh",
            name: "מנוי שנתי",
            price: 300,
            discount: 0,
            description: "הכי משתלם"
        },

    ];
    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="row">
                {
                    arr.map((sub) => {
                        return <div className="col-sm-6 d-flex justify-content-center" key={sub.id}>
                            <Card style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Title>{sub.name}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{sub.price}</Card.Subtitle>
                                    <Card.Text>
                                        {sub.description}
                                    </Card.Text>
                                    <Card.Link className='btn btn-primary my-3' href="#">לרכישה</Card.Link>
                                    {/* <Card.Link href="#">Another Link</Card.Link> */}
                                </Card.Body>
                            </Card>
                        </div>;
                    })
                }
            </div>
        </div>
    );

};

export default SubscriptionsScreen

