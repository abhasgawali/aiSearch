import React, { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  StatCard,
  Input,
  Badge,
  LoadingSpinner,
  Avatar,
  Toast,
  ToastContainer,
  BarChart,
  Modal,
  Dropdown,
  Tabs,
  Header,
  Sidebar,
  Container,
} from './index';

export const ComponentShowcase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>>([]);
  const [activeTab, setActiveTab] = useState('buttons');

  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString();
    setToasts([...toasts, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(toasts.filter((t) => t.id !== id));
  };

  const chartData = [
    { label: 'Dec', value: 45 },
    { label: 'Jan', value: 72 },
    { label: 'Feb', value: 55 },
    { label: 'Mar', value: 85 },
    { label: 'Apr', value: 52 },
    { label: 'May', value: 95 },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <Header
        title="Component Library Showcase"
        user={{
          name: 'John Doe',
          email: 'john@example.com',
        }}
        onLogout={() => addToast('Logged out successfully', 'success')}
      />

      <div className="flex">
        <Sidebar
          items={[
            { label: 'Dashboard', value: 'dashboard', icon: '📊' },
            { label: 'Components', value: 'components', icon: '🎨' },
            {
              label: 'Forms',
              value: 'forms',
              icon: '📝',
              subItems: [
                { label: 'Inputs', value: 'inputs' },
                { label: 'Validation', value: 'validation' },
              ],
            },
            { label: 'Settings', value: 'settings', icon: '⚙️' },
          ]}
          activeItem="components"
          footer={
            <div className="text-xs text-gray-600">
              <p>Version 1.0.0</p>
              <p>© 2024 AI Search</p>
            </div>
          }
        />

        <main className="ml-64 p-8 flex-1">
          <Container maxWidth="2xl">
            <Tabs
              tabs={[
                {
                  label: 'Buttons',
                  value: 'buttons',
                  icon: '🔘',
                  content: (
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Button Variants</CardTitle>
                          <CardDescription>
                            Different button styles for various use cases
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex flex-wrap gap-4">
                            <Button variant="primary" onClick={() => addToast('Primary button clicked', 'info')}>
                              Primary Button
                            </Button>
                            <Button variant="secondary" onClick={() => addToast('Secondary button clicked', 'info')}>
                              Secondary Button
                            </Button>
                            <Button variant="tertiary" onClick={() => addToast('Tertiary button clicked', 'info')}>
                              Tertiary Button
                            </Button>
                            <Button variant="ghost" onClick={() => addToast('Ghost button clicked', 'info')}>
                              Ghost Button
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-4">
                            <Button size="sm" variant="primary">
                              Small Button
                            </Button>
                            <Button size="md" variant="primary">
                              Medium Button
                            </Button>
                            <Button size="lg" variant="primary">
                              Large Button
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-4">
                            <Button isLoading variant="primary">
                              Loading Button
                            </Button>
                            <Button disabled variant="primary">
                              Disabled Button
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ),
                },
                {
                  label: 'Cards',
                  value: 'cards',
                  icon: '🎴',
                  content: (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card variant="default">
                          <CardHeader>
                            <CardTitle>Default Card</CardTitle>
                            <CardDescription>Standard card styling</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-400">
                              This is a default card variant with subtle styling.
                            </p>
                          </CardContent>
                        </Card>

                        <Card variant="elevated">
                          <CardHeader>
                            <CardTitle>Elevated Card</CardTitle>
                            <CardDescription>Card with shadow</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-400">
                              This card has an elevated style with shadow effect.
                            </p>
                          </CardContent>
                        </Card>

                        <Card variant="outlined">
                          <CardHeader>
                            <CardTitle>Outlined Card</CardTitle>
                            <CardDescription>Border only styling</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-400">
                              This card features outline styling with transparent background.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ),
                },
                {
                  label: 'Stats',
                  value: 'stats',
                  icon: '📈',
                  content: (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <StatCard
                          label="Total Searches"
                          value="2,543"
                          description="Increased by 12% this month"
                          trend={{ value: 12, isPositive: true }}
                          icon="🔍"
                        />
                        <StatCard
                          label="Average Response Time"
                          value="245ms"
                          description="Improved performance"
                          trend={{ value: 8, isPositive: true }}
                          icon="⚡"
                        />
                        <StatCard
                          label="User Sessions"
                          value="18,234"
                          description="Down from last month"
                          trend={{ value: 5, isPositive: false }}
                          icon="👥"
                        />
                        <StatCard
                          label="Success Rate"
                          value="98.5%"
                          description="Maintaining high standards"
                          trend={{ value: 2, isPositive: true }}
                          icon="✓"
                        />
                      </div>
                    </div>
                  ),
                },
                {
                  label: 'Charts',
                  value: 'charts',
                  icon: '📊',
                  content: (
                    <Card>
                      <CardHeader>
                        <CardTitle>Contribution History</CardTitle>
                        <CardDescription>Last 6 months of activity</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <BarChart
                          data={chartData}
                          maxValue={100}
                          height={250}
                        />
                      </CardContent>
                    </Card>
                  ),
                },
                {
                  label: 'Forms',
                  value: 'forms',
                  icon: '📝',
                  content: (
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Form Inputs</CardTitle>
                          <CardDescription>Input field variations</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Email Address
                            </label>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              icon="✉️"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Password
                            </label>
                            <Input
                              type="password"
                              placeholder="Enter your password"
                              icon="🔒"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              With Error
                            </label>
                            <Input
                              type="text"
                              error="This field is required"
                              placeholder="Invalid input"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              With Helper Text
                            </label>
                            <Input
                              type="text"
                              placeholder="Enter your name"
                              helperText="Your full name as it appears in your ID"
                            />
                          </div>

                          <Button variant="primary">Submit Form</Button>
                        </CardContent>
                      </Card>
                    </div>
                  ),
                },
                {
                  label: 'Other',
                  value: 'other',
                  icon: '✨',
                  content: (
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Badges</CardTitle>
                          <CardDescription>Status and category badges</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-3">
                          <Badge variant="default">Default</Badge>
                          <Badge variant="success">Success</Badge>
                          <Badge variant="warning">Warning</Badge>
                          <Badge variant="error">Error</Badge>
                          <Badge variant="info">Info</Badge>
                          <Badge size="sm">Small Badge</Badge>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Avatars</CardTitle>
                          <CardDescription>User avatars</CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-4 items-center">
                          <Avatar size="sm" initials="JD" />
                          <Avatar size="md" initials="JD" />
                          <Avatar size="lg" initials="JD" />
                          <Avatar size="xl" initials="JD" online />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Loading Spinner</CardTitle>
                          <CardDescription>Different loading states</CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                          <LoadingSpinner size="sm" />
                          <LoadingSpinner size="md" />
                          <LoadingSpinner size="lg" />
                          <LoadingSpinner size="md" variant="secondary" />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Interactive Elements</CardTitle>
                          <CardDescription>Modal and dropdown examples</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button
                            variant="primary"
                            onClick={() => setIsModalOpen(true)}
                          >
                            Open Modal
                          </Button>
                          <Dropdown
                            trigger={<Button variant="secondary">Open Menu</Button>}
                            items={[
                              { label: 'Option 1', value: '1' },
                              { label: 'Option 2', value: '2' },
                              { divider: true, label: '', value: '' },
                              { label: 'Delete', value: 'delete' },
                            ]}
                            onSelect={(value) =>
                              addToast(`Selected: ${value}`, 'info')
                            }
                          />
                        </CardContent>
                      </Card>
                    </div>
                  ),
                },
              ]}
              onChange={(value) => setActiveTab(value)}
            />
          </Container>
        </main>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Modal Example"
        size="md"
      >
        <p className="text-gray-400 mb-4">
          This is a modal dialog. Click outside or press Escape to close.
        </p>
        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={() => {
              setIsModalOpen(false);
              addToast('Action confirmed!', 'success');
            }}
          >
            Confirm
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default ComponentShowcase;
