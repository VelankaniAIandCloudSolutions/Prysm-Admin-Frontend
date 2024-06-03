import axios from "axios";

// const API_URL = process.env.REACT_APP_VELANKANI_API_URL;
// const API_URL = "https://prysmsupportdev.xtractautomation.com/";
// const API_URL = "http://localhost:3000/";
let API_URL;

if (process.env.NODE_ENV === "production") {
  API_URL = "https://prysmsupportdev.xtractautomation.com/";
} else {
  API_URL = "http://localhost:3000/";
}
// const PRSMSHOP_API_URL = "https://prysmdev.xtractautomation.com/api/v1";
const PRSMSHOP_API_URL = "http://127.0.0.1:8000/api/v1";

export const AuthHeader = () => {
  const user = sessionStorage.getItem("user");
  if (user) {
    return { Authorization: "Bearer " + user };
  } else {
    return {};
  }
};

export const Login = (body, path) => {
  return axios
    .post(API_URL + path, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      if (response.data.token) {
        sessionStorage.setItem("user", response.data.token);
      }
      return response.data;
    })
    .catch((error) => {
      console.error("There was an error!", error.message);
      if (error.response.status === 400) alert("Invalid Credentials");
      return null;
    });
};

export const DownloadFile = (path, body, fileNametosave) => {
  return axios
    .post(API_URL + path, body, {
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/octet-stream",
      },
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileNametosave);
      document.body.appendChild(link);
      link.click();
      link.remove();
    })
    .catch((error) => {
      console.error("There was an error!", error.message);
      if (error.response.status === 400) alert("Invalid Credentials");
      return null;
    });
};

export const getCrudApi = (path, body) => {
  const headers = AuthHeader();
  return axios
    .get(API_URL + path, { headers }, body)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error?.response?.status === 500) {
      } else {
        return null;
      }
    });
};

export const getPrysmApi = (path) => {
  return axios
    .get(path, {})
    .then((response) => {
      debugger;
      return response.data;
    })
    .catch((error) => {
      return null;
    });
};
export const postCrudApi = (path, body) => {
  const headers = AuthHeader();
  return axios
    .post(API_URL + path, body, { headers })
    .then((response) => {
      if (response.status === 201) {
      } else {
        console.error("Insert failed");
      }
      return response.data;
    })
    .catch((error) => {
      if (error?.response?.status === 500) {
      } else if (error?.response?.status === 400) {
        return 400;
      } else {
        console.error("Error inserting data:", error);
        console.error("There was an error!", error?.message);
        return null;
      }
    });
};
export const putCrudApi = (path, body) => {
  const headers = AuthHeader();
  return axios
    .put(API_URL + path, body, { headers })
    .then((response) => {
      if (response.status === 200) {
      } else {
        console.error("Update failed");
      }
      return response.data;
    })
    .catch((error) => {
      if (error?.response?.status === 500) {
      } else if (error?.response?.status === 400) {
        return 400;
      } else {
        console.error("Error updating data:", error);
        console.error("There was an error!", error?.message);
        return null;
      }
    });
};
export const deleteCrudApi = (path) => {
  const headers = AuthHeader();
  return axios
    .delete(API_URL + path, { headers })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error?.response?.status === 500) {
      } else {
        console.error("There was an error!", error?.message);
        return null;
      }
    });
};

export const getCrudShopApi = (path, body) => {
  return axios
    .get(`${PRSMSHOP_API_URL}${path}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error?.response?.status === 500) {
        console.error("Internal Server Error");
      } else {
        console.error(error);
      }
      return null;
    });
};

export const postCrudShopApi = (path, data) => {
  return axios
    .post(`${PRSMSHOP_API_URL}${path}`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error?.response?.status === 500) {
        console.error("Internal Server Error");
      } else {
        console.error(error);
      }
      return null;
    });
};

export const updateCrudShopApi = (path, data) => {
  return axios
    .put(`${PRSMSHOP_API_URL}${path}`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error?.response?.status === 500) {
        console.error("Internal Server Error");
      } else {
        console.error(error);
      }
      return null;
    });
};
