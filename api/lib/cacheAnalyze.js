import fs from 'fs';

const getMostAccessedEndpoints = (logFilePath, topN = 10) => {
    const logs = fs.readFileSync(logFilePath, 'utf-8').split('\n');

    const endpointCounts = {};

    logs.forEach(log => {
        if (log) {
            const logObj = JSON.parse(log);
            const endpoint = logObj.url;
            endpointCounts[endpoint] = (endpointCounts[endpoint] || 0) + 1;
        }
    });

    const sortedEndpoints = Object.entries(endpointCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN);

    return sortedEndpoints;
};

export default getMostAccessedEndpoints

