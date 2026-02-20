import * as userModel from "../models/user.model";

export const getAllStudents = async () => {
    const students = await userModel.fetchAllStudents();
    return students;
}

export const getStudentsOnCourse = async (course_id: number) => {
    const students = await userModel.fetchStudentsOnCourse(course_id);
    return students;
}

export const getUserData = async (user_id: number) => {
    const userData = await userModel.fetchUserData(user_id);
    return userData;
}

export const deleteUserAccount = async (user_id: number) => {
    await userModel.deleteAccount(user_id);
}