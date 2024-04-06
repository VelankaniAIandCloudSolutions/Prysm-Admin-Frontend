import { jwtDecode } from "jwt-decode";

export const validateToken = () => {
  var decoded = getDecodedToken();
  if (decoded !== null) {
    if (decoded.exp * 1000 < Date.now()) {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.clear();
      window.location.reload();
      sessionStorage.removeItem("persist:root");
    }
  }
};
export const getDecodedToken = () => {
  var token = sessionStorage.getItem("user");
  if (token !== "" && token !== null) {
    var decoded = jwtDecode(token);
    return decoded;
  } else return null;
};

export const getDecodedTokenDataTicket = () => {
  var token = sessionStorage.getItem("user");
  const tokenObj = jwtDecode(token);
  const userId = tokenObj.userId;
  const role = tokenObj.role;
  const isStaff = tokenObj.isStaff;
  return {
    userId: userId,
    role: role,
    isStaff: isStaff,
  };
};

export const logout = () => {
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.clear();
  window.location.reload();
  sessionStorage.removeItem("persist:root");
};
