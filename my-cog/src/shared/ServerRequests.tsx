

export const simpleGetRequest = async () => {
    fetch('http://localhost:5000/')
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error(error))
}
  
export const simplePostRequest = async () => {
  const data = { message: 'Hello, server!' }

  fetch('http://localhost:5000/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error(error))
}

export const getBasicGraphInfo = async () => {
  fetch('http://localhost:5000/graph')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error))
}

export async function apiGET<T>(url: string): Promise<T> {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json() as Promise<T>;
    })
}

