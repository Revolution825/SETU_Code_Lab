import React from "react";
import "./createProblem.scss";
import "../viewProblems/manageProblems.scss";
import type { TestCase } from "../types/TestCase";
import { v4 as uuidv4 } from 'uuid';
interface Props {
    testCases: TestCase[],
    setTestCases: React.Dispatch<React.SetStateAction<TestCase[]>>
}

export default function TestCaseForm({ testCases, setTestCases }: Props) {
    const getTestCaseId = (tc: TestCase): number | string => tc.test_case_id ?? tc.temp_id!;
    const addTestCase = () => {
        setTestCases(prev => [
            ...prev,
            {
                temp_id: uuidv4(),
                input_value: "",
                expected_value: ""
            }
        ]);
    };
    type TestCaseStringField = "input_value" | "expected_value";
    const updateTestCase = (
        id: number | string,
        field: TestCaseStringField,
        value: string
    ) => {
        setTestCases(prev =>
            prev.map(tc =>
                tc.test_case_id === id || tc.temp_id === id
                    ? { ...tc, [field]: value }
                    : tc
            )
        );
    };
    const deleteTestCase = (id: number | string) => {
        setTestCases(prev =>
            prev.map(tc =>
                tc.test_case_id === id || tc.temp_id === id
                    ? { ...tc, deleted: true }
                    : tc
            )
        );
    }
    return (
        <div className="testCaseBody">
            {testCases
                .filter(tc => !tc.deleted)
                .map(testCase => {
                    const id = getTestCaseId(testCase);

                    return (
                        < div key={id} className="testCaseBackground">
                            <button onClick={() => deleteTestCase(id)} type="button" className="testCaseXButton">x</button>
                            <div className="createProblemInput">
                                <label>
                                    Sample Input:
                                </label>
                                <input
                                    className="testCaseInputBox topRounded"
                                    type="text"
                                    maxLength={100}
                                    placeholder='eg. {"x": 313}'
                                    value={testCase.input_value}
                                    onChange={
                                        (e) => { updateTestCase(id, "input_value", e.target.value) }}
                                    required />
                            </div>
                            <div className="createProblemInput">
                                <label>
                                    Expected Output:
                                </label>
                                <input
                                    className="testCaseInputBox bottomRounded"
                                    type="text"
                                    maxLength={100}
                                    placeholder='eg. true'
                                    value={testCase.expected_value}
                                    onChange={
                                        (e) => { updateTestCase(id, "expected_value", e.target.value) }}
                                    required />
                            </div>
                        </div>
                    );
                })}
            <button className="createNew" type="button" onClick={addTestCase}>
                <img className="plusIcon" src="plusIcon.svg" alt="Plus Icon" />Add Test Case
            </button>
        </div >
    );
}