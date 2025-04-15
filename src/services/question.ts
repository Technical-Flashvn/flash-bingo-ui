import axios from 'axios';

// [GET] Lấy tất cả câu hỏi theo moduleId
export const getQuestionsByModule = async (moduleId: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/question/show/all/${moduleId}`
    );

    const data = res.data;

    if (Array.isArray(data)) {
      return { questions: data };
    } else if (Array.isArray(data.questions)) {
      return { questions: data.questions };
    } else {
      return { questions: [] };
    }
  } catch (error) {
    return { questions: [] };
  }
};



// [GET] Lấy chi tiết câu hỏi theo questionId
export const getQuestionById = async (questionId: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/question/show/${questionId}`
    );
    return res.data;
  } catch (error) {
    return null;
  }
};

// [POST] Tạo câu hỏi mới cho 1 module
export const createQuestion = async (
  moduleId: string,
  questionData: {
    title: string;
    keyword: string;
    correctAnswer: string;
    wrongAnswers: string[];
  }
) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/question/create/${moduleId}`,
      questionData,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    throw new Error('Failed to create question');
  }
};

// [PATCH] Cập nhật câu hỏi theo questionId
export const updateQuestion = async (
  questionId: string,
  updateData: {
    title: string;
    keyword: string;
    correctAnswer: string;
    wrongAnswers: string[];
  }
) => {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/question/update/${questionId}`,
      updateData,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    throw new Error('Failed to update question');
  }
};

// [DELETE] Xoá câu hỏi theo questionId
export const deleteQuestion = async (questionId: string) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/question/delete/${questionId}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    throw new Error('Failed to delete question');
  }
};
