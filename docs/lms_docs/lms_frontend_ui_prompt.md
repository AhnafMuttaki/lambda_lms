# LMS Frontend UI/UX Prompt for Responsive Vue App

## Purpose
This prompt guides the development of a modern, responsive Vue.js LMS frontend, inspired by the attached layout (image.png), and tailored to the business, technical, and task requirements of the LMS project. The design must be visually similar to the reference image, but adapted for LMS use cases, with a focus on responsiveness and usability across devices.

---

## 1. Theme & Layout Implementation
- **Layout:**
  - Use a dark background (#181818 or similar), with a sidebar on the left for navigation and a main content area on the right.
  - Sidebar: vertical, dark, with LMS-related links (e.g., Dashboard, Courses, Enrollments, Live Sessions, Certificates, Profile, Logout).
  - Main area: header with greeting/user info, then a grid of cards (see below).
  - Cards: visually similar to the reference (rounded, shadow, bold color blocks), but each card represents a course (title, instructor, short desc, CTA button).
  - Use a modern, sans-serif font and high-contrast text for accessibility.
  - Ensure all colors, spacing, and radii match the reference as closely as possible, but adapt for LMS branding if needed.
- **Color Palette:**
  - Background: #181818 (main), #222222 (sidebar), #f8f8f8 (cards/text on dark)
  - Primary accent: #0099ff or #ffd600 (for cards/buttons, inspired by image.png)
  - Text: #fff (on dark), #181818 (on light)
  - Use CSS variables for easy theming.
- **Responsiveness:**
  - Sidebar collapses to icons or hamburger on tablet/mobile.
  - Card grid becomes single column on mobile, two columns on tablet, 3+ on desktop.
  - Header and nav adapt for all breakpoints.

---

## 2. Sample Landing Page (Home)
- **Showcase:**
  - Use mock data to render 4-6 course cards in the main area.
  - Each card: course image (placeholder), title, instructor, short description, and an "Enroll" or "View" button.
  - Header: "Welcome to Lambda LMS" and user greeting (if logged in).
- **Navigation:**
  - Sidebar links are visible and functional (route to stub pages).
- **Accessibility:**
  - All interactive elements are keyboard accessible and have focus states.

---

## 3. Login Page
- **Form:**
  - Centered card on dark background.
  - Fields: Email, Password, Login button.
  - Simple validation (required fields, email format).
  - Link to Register page.
- **Design:**
  - Matches theme, uses accent color for button/focus.
  - Responsive for all breakpoints.

---

## 4. Register Page
- **Form:**
  - Centered card on dark background.
  - Fields: Name, Email, Password, Role (dropdown: Student/Teacher), Register button.
  - Simple validation.
  - Link to Login page.
- **Design:**
  - Matches theme, uses accent color for button/focus.
  - Responsive for all breakpoints.

---

## 5. Responsiveness
- **Requirement:**
  - All three screens (Landing, Login, Register) must be fully responsive for laptop, tablet, and mobile.
  - Use CSS grid/flexbox and media queries.
  - Test with browser dev tools and Playwright.

---

## 6. Playwright Tests
- **Landing Page:**
  - Loads and displays course cards.
  - Sidebar links are visible and clickable.
  - Responsive layout (test at 3 breakpoints).
- **Login Page:**
  - Form fields present, validation works, can switch to Register.
  - Responsive layout.
- **Register Page:**
  - Form fields present, validation works, can switch to Login.
  - Responsive layout.

---

## 7. Implementation Notes
- Use Vue 3, Vue Router, Pinia (if needed), and CSS variables for theming.
- Use SFCs (Single File Components) for layout, sidebar, card, forms, etc.
- Use mock data for courses and user info.
- Use only open source or custom icons.
- All code should be clean, commented, and follow best practices.

---

**Deliverables:**
- Theme/layout code for the LMS frontend (Vue SFCs, CSS/SCSS, variables).
- Sample landing page with mock course data.
- Login and Register pages with forms and validation.
- Responsive design for all screens.
- Playwright test code for all three screens and breakpoints.

---

**Reference:**
- See attached image.png for layout and color inspiration.
- See business, architecture, and task docs for LMS-specific requirements.
