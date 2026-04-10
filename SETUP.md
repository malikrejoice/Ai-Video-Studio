# Environment Setup Notes

## Required for Running

### Node.js & npm
- Make sure you have Node.js 18+ installed
- Check: `node --version` and `npm --version`

### Installation & Running

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint
```

## Installed Dependencies

### Production Dependencies
- **next**: Next.js 14 framework
- **react**: UI library
- **react-dom**: DOM rendering
- **framer-motion**: Animation library
- **lucide-react**: Icon library
- **zustand**: Lightweight state management

### Dev Dependencies
- **tailwindcss**: Utility-first CSS
- **postcss**: CSS processor
- **autoprefixer**: Browser prefixes
- **typescript**: TypeScript support

## Configuration Files

- **next.config.js**: Next.js configuration
- **tailwind.config.js**: Tailwind CSS theme customization
- **postcss.config.js**: PostCSS plugins
- **tsconfig.json**: TypeScript configuration

## How to Add Features

### New Component
1. Create file in `src/components/MyComponent.jsx`
2. Use Framer Motion for animations
3. Import and use in pages

### New Page
1. Add route to Sidebar menu
2. Create component in `src/components/`
3. Add case to main `page.tsx` switch statement
4. Update Zustand store if needed

### New Store State
Edit `src/lib/store.js`:
```javascript
// Add to useVideoStore or create new store
export const useMyStore = create((set) => ({
  // state and methods
}));
```

## Performance Tips

- Images are lazy-loaded by browser
- Toast notifications auto-dismiss (3s)
- CSS animations use GPU acceleration
- Responsive design prevents layout shift
- Zustand provides efficient re-renders

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Troubleshooting

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

**Module not found errors?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Styles not loading?**
- Clear Next.js cache: rm -rf .next
- Restart dev server

**Animations not smooth?**
- Check browser hardware acceleration is enabled
- Use latest browser version
- Check frame rate in DevTools Performance tab
