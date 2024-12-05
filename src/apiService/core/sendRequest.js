async function sendRequest(api_url, api_data, method) {
    let response;

    switch(method) {
        case 'POST' : 
            response = await fetch('/api' + api_url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(api_data)
            });
            break;

        case 'GET' :
            response = await fetch('/api' + api_url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            break;
    }

    if (!response.ok) {
        return {
            code: 404,
            message: "网络错误!"
        }; 
    }

    return response.json();
}

export default sendRequest;
