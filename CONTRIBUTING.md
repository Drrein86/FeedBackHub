# Contributing to FeedbackHub

Thank you for your interest in contributing to FeedbackHub! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node version, browser)

### Suggesting Enhancements

1. Check if the enhancement has been suggested in Issues
2. Create a new issue with:
   - Clear description of the enhancement
   - Use cases and benefits
   - Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Test your changes thoroughly
5. Commit with clear messages:
   ```bash
   git commit -m "Add: feature description"
   ```
6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Create a Pull Request with:
   - Clear description of changes
   - Link to related issue(s)
   - Screenshots if UI changes

## Development Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/FeedBackHub.git
   cd FeedBackHub
   ```

2. Install dependencies:
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   cp server/env.example server/.env
   ```

4. Set up database:
   ```bash
   npm run server:db:push
   npm run server:db:setup
   ```

5. Run development servers:
   ```bash
   npm run dev:full
   ```

## Coding Standards

### JavaScript/TypeScript

- Use TypeScript for new files
- Follow existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Use async/await instead of promises chains

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use TypeScript interfaces for props

### File Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (shadcn)
│   ├── admin/       # Admin-specific components
│   ├── auth/        # Authentication components
│   └── feedback/    # Feedback form components
├── contexts/        # React contexts
├── hooks/           # Custom React hooks
├── lib/            # Utilities and API client
└── pages/          # Page components
```

### Git Commit Messages

Use clear, descriptive commit messages:

- `Add: new feature`
- `Fix: bug description`
- `Update: component or feature`
- `Refactor: code improvement`
- `Docs: documentation update`
- `Test: test-related changes`
- `Style: formatting changes`

### Testing

- Test all new features
- Ensure existing tests pass
- Test on different browsers
- Test responsive design
- Test RTL (right-to-left) for Hebrew

## Adding New Languages

1. Update `src/contexts/LanguageContext.tsx`:
   ```typescript
   const translations = {
     // ... existing languages
     de: {
       // German translations
       title: "Feedback-System",
       // ... more translations
     }
   };
   ```

2. Update database to support new language:
   ```sql
   -- No schema changes needed, just add data
   ```

3. Update API endpoints to handle new language

4. Add language selector option in UI

## Database Migrations

When changing the database schema:

1. Update `server/prisma/schema.prisma`
2. Run:
   ```bash
   npx prisma db push
   # or for production
   npx prisma migrate dev --name description_of_change
   ```
3. Update seed scripts if needed
4. Document changes in PR

## API Guidelines

### Endpoint Naming

- Use RESTful conventions
- Use plural nouns: `/api/stores`, `/api/reviews`
- Use HTTP methods correctly: GET, POST, PUT, DELETE

### Response Format

```json
{
  "data": { /* response data */ },
  "error": null
}

// Or for errors:
{
  "error": "Error message",
  "details": "Additional details"
}
```

### Error Handling

- Return appropriate HTTP status codes
- Provide clear error messages
- Log errors server-side
- Don't expose sensitive information

## Questions?

Feel free to:
- Open an issue for questions
- Join discussions in existing issues
- Reach out to maintainers

Thank you for contributing! 🎉

