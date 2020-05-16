//const url = `http://10.8.0.206:8093/users`;
//const url = `http://localhost:8010/proxy/users`;

//const url =`http://10.8.0.206:8093/projects`;
//const url = `http://localhost:8010/proxy/projects`

// http://10.8.0.206:8093/costs/byUser/70/2020-04-19/2020-04-27
// http://localhost:8010/proxy/costs/byUser/70/2020-04-19/2020-04-27

//  //lcp --proxyUrl http://10.8.0.206:8093

async function Ajax(url, method, body) {
  if(!method) method = 'GET'
  
  if (method === 'POST') {
    var response = await fetch(url, {
      mode: `cors`,
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      success: function(data) {
        if (data.status === 'OK')
          alert('Сохранено');
        else
          alert('Ошибка: ' + data.status + ', ' + data.errorMessage);
      }
    })
  }
  else if (method === 'GET') {
    response = await fetch(url, {
      mode: `cors`,
      method
    })
  }
  
  response = await response.json()
  
  return response
}

export default Ajax
