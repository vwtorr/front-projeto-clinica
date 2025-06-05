import axios, { AxiosError } from "axios";

const URL = "https://back-projetoclinica.onrender.com/";
function identifyVariable(data: any) {
  if (data instanceof FormData) {
    return true;
  } else if (typeof data === "object" && data !== null) {
    return false;
  }
}

export const post = async (endpoint: string, data: any, token?: string) => {
  try {

    const response = await axios.post(`${URL}${endpoint}`, data, {
      headers: {
        "Content-Type": identifyVariable(data)
          ? "multipart/form-data"
          : "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      data: response?.data,
      status: response?.status,
    };
  } catch (error: unknown) {
    const { response } = error as AxiosError<{
      message: string;
      statusCode: number;
    }>;

    return {
      data: response?.data,
      status: response?.status,
    };
  }
};

export const get = async (endpoint: string, token: string) => {
  try {
    const response = await axios.get(`${URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      data: response?.data,
      status: response?.status,
    };
  } catch (error: unknown) {
    const { response } = error as AxiosError<{
      message: string;
      statusCode: number;
    }>;

    return {
      data: response?.data,
      status: response?.status,
    };
  }
};

export const del = async (endpoint: string, token: string) => {
  try {
    const response = await axios.delete(`${URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      data: response?.data,
      status: response?.status,
    };
  } catch (error: unknown) {
    const { response } = error as AxiosError<{
      message: string;
      statusCode: number;
    }>;

    return {
      data: response?.data,
      status: response?.status,
    };
  }
};

export const put = async (endpoint: string, data: any, token?: string) => {
  try {
    const response = await axios.patch(`${URL}${endpoint}`, data, {
      headers: {
        "Content-Type": identifyVariable(data)
          ? "multipart/form-data"
          : "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      data: response?.data,
      status: response?.status,
    };
  } catch (error: unknown) {
    const { response } = error as AxiosError<{
      message: string;
      statusCode: number;
    }>;

    return {
      data: response?.data,
      status: response?.status,
    };
  }
};
