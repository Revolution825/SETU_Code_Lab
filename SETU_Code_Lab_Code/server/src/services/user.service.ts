import * as userModel from "../models/user.model";

export const getAllStudents = async () => {
    const students = await userModel.fetchAllStudents();
    return students;
}