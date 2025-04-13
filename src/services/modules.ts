// src/services/modules.ts
import axios from 'axios';

// [GET] /module/show/all
export const getAllModules = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/module/show/all`,
      { withCredentials: true },
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// [GET] /module/show/:moduleId
export const getModuleById = async (moduleId: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/module/show/${moduleId}`,
      { withCredentials: true },
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// [POST] /module/search
export const searchModules = async (query: string) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/module/search`,
      { query },
      { withCredentials: true },
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// [POST] /module/create
export const createModule = async (
  title: string,
  keywords: string[],
) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/module/create`,
      { title, keywords },
      { withCredentials: true },
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// [PUT] /module/update/:moduleId
export const updateModule = async (
  moduleId: string,
  title: string,
  keywords: string[],
) => {
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/module/update/${moduleId}`,
      { title, keywords },
      { withCredentials: true },
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// [DELETE] /module/delete/:moduleId
export const deleteModule = async (moduleId: string) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/module/delete/${moduleId}`,
      { withCredentials: true },
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
