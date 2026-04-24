import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";
import NavBar from "../navBar.component";
import { useEffect, useState } from "react";
import "./viewProfile.scss";
import type { User } from "../types/user";
import type { Submission } from "../types/Submission";
import type { Problem } from "../types/problem";
import type { Badge } from "../types/badge";
import toast from "react-hot-toast";
import { api } from "../sharedUtils";
import FadeLoader from "react-spinners/FadeLoader";
import ToolTip from "../tooltip";

export default function ViewProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const otherUser = location.state as User | undefined;
  const [dataLoading, setDataLoading] = useState(true);
  const [userData, setUserData] = useState<User | undefined>(undefined);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [problems, setSubmittedProblems] = useState<Problem[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);

  async function deleteAccount() {
    let userConfirmed = confirm(
      "Are you sure you want to delete your account and all of its associated data, this action is irrevesible!",
    );
    if (userConfirmed) {
      const deletedAccount = await api.delete("/api/deleteAccount");
      if (deletedAccount.ok) {
        toast.success("Account deleted successfully");
        navigate("/");
      } else {
        const errorData = await deletedAccount.json();
        toast.error("Error deleting account: " + errorData.message);
        console.error("Error deleting account: ", errorData.message);
      }
    }
  }

  function submissionClicked(
    submission: Submission,
    student: User | undefined,
    problem: Problem | undefined,
  ) {
    if (submission) {
      navigate("/viewResult", { state: { submission, student, problem } });
    } else {
      toast.error("Submission not found");
    }
  }

  useEffect(() => {
    let activeUserId: number;

    if (otherUser) {
      activeUserId = otherUser.user_id;
    } else if (user) {
      activeUserId = user.user_id;
    } else {
      navigate("/problems");
      return;
    }

    async function fetchData() {
      try {
        const userRes = await api.get(`/api/fetchUser?userId=${activeUserId}`);
        if (userRes.ok) {
          const fullUser: User = await userRes.json();
          setUserData(fullUser);
        } else {
          const errorData = await userRes.json();
          console.error("Error fetching user: ", errorData.message);
          return;
        }

        let submissionsData: Submission[] = [];

        const submissionsRes = await api.get(
          `/api/fetchSubmissions?userId=${activeUserId}`,
        );

        if (submissionsRes.ok) {
          submissionsData = await submissionsRes.json();
          setSubmissions(submissionsData);
        } else {
          const errorData = await submissionsRes.json();
          console.error("Error fetching submissions: ", errorData.message);
        }

        const problemIds = submissionsData.map((s) => s.problem_id);

        if (problemIds.length === 0) {
          setSubmittedProblems([]);
          return;
        }

        const problemsRes = await api.post("/api/fetchSubmittedProblems", {
          problem_ids: problemIds,
        });

        if (problemsRes.ok) {
          setSubmittedProblems(await problemsRes.json());
        } else {
          const errorData = await problemsRes.json();
          console.error(
            "Error fetching submitted problems: ",
            errorData.message,
          );
        }

        const badgesRes = await api.get(
          `/api/fetchUserBadges?userId=${activeUserId}`,
        );
        if (badgesRes.ok) {
          setBadges(await badgesRes.json());
        } else {
          const errorData = await badgesRes.json();
          console.error("Error fetching badges: ", errorData.message);
        }
      } catch (error: any) {
        console.error("Error fetching profile data: ", error.message);
      } finally {
        setDataLoading(false);
      }
    }

    fetchData();
  }, [otherUser, user, navigate]);

  console.log("badges: ", badges);

  return (
    <div>
      <NavBar />
      <div className="profileScreenBody">
        <div className="profileCard" style={{ marginLeft: 24 }}>
          <div className="profileContent">
            <img src="/profileIcon.svg" alt="profileIcon" className="avatar" />
            <p className="userName">{userData?.user_name}</p>
            <p className="userRole">
              {userData?.role == "lecturer" ? "Lecturer" : "Student"}
            </p>
          </div>
          <div className="profileStats">
            <table>
              <tbody>
                <tr>
                  <td>
                    <p>Problems completed: </p>
                  </td>
                  <td className="profileStats">{problems.length}</td>
                </tr>
                <tr>
                  <td>
                    <p>Longest Streak: </p>
                  </td>
                  <td className="profileStats">
                    {userData?.longest_streak}{" "}
                    <img src="flame.svg" alt="flame" className="flame" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>Current Streak: </p>
                  </td>
                  <td className="profileStats">
                    {userData?.current_streak}{" "}
                    <ToolTip text="Correctly complete a new problem every day to extend your streak">
                      <img src="flame.svg" alt="flame" className="flame" />
                    </ToolTip>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>Total Points: </p>
                  </td>
                  <td className="profileStats">{userData?.total_points}</td>
                </tr>
              </tbody>
            </table>
            {userData?.user_id === user?.user_id ? (
              <button className="deleteAccountButton" onClick={deleteAccount}>
                Delete Account
              </button>
            ) : null}
          </div>
        </div>
        <div className="submissionsBody">
          <div className="resultHeader">
            <p>Submission History</p>
          </div>
          <div className="submissionsContent">
            {submissions.length > 0 ? (
              <table className="submissionTable">
                <thead>
                  <tr>
                    <th className="profileTableHeading">Problem:</th>
                    <th className="profileTableHeading">Overall Status:</th>
                    <th className="profileTableHeading">Submitted at:</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => {
                    const submittedAt = new Date(submission.submitted_at);
                    const submittedAtFormatted = new Intl.DateTimeFormat(
                      "en-IE",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      },
                    ).format(submittedAt);
                    return (
                      <tr
                        onClick={() =>
                          submissionClicked(
                            submission,
                            userData,
                            problems.find(
                              (p) => p.problem_id === submission.problem_id,
                            ),
                          )
                        }
                        className="submissionRow"
                        key={submission.submission_id}
                      >
                        <td style={{ padding: "0px" }}>
                          <div className="submissionCell start">
                            {
                              problems.find(
                                (p) => p.problem_id === submission.problem_id,
                              )?.problem_title
                            }
                          </div>
                        </td>
                        <td
                          style={
                            submission.overall_status
                              ? { color: "green", padding: "0px" }
                              : { color: "red", padding: "0px" }
                          }
                        >
                          <div className="submissionCell middle">
                            {submission.overall_status ? "Pass" : "Fail"}
                          </div>
                        </td>
                        <td style={{ padding: "0px" }}>
                          <div className="submissionCell end">
                            {submittedAtFormatted}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  marginTop: "25%",
                  alignContent: "center",
                  fontSize: "18px",
                }}
              >
                This user has not made any submsisions yet :(
              </p>
            )}
          </div>
        </div>
        {userData?.role === "student" ? (
          <div className="badgeBody">
            <div className="resultHeader">
              <p>Badges</p>
            </div>
            <div className="badgesContent">
              {badges.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    marginTop: "100%",
                    alignContent: "center",
                    fontSize: "18px",
                  }}
                >
                  This user has not earned any badges yet :(
                </p>
              ) : (
                badges.map((badge) => (
                  <ToolTip text={badge.description}>
                    <div className="badgeContainer">
                      <img
                        src={badge.icon}
                        alt={badge.badge_name}
                        className="badge"
                      />
                      <p>{badge.badge_name}</p>
                    </div>
                  </ToolTip>
                ))
              )}
            </div>
          </div>
        ) : null}
      </div>
      {dataLoading && (
        <div className="spinner">
          <FadeLoader color="#dedede" />
          <p style={{ margin: 24 }}>Hang tight, Loading Profile...</p>
        </div>
      )}
    </div>
  );
}
