# Book-it:

**Overview:**
This project is a renting service provider built using Next.js 14.
This web application is responsive and suitable for all devices
 It allows users to:

- Create a profile using Social Media accounts
- Create a profile & update it
- Search for properties by name and category
- View property details (Including a map of its location)
- Leave a review
- Add properties to favorites
- Book stays
- Create their own rentals
- Review a monthly report of their reservations
- Pay and receive payment (stripe api)

**Installation:**

1. Clone the repository: `git clone https://github.com/Ninja-Jutsu/home-away.git`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. For the booking and the creation of rentals a connection to a sql DataBase is required (Check the actions)

**Usage:**

- As a guest: Search for properties, view details, book stays and create and manage rentals
- As an admin: Review the app report with a summary about users, bookings and finance.

**Technology Stack:**

- Next.js
- React
- TypeScript
- MySQL
- Supabase
- Prisma
- Tailwind CSS
- shadcn/ui
- Clerk Services
- Stripe
- Zod
- Zustand

**Project Structure:**

- pages: Individual page components
- components: Reusable UI components
- actions folder including actions for each page
- api: API endpoints for fetching data
- middleware file protecting admin routes

**Contributing:**
I welcome contributions! Please follow our code style and submit pull requests.

**License:**
MIT
