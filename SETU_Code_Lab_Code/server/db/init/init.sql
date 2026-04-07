--
-- PostgreSQL database dump
--

\restrict i34lQe0NcnMBJpeowD8H9JmQ7FwJfghbLQf4Y5ChJPszhDGGM8vikvVhIImktPn

-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: badge; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.badge (
    badge_id integer NOT NULL,
    badge_name character varying(100) NOT NULL,
    description text,
    icon character varying(255)
);


--
-- Name: badge_badge_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.badge_badge_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: badge_badge_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.badge_badge_id_seq OWNED BY public.badge.badge_id;


--
-- Name: course; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course (
    course_id integer NOT NULL,
    owner_id integer,
    course_title character varying(255),
    course_description text,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: course_course_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.course_course_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: course_course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.course_course_id_seq OWNED BY public.course.course_id;


--
-- Name: course_problem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_problem (
    course_id integer NOT NULL,
    problem_id integer NOT NULL
);


--
-- Name: enrollment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enrollment (
    course_id integer NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: problem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.problem (
    problem_id integer NOT NULL,
    problem_title character varying(255),
    problem_description text,
    difficulty integer,
    user_id integer,
    points integer DEFAULT 0 NOT NULL
);


--
-- Name: problem_language; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.problem_language (
    problem_id integer NOT NULL,
    language character varying(50) NOT NULL,
    placeholder_code text NOT NULL,
    CONSTRAINT problem_language_language_check CHECK (((language)::text = ANY (ARRAY[('java'::character varying)::text, ('python'::character varying)::text])))
);


--
-- Name: problem_problem_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.problem_problem_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: problem_problem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.problem_problem_id_seq OWNED BY public.problem.problem_id;


--
-- Name: submission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.submission (
    submission_id integer NOT NULL,
    user_id integer,
    problem_id integer,
    submitted_code text,
    submitted_at timestamp without time zone DEFAULT now(),
    overall_status boolean,
    time_taken integer,
    percentage integer,
    points_awarded integer DEFAULT 0 NOT NULL,
    language character varying(50) DEFAULT 'java'::character varying NOT NULL,
    CONSTRAINT submission_language_check CHECK (((language)::text = ANY (ARRAY[('java'::character varying)::text, ('python'::character varying)::text])))
);


--
-- Name: submission_submission_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.submission_submission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: submission_submission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.submission_submission_id_seq OWNED BY public.submission.submission_id;


--
-- Name: test_case; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.test_case (
    test_case_id integer NOT NULL,
    problem_id integer,
    input_value jsonb,
    expected_value jsonb
);


--
-- Name: test_case_result; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.test_case_result (
    test_case_result_id integer NOT NULL,
    submission_id integer,
    test_case_id integer,
    passed boolean,
    actual_output text,
    runtime_ms integer
);


--
-- Name: test_case_result_test_case_result_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.test_case_result_test_case_result_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: test_case_result_test_case_result_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.test_case_result_test_case_result_id_seq OWNED BY public.test_case_result.test_case_result_id;


--
-- Name: test_case_test_case_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.test_case_test_case_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: test_case_test_case_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.test_case_test_case_id_seq OWNED BY public.test_case.test_case_id;


--
-- Name: user_badge; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_badge (
    user_id integer NOT NULL,
    badge_id integer NOT NULL,
    earned_at timestamp without time zone DEFAULT now()
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    user_name text NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    total_points integer DEFAULT 0 NOT NULL,
    current_streak integer DEFAULT 0 NOT NULL,
    longest_streak integer DEFAULT 0 NOT NULL,
    last_solved_date date,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY (ARRAY[('student'::character varying)::text, ('lecturer'::character varying)::text])))
);


--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: badge badge_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badge ALTER COLUMN badge_id SET DEFAULT nextval('public.badge_badge_id_seq'::regclass);


--
-- Name: course course_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course ALTER COLUMN course_id SET DEFAULT nextval('public.course_course_id_seq'::regclass);


--
-- Name: problem problem_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.problem ALTER COLUMN problem_id SET DEFAULT nextval('public.problem_problem_id_seq'::regclass);


--
-- Name: submission submission_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submission ALTER COLUMN submission_id SET DEFAULT nextval('public.submission_submission_id_seq'::regclass);


--
-- Name: test_case test_case_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_case ALTER COLUMN test_case_id SET DEFAULT nextval('public.test_case_test_case_id_seq'::regclass);


