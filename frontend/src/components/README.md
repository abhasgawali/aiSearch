# Component Library Documentation

A comprehensive, dark-themed component library for Google AI/Perplexity clone applications built with React, TypeScript, and Tailwind CSS.

## 📦 Components

### UI Components

#### Button
Flexible button component with multiple variants and sizes.

```typescript
import { Button } from '@/components';

<Button variant="primary" size="md" onClick={() => {}}>
  Click me
</Button>
```

**Props:**
- `variant`: `'primary' | 'secondary' | 'tertiary' | 'ghost'`
- `size`: `'sm' | 'md' | 'lg'`
- `isLoading`: `boolean`
- `disabled`: `boolean`

---

#### Card
Composable card component with header, content, and footer sections.

```typescript
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent,
  CardFooter 
} from '@/components';

<Card variant="elevated">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

**Props:**
- `variant`: `'default' | 'elevated' | 'outlined'`

---

#### StatCard
Display statistics with optional trend indicators.

```typescript
import { StatCard } from '@/components';

<StatCard
  label="Total Users"
  value="1,234"
  description="+12% from last month"
  icon="👥"
  trend={{ value: 12, isPositive: true }}
/>
```

---

#### Input
Controlled input component with error states and helper text.

```typescript
import { Input } from '@/components';

<Input
  type="email"
  placeholder="Enter email"
  error="Invalid email"
  helperText="Please enter a valid email"
  icon="✉️"
/>
```

---

#### Badge
Status indicator component with multiple variants.

```typescript
import { Badge } from '@/components';

<Badge variant="success" size="md">
  Active
</Badge>
```

**Props:**
- `variant`: `'default' | 'success' | 'warning' | 'error' | 'info'`
- `size`: `'sm' | 'md'`

---

#### Avatar
User avatar component with fallback initials and online status.

```typescript
import { Avatar } from '@/components';

<Avatar
  size="md"
  initials="JD"
  online={true}
  src="https://example.com/avatar.jpg"
/>
```

**Props:**
- `size`: `'sm' | 'md' | 'lg' | 'xl'`
- `online`: `boolean`
- `initials`: `string`

---

#### LoadingSpinner
Animated loading indicator.

```typescript
import { LoadingSpinner } from '@/components';

<LoadingSpinner size="md" variant="default" fullScreen={false} />
```

**Props:**
- `size`: `'sm' | 'md' | 'lg'`
- `variant`: `'default' | 'secondary'`
- `fullScreen`: `boolean`

---

#### Toast & ToastContainer
Non-intrusive notifications.

```typescript
import { Toast, ToastContainer } from '@/components';

const [toasts, setToasts] = useState([]);

const addToast = () => {
  setToasts([
    ...toasts,
    { id: '1', message: 'Success!', type: 'success' }
  ]);
};

<ToastContainer
  toasts={toasts}
  onRemove={(id) => setToasts(toasts.filter(t => t.id !== id))}
/>
```

---

#### BarChart
Interactive bar chart component.

```typescript
import { BarChart } from '@/components';

<BarChart
  data={[
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 72 },
  ]}
  maxValue={100}
  height={250}
  title="Monthly Stats"
/>
```

---

#### Modal
Dialog component with escape key and backdrop click handling.

```typescript
import { Modal } from '@/components';

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="md"
>
  Modal content
</Modal>
```

**Props:**
- `size`: `'sm' | 'md' | 'lg' | 'xl'`
- `closeButton`: `boolean`

---

#### Dropdown
Dropdown menu with keyboard support.

```typescript
import { Dropdown } from '@/components';

<Dropdown
  trigger={<Button>Menu</Button>}
  items={[
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { divider: true, label: '', value: '' },
    { label: 'Delete', value: 'delete' },
  ]}
  onSelect={(value) => console.log(value)}
  align="right"
/>
```

---

#### Tabs
Tab navigation component.

```typescript
import { Tabs } from '@/components';

<Tabs
  tabs={[
    {
      label: 'Tab 1',
      value: 'tab1',
      icon: '📊',
      content: <div>Content 1</div>,
    },
    {
      label: 'Tab 2',
      value: 'tab2',
      icon: '📈',
      content: <div>Content 2</div>,
    },
  ]}
  defaultTab="tab1"
  onChange={(value) => console.log(value)}
/>
```

---

### Layout Components

#### Header
Sticky header with user menu integration.

```typescript
import { Header } from '@/components';

<Header
  title="Dashboard"
  logo={<Logo />}
  user={{
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://...',
  }}
  onLogout={() => {}}
/>
```

---

#### Sidebar
Collapsible sidebar with nested menu items.

```typescript
import { Sidebar } from '@/components';

<Sidebar
  items={[
    { label: 'Dashboard', value: 'dashboard', icon: '📊' },
    {
      label: 'Settings',
      value: 'settings',
      icon: '⚙️',
      subItems: [
        { label: 'Profile', value: 'profile' },
        { label: 'Security', value: 'security' },
      ],
    },
  ]}
  activeItem="dashboard"
  onSelect={(value) => {}}
  collapsible={true}
  footer={<Footer />}
/>
```

---

#### Container
Responsive container with max-width constraints.

```typescript
import { Container } from '@/components';

<Container maxWidth="lg">
  Content
</Container>
```

**Props:**
- `maxWidth`: `'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'`

---

## 🎨 Theme

The component library uses a dark theme optimized for AI applications. Access theme colors and spacing via:

```typescript
import { colors, typography, spacing, borderRadius } from '@/lib/theme';
```

### Color Palette

- **Primary Background**: `#0f0f0f`
- **Secondary Background**: `#1a1a1a`
- **Accent (Beige)**: `#8b7355`
- **Text Primary**: `#ffffff`
- **Text Secondary**: `#b0b0b0`

---

## 📝 Examples

### Complete Authentication Form

```typescript
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  Input, 
  Button 
} from '@/components';
import { useState } from 'react';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <div className="space-y-4 p-6">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon="✉️"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon="🔒"
          />
          <Button className="w-full">Sign In</Button>
        </div>
      </Card>
    </div>
  );
};
```

---

## 🚀 Quick Start

1. Import components:
```typescript
import { Button, Card, Input } from '@/components';
```

2. Use in your component:
```typescript
<Button variant="primary" onClick={() => {}}>
  Click Me
</Button>
```

3. Customize with Tailwind classes:
```typescript
<Button className="rounded-none">Custom Button</Button>
```

---

## 📚 File Structure

```
src/
├── components/
│   ├── ui/                          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Toast.tsx
│   │   ├── BarChart.tsx
│   │   ├── Modal.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Tabs.tsx
│   │   └── StatCard.tsx
│   ├── layout/                      # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Container.tsx
│   ├── ComponentShowcase.tsx        # Demo/showcase component
│   └── index.ts                     # Barrel export
├── lib/
│   └── theme.ts                     # Theme configuration
└── index.css                        # Global styles & animations
```

---

## 🔧 Customization

All components accept standard HTML attributes and can be extended with custom className:

```typescript
<Button className="custom-class">
  Custom Button
</Button>
```

Override theme colors by updating `src/lib/theme.ts` and rebuilding components.

---

## ✨ Features

✅ **Dark Theme Optimized** - Perfect for AI/search applications  
✅ **TypeScript Support** - Full type safety  
✅ **Accessible** - Keyboard navigation & ARIA labels  
✅ **Responsive** - Mobile-first design  
✅ **Performant** - Minimal re-renders  
✅ **Composable** - Flexible and reusable  
✅ **Tailwind CSS** - Easy customization  

---

## 📄 License

Part of the aiSearch project.
