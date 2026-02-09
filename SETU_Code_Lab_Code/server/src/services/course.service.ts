import { pool } from "../infrastructure/database";
import * as CourseModel from "../models/course.model";

export const getAllMyCourses = async (userId: number) => {
    const courses = await CourseModel.fetchCourseByUserId(userId);
    return courses;
}

export const getAllMyCreatedCourses = async (userId: number) => {
    const courses = await CourseModel.fetchCreatedCoursesByUserId(userId);
    return courses;
}

export const createNewCourse = async (
    user_id: number,
    course_title: string,
    course_description: string,
    problem_ids: number[],
    student_ids: number[]
) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const course = await CourseModel.insertCourse(
            client,
            user_id,
            course_title,
            course_description
        )
        const course_id = course.course_id;
        for (const problem_id of problem_ids) {
            await CourseModel.insertCourseProblem(
                client,
                course_id,
                problem_id
            )
        }
        for (const student_id of student_ids) {
            await CourseModel.insertEnrollment(
                client,
                course_id,
                student_id
            )
        }
        await client.query("COMMIT");
        return course;
    } catch (error: any) {
        await client.query("ROLLBACK");
        console.error("Error inside createNewCourse:", error);
        throw error;
    } finally {
        await client.release();
    }
}

export const updateExistingCourse = async (
    course_id: number,
    course_title: string,
    course_description: string,
    problem_ids: number[],
    student_ids: number[]
) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        await CourseModel.updateCourseDetails(client, course_id, course_title, course_description);

        await CourseModel.deleteCourseProblems(client, course_id);
        for (const problem_id of problem_ids) {
            await CourseModel.insertCourseProblem(
                client,
                course_id,
                problem_id
            )
        }

        await CourseModel.deleteEnrollmentsByCourseId(client, course_id);
        for (const student_id of student_ids) {
            await CourseModel.insertEnrollment(
                client,
                course_id,
                student_id
            )
        }

        await client.query("COMMIT");
        return { course_id };
    } catch (error: any) {
        await client.query("ROLLBACK");
        console.error("Error inside updateExistingCourse:", error);
        throw error;
    } finally {
        await client.release();
    }
}

export const getCourseAssociations = async (course_id: number) => {
    const problemIds = await CourseModel.fetchProblemIdsFromCourse(course_id);
    const studentIds = await CourseModel.fetchStudentIdsFromCourse(course_id);
    const associations = {
        problemIds,
        studentIds
    }
    return associations;
}