--
-- Name: test_case_result test_case_result_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_case_result ALTER COLUMN test_case_result_id SET DEFAULT nextval('public.test_case_result_test_case_result_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: badge; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.badge (badge_id, badge_name, description, icon) FROM stdin;
1	First Steps	Submit your first solution	firstSteps.svg
2	On Fire	Achieve a 3 day streak	streakBadge.svg
3	Problem Solver	Solve 5 problems	problemSolver.svg
\.


--
-- Data for Name: course; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.course (course_id, owner_id, course_title, course_description, created_at) FROM stdin;
1	1	Global Problems	These problems are available to all students to practice	2026-02-18 18:33:12.748292
2	20	course	test	2026-03-25 21:03:41.568193
\.


--
-- Data for Name: course_problem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.course_problem (course_id, problem_id) FROM stdin;
1	7
1	8
1	6
1	9
1	10
1	5
1	11
1	2
1	12
2	13
\.


--
-- Data for Name: enrollment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.enrollment (course_id, user_id) FROM stdin;
1	13
1	14
1	15
1	16
1	17
1	18
1	19
1	20
2	12
2	13
2	10
1	8
1	9
1	10
1	11
1	12
\.


--
-- Data for Name: problem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.problem (problem_id, problem_title, problem_description, difficulty, user_id, points) FROM stdin;
10	Word Search in a 2D Grid	# Word Search in a 2D Grid\n\nGiven an `m x n` grid of characters `board` and a string `word`, return `true` if the word exists in the grid, and `false` otherwise.\n\nThe word can be constructed from letters of sequentially **adjacent cells**, where adjacent cells are **horizontally or vertically** neighboring. The **same cell may not be used more than once**.\n\n## Examples\n\n**Input:**\n```\nboard = [\n  ["A","B","C","E"],\n  ["S","F","C","S"],\n  ["A","D","E","E"]\n]\nword = "ABCCED"\n```\n**Output:** `true`\n\n**Input:**\n```\nboard = [\n  ["A","B","C","E"],\n  ["S","F","C","S"],\n  ["A","D","E","E"]\n]\nword = "ABCB"\n```\n**Output:** `false` — cannot reuse cells\n\n## Constraints\n- `m == board.length`\n- `n == board[i].length`\n- `1 <= m, n <= 6`\n- `1 <= word.length <= 15`\n- `board` and `word` consist of only lowercase and uppercase English letters	4	1	400
6	Simple Add Function (Tutorial)	Simply add two integers together and return the result. \nThis should work for positive and negative values.\n\n## Examples\n**Input:** `a=1`, `b=1`\n**Output:** `2`\n\n**Input:** `a=-1`, `b=-1`\n**Output:** `-2`	1	1	100
13	add	add	1	20	100
12	Two Sum	# Two Sum\n\nGiven an array of integers `nums` and an integer `target`, return the **indices** of the two numbers that add up to `target`.\n\nYou may assume that each input has **exactly one solution**, and you may not use the same element twice. The answer can be returned in any order.\n\n## Examples\n\n**Input:** `nums = [2, 7, 11, 15]`, `target = 9`\n**Output:** `[0, 1]`\n**Explanation:** `nums[0] + nums[1] = 2 + 7 = 9`\n\n**Input:** `nums = [3, 2, 4]`, `target = 6`\n**Output:** `[1, 2]`\n**Explanation:** `nums[1] + nums[2] = 2 + 4 = 6`\n\n## Constraints\n`2 <= nums.length <= 10^4`\n`-10^9 <= nums[i] <= 10^9`\n`-10^9 <= target <= 10^9`\nOnly one valid answer exists	2	1	200
2	Palindrome Number	Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise. \nNegative numbers should automatically return `false`\n\n## Examples\n\n**Input:** `x = 121`\n**Output:** `true`\n**Explanation:** 121 reads as 121 from left to right and from right to left.	1	1	100
11	Median of Two Sorted Arrays	# Median of Two Sorted Arrays\n\nGiven two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the **median** of the two sorted arrays.\n\n## Examples\n\n**Input:** `nums1 = [1, 3]`, `nums2 = [2]`\n**Output:** `2.0`\n**Explanation:** Merged array is `[1, 2, 3]`, median is `2.0`\n\n**Input:** `nums1 = [1, 2]`, `nums2 = [3, 4]`\n**Output:** `2.5`\n**Explanation:** Merged array is `[1, 2, 3, 4]`, median is `(2 + 3) / 2 = 2.5`\n\n## Constraints\n`nums1.length == m`\n`nums2.length == n`\n`0 <= m, n <= 1000`\n`1 <= m + n <= 2000`\n`-10^6 <= nums1[i], nums2[i] <= 10^6`	4	1	400
5	Student Grades Summary	# Average Grade by Subject\n\nYou are given a list of students' grades for multiple subjects. Each student is represented by a `Map<String, Integer>` where the key is the **subject name** and the value is the **grade**. The input is a `List<Map<String, Integer>>` containing all students.\n\n## Task\n\nWrite a method that computes the **average grade for each subject** across all students.\n\nReturn the result as a `Map<String, Double>`.	4	1	400
9	Find All Duplicates in an Array	# Find All Duplicates in an Array\n\nGiven an array of integers `nums`, return a list of all elements that appear **more than once**. The result can be returned in **any order**.\n\n## Examples\n\n**Input:** `nums = [4, 3, 2, 7, 8, 2, 3, 1]`\n**Output:** `[2, 3]`\n\n**Input:** `nums = [1, 1, 2]`\n**Output:** `[1]`\n\n## Constraints\n`1 <= nums.length <= 10^5`\n`-10^9 <= nums[i] <= 10^9`	3	1	300
8	Merge Two Sorted Arrays	# Merge Two Sorted Arrays\n\nGiven two sorted arrays of integers `nums1` and `nums2`, return a **single sorted array** containing all elements from both arrays.\n\n## Examples\n\n**Input:** `nums1 = [1, 3, 5]`, `nums2 = [2, 4, 6]`\n**Output:** `[1, 2, 3, 4, 5, 6]`\n\n**Input:** `nums1 = [1, 2, 3]`, `nums2 = []`\n**Output:** `[1, 2, 3]`\n\n## Constraints\n`0 <= nums1.length, nums2.length <= 10^5`\n`-10^9 <= nums1[i], nums2[i] <= 10^9`\nBoth `nums1` and `nums2` are sorted in **non-decreasing** order	2	1	200
7	Find the largest element in an array	# Find the Largest Element in an Array\n\nGiven an array of integers `nums`, return the **largest element** in the array.\n\n## Examples\n\n**Input:** `nums = [3, 1, 4, 1, 5, 9, 2, 6]`\n**Output:** `9`\n\n**Input:** `nums = [-10, -3, -7, -1]`\n**Output:** `-1`\n\n## Constraints\n- `1 <= nums.length <= 10^5`\n- `-10^9 <= nums[i] <= 10^9`	1	1	100
14	NEW ADD	NEW ADD	1	1	100
\.


--
-- Data for Name: problem_language; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.problem_language (problem_id, language, placeholder_code) FROM stdin;
12	java	public static int[] twoSum(int[] nums, int target) {\n    \n}
2	java	public static boolean isPalindrome(int x) {\n\n}
11	java	public static double findMedianSortedArrays(int[] nums1, int[] nums2) {\n\n}
5	java	public static Map<String, Double> averageGradeBySubject(List<Map<String, Integer>> students) {\n\n}
9	java	public static List<Integer> findDuplicates(int[] nums) {\n\n}
8	java	public static int[] mergeSortedArrays(int[] nums1, int[] nums2) {\n\n}
7	java	public static int findLargest(int[] nums) {\n\n}
10	java	public static boolean exist(char[][] board, String word) {\n\n}
6	java	public static int add(int x, int y) {\n\n}
6	python	def add(x: int, y: int) -> int:\n    \n
13	java	public static int add(int x, int y) {\n\n}
14	java	public static int add(int a, int b) {\n}
\.


--
-- Data for Name: submission; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.submission (submission_id, user_id, problem_id, submitted_code, submitted_at, overall_status, time_taken, percentage, points_awarded, language) FROM stdin;
1	1	2	public static boolean isPalindrome(int x) {\n  if(x<0) {\n    return false;\n  }\n  int forwards = x;\n  int temp = 0;\n  while(forwards != 0) {\n    temp = temp * 10;\n    temp += forwards % 10;\n    forwards = (forwards / 10);\n  }\n  return temp == x;\n}	2026-01-12 11:09:15.682558	f	30	\N	0	java
2	1	2	public static boolean isPalindrome(int x) {\n  if(x<0) {\n    return false;\n  }\n  int forwards = x;\n  int temp = 0;\n  while(forwards != 0) {\n    temp = temp * 10;\n    temp += forwards % 10;\n    forwards = (forwards / 10);\n  }\n  return temp == x;\n}	2026-01-12 12:15:07.649855	t	20	\N	0	java
3	1	2	public static boolean isPalindrome(int x) {\n  \n}	2026-01-13 14:35:13.710699	f	204	\N	0	java
4	1	2	public static boolean isPalindrome(int x) {}	2026-01-15 13:36:41.8384	f	111	\N	0	java
6	11	6	public static int add(int a, int b) {\n    return a+b;\n}	2026-02-18 19:02:04.887401	t	26	100	0	java
7	1	7	public static int findLargest(int[] arr) {\n    int biggest = -100000;\n    for(int i=0; i<arr.length; i++) {\n        if (arr[i]>biggest) {\n            biggest = arr[i];\n        }\n    }\n    return biggest;\n}	2026-03-08 13:16:35.483499	t	215	100	200	java
8	1	8	public static int[] sortedMerge(int[] arr1, int[] arr2) {\n    int[] returnArr = new int[arr1.length + arr2.length];\n    int i=0, j=0, k = 0;\n\n    while(i < arr1.length && j < arr2.length) {\n        if(arr1[i] <= arr2[j]) {\n            returnArr[k++] = arr1[i++];\n        } else {\n            returnArr[k++] = arr2[j++];\n        }\n    }\n    while(i<arr1.length) {\n        returnArr[k++] = arr1[i++];\n    }\n    while(j<arr2.length) {\n        returnArr[k++] = arr2[j++];\n    }\n    return returnArr;\n}	2026-03-08 14:41:35.500042	t	548	100	300	java
9	1	6	public static int add(int a, int b) {\n    return a+b;\n}	2026-03-08 15:02:02.901785	t	37	100	200	java
10	1	6	public static int add(int a, int b) {\n    return a+b;\n}	2026-03-09 16:24:22.693349	t	37	100	0	java
11	13	12	public static int[] twoSum(int[] nums, int t\n}	2026-03-09 16:24:46.671488	f	51	0	0	java
12	13	6	public static int add(int a, int b) {\n return a+b;\n}	2026-03-09 16:25:36.954142	t	28	100	200	java
13	14	6	public static int add(int a, int b) {\nreturn a + b;\n}	2026-03-09 22:37:04.471142	t	33	100	200	java
14	7	6	public static int add(int a, int b) {\n return a+b;\n}	2026-03-10 14:07:36.331639	t	63	100	200	java
15	7	6	public static int add(int a, int b) {\n    return a+b;\n}	2026-03-16 12:41:24.830111	t	30	100	0	java
16	7	6	public static int add(int a, int b) {\n    return a+b;\n}	2026-03-16 12:44:16.149488	t	23	100	0	java
17	1	6	public static int add(int x, int y) {\n\n}	2026-03-21 12:26:06.631314	f	3	0	0	java
18	15	10	public static boolean exist(char[][] board, String word) {\n    int rows = board.length;\n    int cols = board[0].length;\n\n    for (int i = 0; i < rows; i++){\n        for (int j = 0; j < cols; j++){\n            if(dfs(board, word, i, j, 0)){\n                return true;\n            }\n        }\n    }\n    return false;\n}\n    public static boolean dfs(char[][] board, String word, int row, int col, int index){\n          // if we matched all characters in the word\n          if (index == word.length()){\n            return true;\n        }\n\n        // Check if out of bounds\n        if (row < 0 || row >= board.length || col < 0 || col >= board[0].length){\n            return false;\n        }\n\n        // Check if current cell matches the current character\n        if (board[row][col] != word.charAt(index)){\n            return false;\n        }\n        \n        // Save the current character and mark cell as visited\n        char temp = board[row][col];\n        board[row][col] = '#';\n\n        // Look up, down, left, right\n        boolean found = dfs(board, word, row +1, col, index + 1) ||\n                        dfs(board, word, row -1, col, index + 1) ||\n                        dfs(board, word, row, col +1, index + 1) ||\n                        dfs(board, word, row, col - 1, index +1);\n\n        // Restore the original character\n        board[row][col] =temp;\n        return found;\n\n}	2026-03-21 14:46:40.644453	f	2432	0	0	java
19	15	6	public static int add(int x, int y) {\n    return x + y;\n}	2026-03-21 16:11:34.988912	t	76	100	200	java
20	16	12	\n\npublic static int[] twoSum(int[] nums, int target) {\n\n    for(int i = 0; i < nums.length; i++) {\n        for(int j = i+1; j < nums.length; j++)\n            {\n                if(nums[i] + nums[j] == target) {\n                    return new int[] {i,j};\n                }\n            }\n    }\n    return new int[] {};\n}	2026-03-21 16:31:22.165462	t	1117	100	300	java
21	16	6	public static int add(int x, int y) {\n    return x + y;\n}	2026-03-21 16:34:07.679784	t	56	100	200	java
22	1	10	public static boolean exist(char[][] board, String word) {\n    int rows = board.length;\n    int cols = board[0].length;\n\n    for (int i = 0; i < rows; i++){\n        for (int j = 0; j < cols; j++){\n            if(dfs(board, word, i, j, 0)){\n                return true;\n            }\n        }\n    }\n    return false;\n}\n    public static boolean dfs(char[][] board, String word, int row, int col, int index){\n          // if we matched all characters in the word\n          if (index == word.length()){\n            return true;\n        }\n\n        // Check if out of bounds\n        if (row < 0 || row >= board.length || col < 0 || col >= board[0].length){\n            return false;\n        }\n\n        // Check if current cell matches the current character\n        if (board[row][col] != word.charAt(index)){\n            return false;\n        }\n        \n        // Save the current character and mark cell as visited\n        char temp = board[row][col];\n        board[row][col] = '#';\n\n        // Look up, down, left, right\n        boolean found = dfs(board, word, row +1, col, index + 1) ||\n                        dfs(board, word, row -1, col, index + 1) ||\n                        dfs(board, word, row, col +1, index + 1) ||\n                        dfs(board, word, row, col - 1, index +1);\n\n        // Restore the original character\n        board[row][col] =temp;\n        return found;\n\n}	2026-03-21 21:23:59.340399	t	3	100	500	java
23	1	12	public static int[] twoSum(int[] nums, int target) {\n\n    for(int i = 0; i < nums.length; i++) {\n        for(int j = i+1; j < nums.length; j++)\n            {\n                if(nums[i] + nums[j] == target) {\n                    return new int[] {i,j};\n                }\n            }\n    }\n    return new int[] {};\n}	2026-03-22 10:09:16.027106	t	82	100	300	java
24	1	5	public static Map<String, Double> averageGradeBySubject(List<Map<String, Integer>> students) {\nMap<String, Integer> sumMap = new HashMap<>();\n    Map<String, Integer> countMap = new HashMap<>();\n\n    for (Map<String, Integer> student : students) {\n        for (Map.Entry<String, Integer> entry : student.entrySet()) {\n            String subject = entry.getKey();\n            int grade = entry.getValue();\n\n            sumMap.put(subject, sumMap.getOrDefault(subject, 0) + grade);\n            countMap.put(subject, countMap.getOrDefault(subject, 0) + 1);\n        }\n    }\n\n    Map<String, Double> result = new HashMap<>();\n    for (String subject : sumMap.keySet()) {\n        result.put(subject, (double) sumMap.get(subject) / countMap.get(subject));\n    }\n\n    return result;\n}	2026-03-22 11:19:45.53619	t	33	100	500	java
25	1	6	def add(x: int, y: int) -> int:\n    return x+y\n	2026-03-22 11:21:55.551453	t	20	100	0	python
26	1	5	public static Map<String, Double> averageGradeBySubject(List<Map<String, Integer>> students) {\n\n}	2026-03-23 18:26:09.092633	f	44	0	0	java
27	19	6	public static int add(int x, int y) {\n\n}	2026-03-25 19:33:26.326734	f	28	0	0	java
28	20	6	public static int add(int x, int y) {\n  return x+y;\n}	2026-03-25 20:57:28.27631	t	89	100	200	java
29	10	13	public static int add(int x, int y) {\n  return x+y;\n}	2026-04-01 13:04:33.061981	t	25	100	200	java
30	10	6	public static int add(int x, int y) {\n  return x+y;\n}	2026-04-01 13:11:10.794824	t	9	100	200	java
31	10	6	public static int add(int x, int y) {\nreturn x+y;\n}	2026-04-01 14:49:43.480076	t	8	100	0	java
32	10	13	public static int add(int x, int y) {\nreturn x+y;\n}	2026-04-01 14:54:21.030432	t	6	100	0	java
33	10	6	public static int add(int x, int y) {\n\n}	2026-04-01 18:11:27.977648	f	3	0	0	java
34	10	6	public static int add(int x, int y) {\n\n}	2026-04-01 18:18:50.151966	f	444	0	0	java
35	8	6	public static int add(int x, int y) {\nreturn x+y;\n}	2026-04-01 18:41:40.741191	t	12	100	200	java
36	8	6	public static int add(int x, int y) {\nreturn x+y;\n}	2026-04-01 18:47:08.240445	t	340	100	0	java
37	9	6	public static int add(int x, int y) {\nreturn x+y;\n}	2026-04-01 19:04:36.155915	t	11	100	200	java
38	12	6	public static int add(int x, int y) {\nreturn x+y;\n}	2026-04-01 19:06:07.762275	t	6	100	200	java
39	12	6	public static int add(int x, int y) {\nreturn x+y;\n}	2026-04-01 19:08:41.962982	t	159	100	0	java
40	10	6	public static int add(int x, int y) {\nreturn x+y;\n}	2026-04-01 19:11:04.510234	t	15	100	0	java
41	12	6	public static int add(int x, int y) {\nreturn x+y;\n}	2026-04-01 19:20:12.482447	t	7	100	0	java
42	9	6	public static int add(int x, int y) {\nreturn x+y;\n}	2026-04-01 19:22:59.747772	t	9	100	0	java
43	8	6	public static int add(int x, int y) {\nreturn x+y;\n}	2026-04-01 19:24:45.138052	t	6	100	0	java
44	11	6	public static int add(int x, int y) {\nreturn x+y;\n}	2026-04-01 19:27:13.590076	t	9	100	0	java
45	11	6	public static int add(int x, int y) {\nreturn x+y;\n}	2026-04-01 19:28:14.232381	t	8	100	0	java
46	8	6	public static int add(int x, int y) {\nreturn x+y;\n}	2026-04-01 19:37:17.735452	t	5	100	0	java
47	8	6	public static int add(int x, int y) {\nreturn x+y;\n}	2026-04-01 19:37:42.931917	t	5	100	0	java
48	8	6	public static int add(int x, int y) {\nreturn x+y;\n}	2026-04-01 19:38:04.532555	t	6	100	0	java
49	1	6	public static int add(int x, int y) {\n\n}	2026-04-04 10:47:04.028822	f	21	0	0	java
50	1	6	public static int add(int x, int y) {\n  return 1\n}	2026-04-04 15:50:57.361573	f	7	0	0	java
51	1	14	public static int add(int a, int b) {\nreturn a+b;\n}	2026-04-04 15:56:40.505304	t	14	100	200	java
52	1	12	public static int[] twoSum(int[] nums, int target) {\n    \n}	2026-04-07 12:20:30.520149	f	1	0	0	java
\.


--
-- Data for Name: test_case; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.test_case (test_case_id, problem_id, input_value, expected_value) FROM stdin;
51	12	{"nums": [2, 7, 11, 15], "target": 9}	[0, 1]
52	12	{"nums": [3, 2, 4], "target": 6}	[1, 2]
39	10	{"word": "ABCB", "board": [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]]}	false
40	10	{"word": "ABCCED", "board": [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]]}	true
42	10	{"word": "SEE", "board": [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]]}	true
43	10	{"word": "A", "board": [["A"]]}	true
44	10	{"word": "B", "board": [["A"]]}	false
21	7	{"nums": [3, 1, 4, 1, 5, 9, 2, 6]}	9
22	7	{"nums": [42]}	42
23	7	{"nums": [-10, -3, -7, -1]}	-1
24	7	{"nums": [5, 5, 5, 5]}	5
25	7	{"nums": [0, 0, 1, 0]}	1
26	7	{"nums": [-1000000000, 1000000000]}	1000000000
28	8	{"nums1": [1, 2, 3], "nums2": []}	[1, 2, 3]
29	8	{"nums1": [], "nums2": []}	[]
30	8	{"nums1": [-5, -3, -1], "nums2": [-4, -2, 0]}	[-5, -4, -3, -2, -1, 0]
31	8	{"nums1": [1, 1, 2], "nums2": [1, 2, 3]}	[1, 1, 1, 2, 2, 3]
32	8	{"nums1": [-1000000000], "nums2": [1000000000]}	[-1000000000, 1000000000]
41	10	{"word": "ABDC", "board": [["A", "B"], ["C", "D"]]}	true
27	8	{"nums1": [1, 3, 5], "nums2": [2, 4, 6]}	[1, 2, 3, 4, 5, 6]
13	6	{"x": 1, "y": 2}	3
14	6	{"x": -1, "y": 2}	1
47	11	{"nums1": [], "nums2": [1]}	1
48	11	{"nums1": [], "nums2": [2, 3]}	2.5
49	11	{"nums1": [-5, -3, -1], "nums2": [-4, -2]}	-3
50	11	{"nums1": [-1000000, 1000000], "nums2": [-1000000, 1000000]}	0
11	5	{"students": [{"Math": 90, "English": 80}, {"Math": 70, "English": 85}, {"Math": 100, "English": 90}]}	{"Math": 86.66666666666667, "English": 85}
53	12	{"nums": [3, 3], "target": 6}	[0, 1]
54	12	{"nums": [-1, -2, -3, -4], "target": -6}	[1, 3]
55	12	{"nums": [0, 4, 3, 0], "target": 0}	[0, 3]
56	12	{"nums": [-1000000000, 1000000000], "target": 0}	[0, 1]
5	2	{"x": 121}	true
6	2	{"x": 123}	false
18	2	{"x": 112211}	true
19	2	{"x": -121}	false
20	2	{"x": 112233}	false
45	11	{"nums1": [1, 3], "nums2": [2]}	2
46	11	{"nums1": [1, 2], "nums2": [3, 4]}	2.5
12	5	{"students": [{"Biology": 75, "Chemistry": 85}, {"Biology": 95, "Chemistry": 80}, {"Biology": 80, "Chemistry": 90}]}	{"Biology": 83.33333333333333, "Chemistry": 85}
15	6	{"x": -1, "y": -2}	-3
16	6	{"x": 0, "y": -10}	-10
17	6	{"x": 100, "y": 200}	300
57	13	{"x": 1, "y": 2}	3
33	9	{"nums": [4, 3, 2, 7, 8, 2, 3, 1]}	[2, 3]
34	9	{"nums": [1, 1, 2]}	[1]
35	9	{"nums": [1, 2, 3, 4]}	[]
36	9	{"nums": [1, 1, 1, 1]}	[1]
37	9	{"nums": [-1, -1, 2, 3, 2]}	[-1, 2]
38	9	{"nums": [1]}	[]
58	14	{"a": 1, "b": 2}	3
\.


