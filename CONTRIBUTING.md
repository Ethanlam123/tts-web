# Contributing to AudioConverter

Thank you for your interest in contributing to AudioConverter! This guide will help you get started with contributing to our text-to-speech web application.

## 🤝 How to Contribute

### Reporting Issues

1. **Search existing issues** first to avoid duplicates
2. **Use the issue templates** when creating new issues
3. **Provide detailed information**:
   - Steps to reproduce
   - Expected vs. actual behavior
   - Browser and OS information
   - Screenshots if applicable

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone locally
   git clone https://github.com/YOUR_USERNAME/tts-web.git
   cd tts-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Add your ElevenLabs API key for testing (optional)
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Guidelines

#### Code Style
- **TypeScript**: Use strict mode throughout
- **Components**: Use shadcn/ui components when possible
- **Styling**: Follow Tailwind CSS v4 patterns
- **Dark Theme**: Ensure all components work with dark theme
- **Icons**: Use lucide-react for consistency

#### API Key Development
- **Security**: Never hardcode API keys
- **SSR Safety**: Use `typeof window !== 'undefined'` checks
- **Error Handling**: Handle API errors gracefully
- **Testing**: Test both server and client key scenarios

#### Commit Messages
Follow our commit convention:
```
type(scope): description

feat: add new feature
fix: resolve bug
ui: styling changes
refactor: code restructuring
docs: documentation updates
```

### Pull Request Process

1. **Update documentation** if needed
2. **Run tests** and ensure they pass
3. **Submit a pull request** with:
   - Clear title and description
   - Related issues linked
   - Screenshots for UI changes
   - Testing steps if applicable

## 🛠️ Development Workflow

### Before Making Changes
1. Check existing issues and PRs
2. Read relevant documentation in `openspec/`
3. Ensure your changes align with project goals

### While Developing
1. Keep changes focused and atomic
2. Test functionality regularly
3. Update documentation as you go
4. Follow accessibility guidelines

### Before Submitting
1. Test all functionality
2. Ensure responsive design works
3. Check accessibility compliance
4. Update README if needed
5. Run final checks

## 🧪 Testing

### Manual Testing Checklist
- [ ] File upload works (.txt files)
- [ ] Voice selection and persistence
- [ ] Speed control affects playback
- [ ] API key configuration works
- [ ] Generate all processes correctly
- [ ] Download all creates ZIP
- [ ] Clear all removes all lines
- [ ] Error handling is user-friendly
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Dark/light mode compatibility

### API Key Testing
- [ ] Server-side API key fallback
- [ ] Client-side API key configuration
- [ ] API key validation and testing
- [ ] Automatic voice refresh on key change
- [ ] Proper error handling for invalid keys

## 📝 Project Structure

```
tts-web/
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                   # Utility functions
├── types/                 # TypeScript definitions
├── openspec/              # Specifications
├── public/                # Static assets
└── docs/                  # Additional documentation
```

## 🎯 Areas for Contribution

### High Priority
- **Mobile responsiveness**: Improve mobile experience
- **Voice preview**: Add voice sample playback
- **File formats**: Support additional file formats
- **Performance**: Optimize for large files

### Medium Priority
- **Accessibility**: Enhance screen reader support
- **Internationalization**: Add language support
- **Themes**: Add light theme option
- **Analytics**: Add usage tracking

### Low Priority
- **Export options**: More audio format options
- **Batch operations**: Enhanced batch controls
- **History**: Recent files/favorites
- **Shortcuts**: Keyboard shortcuts

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Project maintainers for long-term contributors

## 📞 Getting Help

### For Contributors
- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For general questions and ideas
- **Email**: For private questions (if needed)

### Development Questions
- Check `openspec/` for detailed specifications
- Review existing PRs for patterns
- Ask in discussions for guidance

## 📋 Code Review Checklist

When reviewing PRs, check for:
- [ ] Code follows project conventions
- [ ] TypeScript types are properly defined
- [ ] Component accessibility is considered
- [ ] Error handling is appropriate
- [ ] Security best practices are followed
- [ ] Documentation is updated if needed
- [ ] Tests pass (if applicable)

## 🔧 Useful Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# OpenSpec
openspec list        # List available changes
openspec show <id>   # Show change details
openspec validate   # Validate specifications
```

## 📄 Legal

By contributing to AudioConverter, you agree that your contributions will be licensed under the same MIT License as the project.

---

Thank you for contributing to AudioConverter! Your contributions help make this project better for everyone. 🎉