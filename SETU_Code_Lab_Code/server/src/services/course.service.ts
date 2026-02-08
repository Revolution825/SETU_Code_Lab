import * as CourseModel from "../models/course.model";

export const getAllMyCourses = async (userId: number) => {
    const courses = await CourseModel.fetchCourseByUserId(userId);
    return courses;
}