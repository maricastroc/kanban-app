# Kanban Task Management 
![mockup](https://github.com/user-attachments/assets/cde9d887-fd43-4e1d-a58a-0553b111276c)

## 📚 Project Description

The project consists of a fullstack kanban app for daily task management, allowing users to organize different boards, with information stored in a PostgreSQL database via Prisma. The application also includes authentication via Next OAuth, ensuring secure user access, and drag-and-drop functionality for handling the created cards.

Users are able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Create, read, update, and delete boards and tasks
- Receive form validations when trying to create/edit boards and tasks
- Mark subtasks as complete and move tasks between columns
- Hide/show the board sidebar
- Toggle the theme between light/dark modes
- Allow users to drag and drop tasks to change their status and re-order them in a column
- Set due dates for tasks, with automatic status updates
- Add tags to tasks for better organization and categorization


## 📌 What did I learn?

The project was an excellent opportunity to practice implementing the drag-and-drop feature, as well as organizing the theme in local storage while storing other information, such as boards, columns, tasks, and subtasks, in the database via Prisma and PostgreSQL. The use of contexts was essential to keep the features organized and intuitive. Additionally, I implemented authentication using Next OAuth and built the Next.js API and its endpoints, which was a great chance to practice API construction and management.

## 🔍 Links
[Deploy](https://kanban-app-maricastroc.vercel.app/)

## 💻 My Process
### Built with:

- [Next.js](https://nextjs.org/)
- [NextAuth.js](https://next-auth.js.org/configuration/providers/oauth)
- [Prisma](https://www.prisma.io/)
- [Neon](https://neon.tech/?gad_source=1&gclid=Cj0KCQiAq-u9BhCjARIsANLj-s3f2u0yUqs4SfDbXQPqXPR2a7bbNzjsi30-7sY7k3lD8TcyYiY4aD8aAoH8EALw_wcB)
- [Typescript](https://www.typescriptlang.org/)
- [Styled Components](https://styled-components.com/)
- [font-awesome](https://fontawesome.com/)
- [react-beautiful-dnd](https://www.npmjs.com/package/react-beautiful-dnd/v/11.0.2)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

## ℹ️ How to run the application?

> Clone the repository:

```bash
git clone https://github.com/maricastroc/kanban-app
```

> Install the dependencies:

```bash
npm install
```

> Rename the .env.example file to .env and add the necessary information to it.

> Generate the Prisma client and apply database migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

> Start the service:

```bash
npm run dev
```

> ⏩ Access [http://localhost:3000](http://localhost:3000) to view the web application.
