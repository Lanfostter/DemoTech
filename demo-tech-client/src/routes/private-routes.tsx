import type { RouteObject } from "react-router-dom";
import PrivateRoute from "../component/PrivateRoute";
import Layout from "../component/Layout.tsx";
import dashboardRoute from "../pages/Dashboard/dashboard-route.tsx";
import userRoute from "../pages/User/user-route.tsx";
import settingRoute from "../pages/Setting/setting-route.tsx";

// Eager imports — chunks nhỏ (< 15 KB gzip), không đáng lazy load
import ModuleListPage      from '../pages/Modules/ModuleListPage';
import UnitListPage        from '../pages/Modules/UnitListPage';
import AssignmentInboxPage from '../pages/Assignment/AssignmentInboxPage';
import LessonLandingPage   from '../pages/Lessons/LessonLandingPage';
import ReadingLessonPage   from '../pages/Lessons/ReadingLessonPage';
import ListeningLessonPage from '../pages/Lessons/ListeningLessonPage';
import ExercisePage        from '../pages/Exercise/ExercisePage';
import LessonCompletePage  from '../pages/Exercise/LessonCompletePage';
import FlashcardPage       from '../pages/Flashcard/FlashcardPage';
import VocabularyPage      from '../pages/Vocabulary/VocabularyPage';
import OnboardingPage      from '../pages/Onboarding/OnboardingPage';
import ClassroomPage       from '../pages/Teacher/ClassroomPage';
import ReportsPage         from '../pages/Dashboard/ReportsPage';
import AdminExercisePage   from '../pages/User/List/AdminExercisePage';
import AdminContentPage    from '../pages/User/List/AdminContentPage';

const privateRoutes: RouteObject[] = [
    {
        element: <PrivateRoute />,
        children: [
            {
                element: <Layout />,
                children: [
                    ...dashboardRoute,
                    ...userRoute,
                    ...settingRoute,
                    { path: '/modules',                          element: <ModuleListPage /> },
                    { path: '/modules/:moduleId',                element: <UnitListPage /> },
                    { path: '/assignments',                      element: <AssignmentInboxPage /> },
                    { path: '/lessons/:lessonId',                element: <LessonLandingPage /> },
                    { path: '/lessons/:lessonId/reading',        element: <ReadingLessonPage /> },
                    { path: '/lessons/:lessonId/listening',      element: <ListeningLessonPage /> },
                    { path: '/lessons/:lessonId/exercise',       element: <ExercisePage /> },
                    { path: '/lessons/:lessonId/complete',       element: <LessonCompletePage /> },
                    { path: '/flashcard',                        element: <FlashcardPage /> },
                    { path: '/vocabulary',                       element: <VocabularyPage /> },
                    { path: '/onboarding',                       element: <OnboardingPage /> },
                    { path: '/classrooms',                       element: <ClassroomPage /> },
                    { path: '/reports',                          element: <ReportsPage /> },
                    { path: '/admin/exercises',                  element: <AdminExercisePage /> },
                    { path: '/admin/content',                    element: <AdminContentPage /> },
                ],
            },
        ],
    },
];

export default privateRoutes;
