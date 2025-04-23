// src/features/services/bingo.ts
import axios from 'axios';

export interface BingoCardData {
  _id: string;
  moduleId: {
    _id?: string;
    title?: string;
  };
  index: number;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const generateBingoCards = async (moduleId: string) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/bingo/generate/${moduleId}`,
      {},
      { withCredentials: true }
    );
    console.log("API URL:", `${process.env.NEXT_PUBLIC_API_BASE_URL}/bingo/generate/${moduleId}`);

    return res.data; // Trả về danh sách bingo cards đã tạo

  } catch (error) {
    throw new Error('Failed to generate bingo cards');
  }
};

export const getBingoCardByIndex = async (moduleId: string, index: number) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bingo/show/${moduleId}/${index}`);
    return res.data; // Trả về chi tiết 1 bingo card
  } catch (error) {
    throw new Error('Failed to fetch bingo card');
  }
};

export const downloadBingoPDF = async (moduleId: string) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bingo/download/pdf/${moduleId}`, {
      responseType: 'blob', // Quan trọng để xử lý PDF
    });

    // Tạo link tải về
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'MIL_BINGO_Player_card.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    throw new Error('Failed to download bingo PDF');
  }
};
