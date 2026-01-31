import React from "react";
import "./createProblem.scss";
import "../viewProblems/manageProblems.scss";

interface TestCase {
    sampleInput: string;
    expectedOutput: string;
}
interface Props {
    testCases: TestCase[],
    setTestCases: React.Dispatch<React.SetStateAction<TestCase[]>>
}

export default function TestCaseForm({ testCases, setTestCases }: Props) {
    const addTestCase = () => {
        setTestCases([
            ...testCases,
            { sampleInput: "", expectedOutput: "" }
        ])
    }
    const updateTestCase = (index: number, field: keyof TestCase, value: string) => {
        const updatedCases = [...testCases];
        updatedCases[index][field] = value;
        setTestCases(updatedCases);
    }
    const deleteTestCase = (index: number) => {
        setTestCases(testCases.filter((_, i) => i !== index));
    }
    return (
        <div className="testCaseBody">
            {
                testCases.map((testCase, index) => (
                    <div key={index} className="testCaseBackground">
                        <button onClick={() => deleteTestCase(index)} type="button" className="testCaseXButton">x</button>
                        <div className="createProblemInput">
                            <label>
                                Sample Input:
                            </label>
                            <input
                                className="testCaseInputBox topRounded"
                                type="text"
                                maxLength={100}
                                placeholder='eg. {"x": 313}'
                                value={testCase.sampleInput}
                                onChange={
                                    (e) => { updateTestCase(index, "sampleInput", e.target.value) }}
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
                                value={testCase.expectedOutput}
                                onChange={
                                    (e) => { updateTestCase(index, "expectedOutput", e.target.value) }}
                                required />
                        </div>
                    </div>
                ))
            }
            <button className="createNew" type="button" onClick={addTestCase}>
                <img className="plusIcon" src="plusIcon.svg" alt="Plus Icon" />Add Test Case
            </button>
        </div>
    );
}