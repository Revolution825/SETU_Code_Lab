import * as userModel from "../models/user.model";

export const getAllStudents = async () => {
    const students = await userModel.fetchAllStudents();
    return students;
}

export const getStudentsOnCourse = async (course_id: number) => {
    const students = await userModel.fetchStudentsOnCourse(course_id);
    return students;
}