--
-- Data for Name: test_case_result; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.test_case_result (test_case_result_id, submission_id, test_case_id, passed, actual_output, runtime_ms) FROM stdin;
1	1	5	t	true	2884
2	1	6	t	false	2678
3	2	5	t	true	3959
4	2	6	t	false	4222
5	3	5	f	Main.java:8: error: missing return statement\r\n}\r\n^\r\n1 error\r\nError: Could not find or load main class Main\r\nCaused by: java.lang.ClassNotFoundException: Main	2496
6	3	6	f	Main.java:8: error: missing return statement\r\n}\r\n^\r\n1 error\r\nError: Could not find or load main class Main\r\nCaused by: java.lang.ClassNotFoundException: Main	2270
7	4	5	f	Main.java:6: error: missing return statement\r\n        public static boolean isPalindrome(int x) {}\r\n                                                   ^\r\n1 error\r\nError: Could not find or load main class Main\r\nCaused by: java.lang.ClassNotFoundException: Main	2127
8	4	6	f	Main.java:6: error: missing return statement\r\n        public static boolean isPalindrome(int x) {}\r\n                                                   ^\r\n1 error\r\nError: Could not find or load main class Main\r\nCaused by: java.lang.ClassNotFoundException: Main	2199
11	6	13	t	3	2708
12	6	14	t	1	2730
13	6	15	t	-3	2795
14	6	16	t	-10	2988
15	6	17	t	300	2810
16	7	21	t	9	2681
17	7	22	t	42	2731
18	7	23	t	-1	2685
19	7	24	t	5	2814
20	7	25	t	1	2781
21	7	26	t	1000000000	2599
22	8	27	t	[1,2,3,4,5,6]	6281
23	8	28	t	[1,2,3]	5678
24	8	29	t	[]	5739
25	8	30	t	[-5,-4,-3,-2,-1,0]	5789
26	8	31	t	[1,1,1,2,2,3]	5749
27	8	32	t	[-1000000000,1000000000]	5923
28	9	13	t	3	5599
29	9	14	t	1	5615
30	9	15	t	-3	5613
31	9	16	t	-10	5571
32	9	17	t	300	5968
33	10	13	t	3	2739
34	10	14	t	1	2692
35	10	15	t	-3	2706
36	10	16	t	-10	2764
37	10	17	t	300	2688
38	11	51	f	Main.java:7: error: ',', ')', or '[' expected\n        public static int[] twoSum(int[] nums, int t\n                                                    ^\nMain.java:13: error: class, interface, enum, or record expected\n        public static void main(String[] args) {\n                      ^\nMain.java:15: error: <identifier> expected\n                Input input = mapper.readValue(args[0], Input.class);\n                                                                   ^\nMain.java:16: error: class, interface, enum, or record expected\n                int[] result = twoSum(input.nums, input.target);\n                ^\nMain.java:17: error: class, interface, enum, or record expected\n                System.out.println(mapper.writeValueAsString(result));\n                ^\nMain.java:18: error: class, interface, enum, or record expected\n            } catch (Exception e) {\n            ^\nMain.java:20: error: class, interface, enum, or record expected\n            }\n            ^\n7 errors\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1219
39	11	52	f	Main.java:7: error: ',', ')', or '[' expected\n        public static int[] twoSum(int[] nums, int t\n                                                    ^\nMain.java:13: error: class, interface, enum, or record expected\n        public static void main(String[] args) {\n                      ^\nMain.java:15: error: <identifier> expected\n                Input input = mapper.readValue(args[0], Input.class);\n                                                                   ^\nMain.java:16: error: class, interface, enum, or record expected\n                int[] result = twoSum(input.nums, input.target);\n                ^\nMain.java:17: error: class, interface, enum, or record expected\n                System.out.println(mapper.writeValueAsString(result));\n                ^\nMain.java:18: error: class, interface, enum, or record expected\n            } catch (Exception e) {\n            ^\nMain.java:20: error: class, interface, enum, or record expected\n            }\n            ^\n7 errors\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1427
40	11	53	f	Main.java:7: error: ',', ')', or '[' expected\n        public static int[] twoSum(int[] nums, int t\n                                                    ^\nMain.java:13: error: class, interface, enum, or record expected\n        public static void main(String[] args) {\n                      ^\nMain.java:15: error: <identifier> expected\n                Input input = mapper.readValue(args[0], Input.class);\n                                                                   ^\nMain.java:16: error: class, interface, enum, or record expected\n                int[] result = twoSum(input.nums, input.target);\n                ^\nMain.java:17: error: class, interface, enum, or record expected\n                System.out.println(mapper.writeValueAsString(result));\n                ^\nMain.java:18: error: class, interface, enum, or record expected\n            } catch (Exception e) {\n            ^\nMain.java:20: error: class, interface, enum, or record expected\n            }\n            ^\n7 errors\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1204
41	11	54	f	Main.java:7: error: ',', ')', or '[' expected\n        public static int[] twoSum(int[] nums, int t\n                                                    ^\nMain.java:13: error: class, interface, enum, or record expected\n        public static void main(String[] args) {\n                      ^\nMain.java:15: error: <identifier> expected\n                Input input = mapper.readValue(args[0], Input.class);\n                                                                   ^\nMain.java:16: error: class, interface, enum, or record expected\n                int[] result = twoSum(input.nums, input.target);\n                ^\nMain.java:17: error: class, interface, enum, or record expected\n                System.out.println(mapper.writeValueAsString(result));\n                ^\nMain.java:18: error: class, interface, enum, or record expected\n            } catch (Exception e) {\n            ^\nMain.java:20: error: class, interface, enum, or record expected\n            }\n            ^\n7 errors\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1232
111	25	14	t	1	375
112	25	15	t	-3	430
113	25	16	t	-10	410
114	25	17	t	300	426
115	26	11	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	4381
116	26	12	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	4017
117	27	13	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	4077
42	11	55	f	Main.java:7: error: ',', ')', or '[' expected\n        public static int[] twoSum(int[] nums, int t\n                                                    ^\nMain.java:13: error: class, interface, enum, or record expected\n        public static void main(String[] args) {\n                      ^\nMain.java:15: error: <identifier> expected\n                Input input = mapper.readValue(args[0], Input.class);\n                                                                   ^\nMain.java:16: error: class, interface, enum, or record expected\n                int[] result = twoSum(input.nums, input.target);\n                ^\nMain.java:17: error: class, interface, enum, or record expected\n                System.out.println(mapper.writeValueAsString(result));\n                ^\nMain.java:18: error: class, interface, enum, or record expected\n            } catch (Exception e) {\n            ^\nMain.java:20: error: class, interface, enum, or record expected\n            }\n            ^\n7 errors\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1185
43	11	56	f	Main.java:7: error: ',', ')', or '[' expected\n        public static int[] twoSum(int[] nums, int t\n                                                    ^\nMain.java:13: error: class, interface, enum, or record expected\n        public static void main(String[] args) {\n                      ^\nMain.java:15: error: <identifier> expected\n                Input input = mapper.readValue(args[0], Input.class);\n                                                                   ^\nMain.java:16: error: class, interface, enum, or record expected\n                int[] result = twoSum(input.nums, input.target);\n                ^\nMain.java:17: error: class, interface, enum, or record expected\n                System.out.println(mapper.writeValueAsString(result));\n                ^\nMain.java:18: error: class, interface, enum, or record expected\n            } catch (Exception e) {\n            ^\nMain.java:20: error: class, interface, enum, or record expected\n            }\n            ^\n7 errors\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1197
44	12	13	t	3	2697
45	12	14	t	1	2656
46	12	15	t	-3	2986
47	12	16	t	-10	2779
48	12	17	t	300	2794
49	13	13	t	3	2502
50	13	14	t	1	2461
51	13	15	t	-3	2770
52	13	16	t	-10	2678
53	13	17	t	300	3055
54	14	13	t	3	2623
55	14	14	t	1	2552
56	14	15	t	-3	2665
57	14	16	t	-10	2698
58	14	17	t	300	2859
59	15	13	t	3	2488
60	15	14	t	1	2506
61	15	15	t	-3	2438
62	15	16	t	-10	2635
63	15	17	t	300	2549
64	16	13	t	3	2495
65	16	14	t	1	2597
66	16	15	t	-3	2699
67	16	16	t	-10	2740
68	16	17	t	300	2826
69	17	13	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	3991
70	17	14	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	3909
71	17	15	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	3973
72	17	16	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	4034
73	17	17	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	3965
74	18	41	f	ERROR:Cannot deserialize value of type `java.lang.String` from Array value (token `JsonToken.START_ARRAY`)\n at [Source: REDACTED (`StreamReadFeature.INCLUDE_SOURCE_IN_LOCATION` disabled); line: 1, column: 9] (through reference chain: Main$Input["word"])	5083
75	18	39	f	ERROR:Cannot deserialize value of type `java.lang.String` from Array value (token `JsonToken.START_ARRAY`)\n at [Source: REDACTED (`StreamReadFeature.INCLUDE_SOURCE_IN_LOCATION` disabled); line: 1, column: 9] (through reference chain: Main$Input["word"])	5498
76	18	40	f	ERROR:Cannot deserialize value of type `java.lang.String` from Array value (token `JsonToken.START_ARRAY`)\n at [Source: REDACTED (`StreamReadFeature.INCLUDE_SOURCE_IN_LOCATION` disabled); line: 1, column: 9] (through reference chain: Main$Input["word"])	5156
77	18	42	f	ERROR:Cannot deserialize value of type `java.lang.String` from Array value (token `JsonToken.START_ARRAY`)\n at [Source: REDACTED (`StreamReadFeature.INCLUDE_SOURCE_IN_LOCATION` disabled); line: 1, column: 9] (through reference chain: Main$Input["word"])	5443
78	18	43	f	ERROR:Cannot deserialize value of type `java.lang.String` from Array value (token `JsonToken.START_ARRAY`)\n at [Source: REDACTED (`StreamReadFeature.INCLUDE_SOURCE_IN_LOCATION` disabled); line: 1, column: 9] (through reference chain: Main$Input["word"])	5369
79	18	44	f	ERROR:Cannot deserialize value of type `java.lang.String` from Array value (token `JsonToken.START_ARRAY`)\n at [Source: REDACTED (`StreamReadFeature.INCLUDE_SOURCE_IN_LOCATION` disabled); line: 1, column: 9] (through reference chain: Main$Input["word"])	5172
80	19	13	t	3	5351
81	19	14	t	1	5799
82	19	15	t	-3	5242
83	19	16	t	-10	5408
84	19	17	t	300	5292
85	20	51	t	[0,1]	5673
86	20	52	t	[1,2]	5406
87	20	53	t	[0,1]	5302
88	20	54	t	[1,3]	5076
89	20	55	t	[0,3]	5081
90	20	56	t	[0,1]	5153
91	21	13	t	3	5046
92	21	14	t	1	5189
93	21	15	t	-3	5315
94	21	16	t	-10	5194
95	21	17	t	300	5032
96	22	39	t	false	5897
97	22	40	t	true	5771
98	22	42	t	true	5723
99	22	43	t	true	5945
100	22	44	t	false	5968
101	22	41	t	true	6041
102	23	51	t	[0,1]	5287
103	23	52	t	[1,2]	5278
104	23	53	t	[0,1]	5327
105	23	54	t	[1,3]	6409
106	23	55	t	[0,3]	5324
107	23	56	t	[0,1]	5102
108	24	11	t	{"English":85.0,"Math":86.66666666666667}	5616
109	24	12	t	{"Chemistry":85.0,"Biology":83.33333333333333}	5720
110	25	13	t	3	463
118	27	14	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	3840
119	27	15	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	3991
120	27	16	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	4045
121	27	17	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	3833
122	28	13	t	3	5382
123	28	14	t	1	5121
124	28	15	t	-3	5182
125	28	16	t	-10	5303
126	28	17	t	300	5467
127	29	57	t	3	2368
128	30	13	t	3	2760
129	30	14	t	1	2265
130	30	15	t	-3	2319
131	30	16	t	-10	2326
132	30	17	t	300	2295
133	31	13	t	3	2647
134	31	14	t	1	2314
135	31	15	t	-3	2283
136	31	16	t	-10	1237
137	31	17	t	300	2315
138	32	57	t	3	2667
139	33	13	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	2195
140	33	14	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1839
141	33	15	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1838
142	33	16	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1861
143	33	17	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1839
144	34	13	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	2208
145	34	14	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1925
146	34	15	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1905
147	34	16	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1908
148	34	17	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1818
149	35	13	t	3	2870
150	35	14	t	1	2367
151	35	15	t	-3	2394
152	35	16	t	-10	2410
153	35	17	t	300	2349
154	36	13	t	3	2712
155	36	14	t	1	892
156	36	15	t	-3	2409
157	36	16	t	-10	2470
158	36	17	t	300	2455
159	37	13	t	3	2708
160	37	14	t	1	2412
161	37	15	t	-3	2401
162	37	16	t	-10	2302
163	37	17	t	300	847
164	38	13	t	3	2414
165	38	14	t	1	2297
166	38	15	t	-3	873
167	38	16	t	-10	2360
168	38	17	t	300	2348
169	39	13	t	3	2506
170	39	14	t	1	2486
171	39	15	t	-3	2395
172	39	16	t	-10	2352
173	39	17	t	300	2349
174	40	13	t	3	2394
175	40	14	t	1	2340
176	40	15	t	-3	2416
177	40	16	t	-10	2408
178	40	17	t	300	2348
179	41	13	t	3	2653
180	41	14	t	1	2369
181	41	15	t	-3	2376
182	41	16	t	-10	2373
183	41	17	t	300	2354
184	42	13	t	3	2400
185	42	14	t	1	2402
186	42	15	t	-3	2433
187	42	16	t	-10	2452
188	42	17	t	300	2418
189	43	13	t	3	2393
190	43	14	t	1	2406
191	43	15	t	-3	2409
192	43	16	t	-10	2412
193	43	17	t	300	2301
194	44	13	t	3	2287
195	44	14	t	1	2391
196	44	15	t	-3	2386
197	44	16	t	-10	2511
198	44	17	t	300	2367
199	45	13	t	3	2331
200	45	14	t	1	2399
201	45	15	t	-3	2369
202	45	16	t	-10	2379
203	45	17	t	300	2386
204	46	13	t	3	2793
205	46	14	t	1	2309
206	46	15	t	-3	2470
207	46	16	t	-10	2401
208	46	17	t	300	2379
209	47	13	t	3	2329
210	47	14	t	1	2283
211	47	15	t	-3	2359
212	47	16	t	-10	2392
213	47	17	t	300	2366
214	48	13	t	3	2385
215	48	14	t	1	2415
216	48	15	t	-3	2357
217	48	16	t	-10	2470
218	48	17	t	300	2404
219	49	13	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	2212
220	49	14	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1860
221	49	15	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1850
222	49	16	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	2720
223	49	17	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1867
224	50	13	f	Main.java:8: error: ';' expected\n  return 1\n          ^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1423
225	50	14	f	Main.java:8: error: ';' expected\n  return 1\n          ^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1694
226	50	15	f	Main.java:8: error: ';' expected\n  return 1\n          ^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1096
227	50	16	f	Main.java:8: error: ';' expected\n  return 1\n          ^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1146
228	50	17	f	Main.java:8: error: ';' expected\n  return 1\n          ^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1141
229	51	58	t	3	2324
230	52	51	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	2354
231	52	52	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1892
232	52	53	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1812
233	52	54	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1808
234	52	55	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1878
235	52	56	f	Main.java:9: error: missing return statement\n}\n^\n1 error\nError: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main	1791
\.


--
-- Data for Name: user_badge; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_badge (user_id, badge_id, earned_at) FROM stdin;
11	2	2026-04-01 10:22:17.41378
10	3	2026-04-01 19:11:04.536811
11	1	2026-04-01 19:28:14.253889
8	1	2026-04-01 19:37:17.760868
1	1	2026-04-04 10:47:04.048411
1	3	2026-04-04 10:47:04.055276
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (user_id, user_name, email, password, role, total_points, current_streak, longest_streak, last_solved_date) FROM stdin;
11	Diarmuid O'Neill	don@gmail.com	$2b$10$Mhtc0aViZ7Ae3qrh71eqWuzufYyVyhysUxzrQPIRkBxjBOAEMRXci	student	0	0	0	\N
13	agabagoo	c00284845@setu.ie	$2b$10$A.6sDGcy4GJEY0iVXTya/eTjNmaHSRXsRGh4ce/zphVSxXHA13.Ma	student	200	1	1	2026-03-09
14	CIAN	cianj230@gmail.com	$2b$10$/K2bqdm.Qm8s6VvW9LBD/.AOa51OdHqs65zj9/YW3lxG.3DS4UxqK	lecturer	200	1	1	2026-03-09
7	Dr Tim	tim@gmail.com	$2b$10$Fusxpi7UXafgI1h3j16jD.KBsh/aRnXHqvViwXYR4EIW7VSs9lS5C	lecturer	200	1	1	2026-03-10
15	Emmanuel A	e.a.test@live.com	$2b$10$hvK3twk4iqSIS40hPBKmleTK5ZiPPUWphae539O8U2GssuRlvKM3C	student	200	1	1	2026-03-21
16	Ryan Dunne	ryanjd123@hotmail.com	$2b$10$9jreSY9/amzNvcnp3HPUJuVJ6o3ojdFhP4mENNRRyrKmRv0A1ICIW	student	500	1	1	2026-03-21
17	Jamie Byrne	c00282009@setu.ie	$2b$10$Gtlrf0Rkp7IaAmkp6.rE1.G16j7Q6TCt.mTwmMow3ng2FheswFwW6	student	0	0	0	\N
18	tester	testemail@email.com	$2b$10$/f8NGrB2LrtgQt7yhZBvwe7B6W3JaVPzgAskVMosuDByWlrAqcgKC	student	0	0	0	\N
19	Dr John Doe	jd@gmail.com	$2b$10$qx1KjYplz1XLfKhOk3XFd.58ZeboU9YV5gc3Sp5oLR.vopmkMvepC	lecturer	0	0	0	\N
20	Dr Jane Doe	janedoe@gmail.com	$2b$10$3giDN02.FQGzHAElTZhsouE09vPrIrtzMwLnc1ZBu1qd79SlJbU4y	lecturer	200	1	1	2026-03-25
10	Conor Hendley	ch@gmail.com	$2b$10$0aaI9r6EUuXTxPVFyhtOQOjraBppzKjrYUmaBj3WhJKk5QZ0P83ou	student	400	1	1	2026-04-01
8	Isaiah Andres	ia@gmail.com	$2b$10$WKWkFU6xywpH38JsQDCKTu.R3t58.VPNpPyBSDqRDxy3IFRklH2Re	student	200	1	1	2026-04-01
9	Stuart Rossiter	sa@gmail.com	$2b$10$6kCnvMzuMtr8ZObmULIgQO2U5znTjmqecQpoxyauW/iF13Ipqj4a2	student	200	1	1	2026-04-01
12	Dorian Nowicki	dn@gmail.com	$2b$10$4.7hObIZe7lRYzmejdf1c.2slGfgM5L0HJ4HyULIkLvE3kZrx7H16	student	200	1	1	2026-04-01
1	Dr. Don	d@gmail.com	$2b$10$2sTIgwdYLCu6Ybw95a0zhuDtDIOsqZzlDLfFkuQgI5BPe3rEfZ6tG	lecturer	2200	0	2	2026-04-07
\.


--
-- Name: badge_badge_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.badge_badge_id_seq', 3, true);


--
-- Name: course_course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.course_course_id_seq', 2, true);


--
-- Name: problem_problem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.problem_problem_id_seq', 14, true);


--
-- Name: submission_submission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.submission_submission_id_seq', 52, true);


--
-- Name: test_case_result_test_case_result_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.test_case_result_test_case_result_id_seq', 235, true);


--
-- Name: test_case_test_case_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.test_case_test_case_id_seq', 58, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_user_id_seq', 20, true);


--
-- Name: badge badge_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badge
    ADD CONSTRAINT badge_pkey PRIMARY KEY (badge_id);


--
-- Name: course course_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (course_id);


--
-- Name: course_problem course_problem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_problem
    ADD CONSTRAINT course_problem_pkey PRIMARY KEY (course_id, problem_id);


--
-- Name: enrollment enrollment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollment
    ADD CONSTRAINT enrollment_pkey PRIMARY KEY (course_id, user_id);


--
-- Name: problem_language problem_language_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.problem_language
    ADD CONSTRAINT problem_language_pkey PRIMARY KEY (problem_id, language);


--
-- Name: problem problem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.problem
    ADD CONSTRAINT problem_pkey PRIMARY KEY (problem_id);


--
-- Name: submission submission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submission
    ADD CONSTRAINT submission_pkey PRIMARY KEY (submission_id);


--
-- Name: test_case test_case_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_case
    ADD CONSTRAINT test_case_pkey PRIMARY KEY (test_case_id);


--
-- Name: test_case_result test_case_result_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_case_result
    ADD CONSTRAINT test_case_result_pkey PRIMARY KEY (test_case_result_id);


--
-- Name: user_badge unique_user_badge; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badge
    ADD CONSTRAINT unique_user_badge UNIQUE (user_id, badge_id);


--
-- Name: user_badge user_badge_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badge
    ADD CONSTRAINT user_badge_pkey PRIMARY KEY (user_id, badge_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: course course_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: course_problem course_problem_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_problem
    ADD CONSTRAINT course_problem_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(course_id) ON DELETE CASCADE;


--
-- Name: course_problem course_problem_problem_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_problem
    ADD CONSTRAINT course_problem_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES public.problem(problem_id) ON DELETE CASCADE;


--
-- Name: enrollment enrollment_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollment
    ADD CONSTRAINT enrollment_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(course_id) ON DELETE CASCADE;


--
-- Name: enrollment enrollment_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollment
    ADD CONSTRAINT enrollment_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: problem_language problem_language_problem_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.problem_language
    ADD CONSTRAINT problem_language_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES public.problem(problem_id) ON DELETE CASCADE;


--
-- Name: problem problem_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.problem
    ADD CONSTRAINT problem_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: submission submission_problem_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submission
    ADD CONSTRAINT submission_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES public.problem(problem_id) ON DELETE CASCADE;


--
-- Name: submission submission_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submission
    ADD CONSTRAINT submission_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: test_case test_case_problem_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_case
    ADD CONSTRAINT test_case_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES public.problem(problem_id) ON DELETE CASCADE;


--
-- Name: test_case_result test_case_result_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_case_result
    ADD CONSTRAINT test_case_result_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submission(submission_id) ON DELETE CASCADE;


--
-- Name: test_case_result test_case_result_test_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_case_result
    ADD CONSTRAINT test_case_result_test_case_id_fkey FOREIGN KEY (test_case_id) REFERENCES public.test_case(test_case_id) ON DELETE CASCADE;


--
-- Name: user_badge user_badge_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badge
    ADD CONSTRAINT user_badge_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badge(badge_id) ON DELETE CASCADE;


--
-- Name: user_badge user_badge_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badge
    ADD CONSTRAINT user_badge_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict i34lQe0NcnMBJpeowD8H9JmQ7FwJfghbLQf4Y5ChJPszhDGGM8vikvVhIImktPn

