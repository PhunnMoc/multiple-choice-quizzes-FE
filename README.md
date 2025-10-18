# Quiz Platform Frontend

A modern, responsive React frontend for the Quiz Platform built with Vite and inspired by clean, professional design principles.

## 🎨 Features

- **Modern UI Design** - Clean, professional interface inspired by contemporary web design
- **Responsive Layout** - Works perfectly on desktop, tablet, and mobile devices
- **Reusable Components** - Modular UI components for consistent design
- **Real-time API Integration** - Seamless communication with the backend
- **Form Validation** - Client-side validation with error handling
- **Search & Pagination** - Advanced quiz browsing capabilities
- **Interactive Quiz Creation** - Intuitive quiz builder interface

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API communication
- **Lucide React** - Beautiful, customizable icons
- **CSS Variables** - Consistent theming system

## 📁 Project Structure

```
src/
├── components/
│   └── ui/                 # Reusable UI components
│       ├── Button.jsx      # Button component with variants
│       ├── Card.jsx        # Card component with header/content/footer
│       ├── Input.jsx       # Input, Textarea, Select components
│       ├── Badge.jsx       # Badge component for labels
│       └── index.js        # Component exports
├── pages/
│   ├── HomePage.jsx        # Quiz listing and search
│   ├── CreateQuizPage.jsx  # Quiz creation form
│   └── QuizDetailPage.jsx  # Quiz details and preview
├── services/
│   └── api.js              # API service layer
├── App.jsx                 # Main app component with routing
├── main.jsx                # App entry point
└── index.css               # Global styles and CSS variables
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 3000

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:3001
   ```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design System

### Color Palette
- **Primary**: `#10b981` (Emerald green)
- **Secondary**: `#6b7280` (Gray)
- **Accent**: `#f3f4f6` (Light gray)
- **Text Primary**: `#1e293b` (Dark slate)
- **Text Secondary**: `#64748b` (Slate)

### Components

#### Button
```jsx
<Button variant="primary" size="md" loading={false}>
  Click me
</Button>
```

#### Card
```jsx
<Card hover padding="default">
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Content>Content goes here</Card.Content>
  <Card.Footer>Footer content</Card.Footer>
</Card>
```

#### Input
```jsx
<Input 
  label="Label" 
  placeholder="Placeholder"
  error="Error message"
  helperText="Helper text"
/>
```

## 📱 Pages

### Home Page
- Quiz listing with search and pagination
- Statistics dashboard
- Quick actions (Create Quiz, View Quiz)

### Create Quiz Page
- Interactive quiz builder
- Dynamic question addition/removal
- Real-time form validation
- Option management with correct answer selection

### Quiz Detail Page
- Quiz preview with questions and options
- Answer reveal functionality
- Quiz statistics
- Action buttons (Start Quiz, View Answers)

## 🔌 API Integration

The frontend communicates with the backend through a centralized API service:

```javascript
import { quizAPI } from './services/api';

// Get all quizzes
const quizzes = await quizAPI.getQuizzes({ page: 1, limit: 10 });

// Create a quiz
const newQuiz = await quizAPI.createQuiz(quizData);

// Get quiz by ID
const quiz = await quizAPI.getQuizById(quizId);
```

## 🎨 Styling

The app uses CSS custom properties for consistent theming:

```css
:root {
  --primary-color: #10b981;
  --primary-hover: #059669;
  --secondary-color: #6b7280;
  --accent-color: #f3f4f6;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --card-bg: #ffffff;
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}
```

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Grid System**: CSS Grid with responsive columns
- **Flexible Layouts**: Flexbox for component layouts

## 🔮 Future Enhancements

- **React Router** - Proper client-side routing
- **State Management** - Redux or Zustand for complex state
- **Authentication** - User login and registration
- **Real-time Features** - WebSocket integration for live quizzes
- **Quiz Taking Interface** - Interactive quiz taking experience
- **Results & Analytics** - Quiz performance tracking
- **Dark Mode** - Theme switching capability
- **PWA Support** - Progressive Web App features

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure backend is running on port 3000
   - Check CORS configuration in backend

2. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

3. **Styling Issues**
   - Verify CSS variables are properly defined
   - Check for conflicting global styles

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository.
