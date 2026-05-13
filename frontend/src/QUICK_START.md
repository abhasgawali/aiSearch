# Component Library - Quick Start Guide

## 🚀 Getting Started

### 1. Import Components

```typescript
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Badge,
  Avatar,
  LoadingSpinner,
  // ... other components
} from '@/components';
```

### 2. Use in Your Page

```typescript
import { Button, Card, CardHeader, CardTitle } from '@/components';

export function MyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <div className="p-6">
        <Button variant="primary">Click Me</Button>
      </div>
    </Card>
  );
}
```

### 3. Access Utilities & Hooks

```typescript
import {
  formatNumber,
  useLocalStorage,
  useToggle,
  cn,
} from '@/lib';

// Format: formatNumber(1234) => "1.2K"
// Hook: const [isOpen, toggle] = useToggle(false);
// ClassNames: cn('class1', condition && 'class2')
```

---

## 📋 Component Categories

### Core UI Components (12 total)
- ✅ **Button** - Multiple variants (primary, secondary, tertiary, ghost)
- ✅ **Card** - Composable card with header, content, footer
- ✅ **Input** - Form input with icons, errors, helper text
- ✅ **Badge** - Status indicators with 5 variants
- ✅ **Avatar** - User avatars with fallback & online status
- ✅ **LoadingSpinner** - Animated loader in 3 sizes
- ✅ **Toast** - Non-intrusive notifications
- ✅ **BarChart** - Interactive bar charts
- ✅ **Modal** - Dialog with backdrop & escape handling
- ✅ **Dropdown** - Menu with keyboard support
- ✅ **Tabs** - Tab navigation system
- ✅ **StatCard** - Statistics display with trends

### Layout Components (3 total)
- ✅ **Header** - Sticky top navigation with user menu
- ✅ **Sidebar** - Collapsible sidebar with nested items
- ✅ **Container** - Responsive max-width wrapper

### Utilities (19 functions)
- Text & Number formatting
- Date/time utilities
- Storage management
- Object manipulation
- Debounce/throttle

### Hooks (11 custom hooks)
- Click outside detection
- Keyboard events
- Local storage state
- Window size tracking
- Async operations
- Media queries
- And more...

---

## 🎨 Color Theme

Dark theme optimized for AI/search applications:

```typescript
import { colors } from '@/lib';

// Access theme colors
colors.bg.primary      // #0f0f0f
colors.text.primary    // #ffffff
colors.accent.primary  // #8b7355 (beige)
```

---

## 💡 Common Patterns

### Form with Validation
```typescript
const [email, setEmail] = useState('');
const [error, setError] = useState('');

<Input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={error}
  helperText="Enter valid email"
/>
```

### Modal Dialog
```typescript
const [open, setOpen] = useState(false);

<Modal
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Confirm"
>
  <p>Are you sure?</p>
  <Button onClick={() => setOpen(false)}>Yes</Button>
</Modal>
```

### Loading State
```typescript
const [isLoading, setIsLoading] = useState(false);

<Button isLoading={isLoading}>
  Save
</Button>
```

### Debounced Search
```typescript
const [search, setSearch] = useState('');
const debouncedSearch = useDebouncedValue(search, 300);

<Input
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Search..."
/>
```

---

## 📂 File Structure

```
frontend/src/
├── components/
│   ├── ui/                      # 12 UI components
│   ├── layout/                  # 3 Layout components
│   ├── ComponentShowcase.tsx    # Full demo
│   ├── index.ts                 # Barrel export
│   └── README.md                # Full documentation
├── lib/
│   ├── theme.ts                 # Color & typography
│   ├── utils.ts                 # 19 utility functions
│   ├── hooks.ts                 # 11 custom hooks
│   └── index.ts                 # Barrel export
├── index.css                    # Global styles & animations
└── main.tsx
```

---

## 🔧 Customization

### Add Custom Colors
Edit `src/lib/theme.ts`:
```typescript
export const colors = {
  bg: {
    custom: '#hexcolor',
  },
};
```

### Override Tailwind
All components accept className:
```typescript
<Button className="custom-class">
  Custom
</Button>
```

### Extend Components
Create wrapper components:
```typescript
export function CustomButton(props) {
  return <Button {...props} className="my-custom-style" />;
}
```

---

## ✨ Key Features

✅ **12 UI Components** - Ready to use  
✅ **3 Layout Components** - Full page structure  
✅ **TypeScript** - Full type safety  
✅ **Dark Theme** - Optimized for AI apps  
✅ **19 Utilities** - Common functions  
✅ **11 Hooks** - React utilities  
✅ **Responsive** - Mobile first  
✅ **Accessible** - Keyboard support  
✅ **Tailwind CSS** - Easy customization  

---

## 📚 Next Steps

1. **View Demo**: Check `ComponentShowcase.tsx` for all components in action
2. **Read Docs**: See `components/README.md` for detailed component docs
3. **Start Building**: Import and use components in your pages
4. **Customize**: Adjust colors in `lib/theme.ts`

---

## 🚨 Troubleshooting

### Import Errors?
Make sure path alias is set in `tsconfig.app.json`:
```json
"paths": {
  "@/*": ["src/*"]
}
```

### Styles Not Applied?
Ensure Tailwind CSS is imported in `index.css`:
```css
@import "tailwindcss";
```

### Components Missing?
Check `src/components/index.ts` has all exports.

---

Happy coding! 🎉
