
# nebula-learn-ui Implementation Documentation

## Overview
nebula-learn-ui is a modular, scalable learning platform UI built with React, TypeScript, Vite, shadcn-ui, and Tailwind CSS. It provides interactive course experiences, quizzes, certificates, analytics, moderation, and more. This documentation explains the codebase structure, conventions, and implementation details so new contributors can quickly understand and extend the project.

---

## Project Structure

- **src/**: Main source code
  - **components/**: Reusable UI and feature components
    - **course/**: Content types (Video, PDF, Quiz, Interactive, Zoom, Certificate)
    - **courses/**: Course card display
    - **layout/**: Sidebar and dashboard header
    - **ui/**: UI primitives (button, card, tabs, etc.) based on shadcn-ui
    - **admin/**, **analytics/**, **certificate/**, **content/**, **discussion/**, **enrollment/**: Feature-specific components
  - **data/**: Mock data (e.g., courses)
  - **hooks/**: Custom React hooks (e.g., mobile detection, toast)
  - **lib/**: Utility functions (e.g., className merging)
  - **pages/**: Main app screens (CourseView, Quiz screens, Auth, Analytics, Moderation, etc.)
  - **assets/**: Images and static assets
- **public/**: Static files (favicon, robots.txt)
- **docs/**: Documentation (this file)

---

## Routing & App Entry

- Uses `react-router-dom` for client-side routing.
- Main routes are defined in `src/App.tsx` using `<Routes>` and `<Route>`.
- Route conventions:
  - `/`: Home
  - `/login`, `/register`: Auth screens
  - `/course/:courseId`: Course view
  - `/course/:courseId/content`: Course content list
  - `/course/:courseId/discussion`: Course Q&A/discussion
  - `/course/:courseId/certificate`: Certificate view
  - `/course/:courseId/certificate/templates`: Certificate template management
  - `/course/:courseId/certificate/history`: Certificate issue history
  - `/quiz/*`: Quiz screens (create, edit, attempt, view)
  - `/analytics/*`: Analytics dashboards
  - `/admin/moderation`: Moderation screens
  - `*`: NotFound (catch-all)

---

## UI Components & Conventions

- **shadcn-ui** primitives are used for all basic UI elements (see `src/components/ui/`).
- Feature components are organized by domain (e.g., course, analytics, admin, etc.).
- All components use TypeScript for type safety.
- Props interfaces are defined for each component.
- Tailwind CSS is used for utility-first styling. Class names are composed using the `cn` utility from `lib/utils.ts`.
- Components are functional and use React hooks for state and effects.
- Reusable logic is abstracted into custom hooks (see `src/hooks/`).
- Toast notifications use the custom `useToast` hook and shadcn-ui Toaster.
- All forms and interactive elements follow accessible and responsive design patterns.

---

## State Management

- Local state is managed with React hooks (`useState`, `useEffect`).
- Async data fetching and caching use `@tanstack/react-query` (see `App.tsx` for provider setup).
- Toasts and dialogs provide user feedback for actions.

---

## Styling & Theming

- Tailwind CSS is used for all styling.
- Custom themes and variants are managed via shadcn-ui and `class-variance-authority`.
- Responsive design is handled via Tailwind breakpoints and the `useIsMobile` hook.

---

## Data & Mocking

- Mock data for courses, quizzes, etc. is stored in `src/data/mockCourses.ts` and used in page components.
- Data structures follow backend conventions (see docs for service prompts).
- Easily replace mock data with real API integration as needed.

---

## Feature Implementations

### Quiz
- Quiz screens (`QuizCreate`, `QuizEdit`, `QuizQuestionAdd`, `QuizAttempt`, `QuizAttempts`, `QuizView`) handle creation, editing, and taking quizzes.
- Quiz logic is encapsulated in `QuizContent` and related components.
- State is managed locally; navigation and feedback via toast and dialogs.

### Certificate
- Certificate screens allow users to view certificates and teachers to manage certificate templates.
- Certificate data structures support logo, text, background image, signature, and dates.

### Analytics
- Analytics dashboards provide platform, course, and user metrics with charts and visualizations.
- Data is fetched via mock endpoints and displayed using reusable chart components.

### Moderation
- Admin screens allow super admins to approve/reject courses and content, and view moderation logs.

### Content
- Teachers can create, edit, update, and delete content (video, PDF, interactive).
- Students can view content.
- Content components are type-driven and support metadata and ordering.

### Discussion/Q&A
- Course discussion screens allow users to post questions, replies, and feedback.
- Data structures support discussions, replies, and feedback ratings.

---

## Conventions

- **File Naming:**
  - Components: PascalCase (e.g., `QuizContent.tsx`)
  - Hooks: camelCase with `use-` prefix (e.g., `use-mobile.tsx`)
  - Pages: PascalCase (e.g., `CourseView.tsx`)
- **Imports:**
  - Use absolute imports with `@/` for `src/` (configured in tsconfig).
- **TypeScript:**
  - All files use TypeScript for type safety.
  - Props and state are explicitly typed.
- **Styling:**
  - Tailwind CSS utility classes.
  - Use `cn` utility for conditional class names.
- **Component Structure:**
  - Functional components only.
  - Use hooks for state and effects.
  - Avoid class components.
- **Testing:**
  - Mock data and logic are used for local development; replace with real API for production.
- **Documentation:**
  - Inline code comments explain complex logic.
  - All major features and screens are documented here and in README.md.

---

## Extending & Customizing

- Add new content types by creating components in `src/components/course/` and updating `CourseView`.
- Add new pages in `src/pages/` and update routing in `App.tsx`.
- Customize UI by editing shadcn-ui primitives in `src/components/ui/`.
- Follow existing conventions for naming, typing, and styling.

---

## Development & Deployment

- Install dependencies: `npm i`
- Start dev server: `npm run dev`
- Built with Vite for fast reloads and instant preview.
- Deploy via Lovable or your preferred platform.

---

## References

- [shadcn/ui documentation](https://ui.shadcn.com/)
- [Vite documentation](https://vitejs.dev/)
- [React documentation](https://react.dev/)
- [Tailwind CSS documentation](https://tailwindcss.com/)

---
For further details, see code comments and the README.md.
