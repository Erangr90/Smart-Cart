import React from 'react';
import { useParams } from 'react-router-dom';
function Calculation() {
    const { chainId } = useParams();

    return (
        <div>Calculation</div>
    );
}

export default Calculation;