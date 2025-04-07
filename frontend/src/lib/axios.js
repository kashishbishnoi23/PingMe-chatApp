import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
    withCredentials:true // send cookies with every request
})


// now send requests like -> axios.get() for get requests, axios.post() for post requests 

// why to use axios and not fetch??

// because axios makes it easier -> and makes the code cleaner:

// axios automatically parses json(), jabki fetch me hame manually krna padta hai

/*
axios.get("https://api.example.com/data")
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
*/

/*
fetch("https://api.example.com/data")
  .then(response => response.json()) // Must convert response to JSON
  .then(data => console.log(data))
  .catch(error => console.error(error));
*/


/*  axios automatically rejects the catch block for any HTTP error (e.g., 404, 500).
fetch does not throw errors for failed responses. You must manually check response.ok.

fetch("https://api.example.com/data")
  .then(response => {
    if (!response.ok) throw new Error("Request failed!");
    return response.json();
  })
  .catch(error => console.error(error));


  In axios, this is automatic:

axios.get("https://api.example.com/data")
  .then(response => console.log(response.data))
  .catch(error => console.error(error)); // Automatically handles errors
*/