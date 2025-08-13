import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

//Interfaces
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  userType: 'admin' | 'lecturer' | 'candidate';
  user: {
    user_id: number;
    username: string;
    name: string;
    surname: string;
  };
}

export interface UserTypeResponse {
  userType: 'admin' | 'lecturer' | 'candidate';
}

export interface ApplicationData {
  candidate_id: number;
  position: 'tutor' | 'lab_assistant';
  degree: string;
  level: string;
  skills: string;
  availability: string;
  course_code: string;
}

export interface ApplicationResult {
  success: boolean;
  course: string;
  error?: string;
}

export interface BulkApplicationResult {
  successCount: number;
  errorCount: number;
  errors: Array<{
    course: string;
    error: string;
  }>;
}




// Login user
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post('/users/login', credentials);
  return response.data;
};

//Signup
export const signup = async ({ role, firstName, lastName, email, password }) => {
  const user_id = email;
  return api.post('/users', {
    user_id,
    username: email,
    password,
    name: firstName,
    surname: lastName,
    role
  });
}; 

//get user by id
export const getUserById = async (userId: number): Promise<number> => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

//get type by id
export const getUserType = async (userId: number): Promise<UserTypeResponse> => {
  const response = await axios.get(`http://localhost:3001/api/users/type/${userId}`);
  return response.data;
};

// Single application submission
export const submitSingleApplication = async (applicationData: ApplicationData): Promise<any> => {
  const response = await axios.post('http://localhost:3001/api/applications/', applicationData);
  return response.data;
};

// Bulk application submission
export const submitMultipleApplications = async (
  baseData: Omit<ApplicationData, 'course_code'>,
  courseCodes: string[]
): Promise<BulkApplicationResult> => {
  let successCount = 0;
  let errorCount = 0;
  const errors: Array<{ course: string; error: string }> = [];

  for (const courseCode of courseCodes) {
    try {
      const applicationData: ApplicationData = {
        ...baseData,
        course_code: courseCode
      };

      const response = await submitSingleApplication(applicationData);
      console.log(response.course);
      successCount++;

    } catch (error: any) {
      console.error(error);
      errorCount++;
      errors.push({
        course: courseCode,
        error: error.response?.data?.error
      });
    }
  }

  return {
    successCount,
    errorCount,
    errors
  };
};

export const fetchApplicants = async (lecturerUserId: number) => {
  const response = await api.get(`/applications/applicants/${lecturerUserId}`);
  return response.data;
};

export const fetchLecturerCourseApplicants = async (lecturerId: number) => {
  const response = await api.get(`/courses/lecturer/${lecturerId}`);
  return response.data;
};

export const handleCandidateSelection = async (lecturerId: number, applicationId: number) => {
  const response = await api.post('/applications/select', {
    lecturer_id: lecturerId,
    application_id: applicationId,
  });
  return response.data;
};

export const saveComment = async (lecturerId: number, applicationId: number, comment: string) => {
  const response = await api.post('/applications/save-comment', {
    lecturer_id: lecturerId,
    application_id: applicationId,
    comment,
  });
  return response.data;
};