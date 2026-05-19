# Two-Column Layout Pattern

**Pattern Type:** Layout  
**Complexity:** Medium  
**Last Updated:** November 20, 2024  
**Octuple Version:** 2.54.2

---

## Overview

### What is this pattern?

The Two-Column Layout Pattern demonstrates how to create content and sidebar layouts using Octuple's Row and Col grid components. This is one of the most common layout patterns in web applications, featuring a main content area with a complementary sidebar.

### When to use this pattern

- Blog posts with related content sidebar
- Product pages with specifications sidebar
- Application interfaces with navigation or filters
- Dashboard layouts with widgets
- Detail pages with metadata or actions sidebar

### When NOT to use this pattern

- Mobile-first layouts (use stacked single column)
- Equal-width columns (use simpler grid)
- Three or more columns (different pattern)
- When sidebar content is minimal

---

## Components Used

- **Row** - Grid row container with gutter
- **Col** - Grid column with span
- **Layout** - Page-level structure
- **Card** - Content containers
- **Button** - Actions in sidebar
- **Badge** - Status indicators
- **Avatar** - User information

---

## Critical Note: Horizontal Layout

⚠️ **IMPORTANT:** Octuple's Row/Col components require **explicit flex styling** to display side-by-side.

**Without flex styles:**
```typescript
<Row gutter={24}>
  <Col span={16}>Content</Col>
  <Col span={8}>Sidebar</Col>
</Row>
// ❌ Columns stack vertically
```

**With flex styles (CORRECT):**
```typescript
<Row gutter={24} style={{ display: 'flex', flexWrap: 'nowrap' }}>
  <Col span={16} style={{ flex: '0 0 66.666%', maxWidth: '66.666%' }}>Content</Col>
  <Col span={8} style={{ flex: '0 0 33.333%', maxWidth: '33.333%' }}>Sidebar</Col>
</Row>
// ✅ Columns display horizontally
```

---

## Basic Pattern

### Simple Two-Column Layout (66/33 Split)

```typescript
import React from 'react';
import { Row, Col, Card } from '@eightfold.ai/octuple';

const BasicTwoColumnLayout = () => {
  return (
    <Row 
      gutter={24}
      style={{ display: 'flex', flexWrap: 'nowrap' }}
    >
      {/* Main Content - 2/3 width */}
      <Col 
        span={16}
        style={{ flex: '0 0 66.666%', maxWidth: '66.666%' }}
      >
        <Card title="Main Content">
          <h2>Article Title</h2>
          <p>This is the main content area. It takes up 2/3 of the available width.</p>
          <p>Content goes here...</p>
        </Card>
      </Col>

      {/* Sidebar - 1/3 width */}
      <Col 
        span={8}
        style={{ flex: '0 0 33.333%', maxWidth: '33.333%' }}
      >
        <Card title="Sidebar">
          <h3>Related Items</h3>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        </Card>
      </Col>
    </Row>
  );
};
```

**Key Features:**
- 66/33 split (span={16} and span={8})
- Gutter for spacing between columns
- Explicit flex styling for horizontal layout
- Card components for content containers

---

## Pattern Variations

### Variation 1: Content Left, Sidebar Right (70/30 Split)

**Use Case:** Blog post with related content

```typescript
import { Row, Col, Card, Button, ButtonVariant, Avatar, Badge } from '@eightfold.ai/octuple';

const BlogPostLayout = () => {
  return (
    <Row 
      gutter={24}
      style={{ display: 'flex', flexWrap: 'nowrap' }}
    >
      {/* Main Content - 70% */}
      <Col 
        span={17}
        style={{ flex: '0 0 70.833%', maxWidth: '70.833%' }}
      >
        <Card>
          <h1>Understanding React Hooks</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Avatar size="32px">JD</Avatar>
            <div>
              <div style={{ fontWeight: 'bold' }}>John Doe</div>
              <div style={{ color: '#666', fontSize: '14px' }}>Published on Nov 20, 2024</div>
            </div>
          </div>
          
          <p>React Hooks revolutionized how we write React components...</p>
          <p>In this article, we'll explore useState, useEffect, and custom hooks...</p>
          
          <h2>What are Hooks?</h2>
          <p>Hooks are functions that let you "hook into" React state and lifecycle features...</p>
          
          {/* More content */}
        </Card>
      </Col>

      {/* Sidebar - 30% */}
      <Col 
        span={7}
        style={{ flex: '0 0 29.167%', maxWidth: '29.167%' }}
      >
        {/* Table of Contents */}
        <Card title="Table of Contents" style={{ marginBottom: '16px' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px' }}>
              <a href="#what-are-hooks">What are Hooks?</a>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <a href="#usestate">useState Hook</a>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <a href="#useeffect">useEffect Hook</a>
            </li>
          </ul>
        </Card>

        {/* Related Articles */}
        <Card title="Related Articles" style={{ marginBottom: '16px' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '12px' }}>
              <a href="/article/1">Introduction to React</a>
            </li>
            <li style={{ marginBottom: '12px' }}>
              <a href="/article/2">Advanced Hooks Patterns</a>
            </li>
            <li style={{ marginBottom: '12px' }}>
              <a href="/article/3">Custom Hooks Guide</a>
            </li>
          </ul>
        </Card>

        {/* Author Info */}
        <Card title="About the Author">
          <div style={{ textAlign: 'center' }}>
            <Avatar size="80px">JD</Avatar>
            <h3>John Doe</h3>
            <p style={{ color: '#666' }}>Senior Frontend Developer</p>
            <Button text="Follow" variant={ButtonVariant.Primary} buttonWidth="fill" />
          </div>
        </Card>
      </Col>
    </Row>
  );
};
```

**Key Features:**
- 70/30 content split
- Multiple sidebar cards
- Author information
- Table of contents
- Related articles

---

### Variation 2: Sidebar Left, Content Right

**Use Case:** Application with navigation sidebar

```typescript
import { Row, Col, Card, Menu, Breadcrumb } from '@eightfold.ai/octuple';
import { mdiHome, mdiAccount, mdiCog, mdiChartLine } from '@mdi/js';
import { IconName } from '@mdi/react';

const AppWithSidebar = () => {
  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', iconProps: { path: mdiHome as IconName } },
    { key: 'analytics', label: 'Analytics', iconProps: { path: mdiChartLine as IconName } },
    { key: 'profile', label: 'Profile', iconProps: { path: mdiAccount as IconName } },
    { key: 'settings', label: 'Settings', iconProps: { path: mdiCog as IconName } },
  ];

  const breadcrumbLinks = [
    { url: '/', children: 'Home' },
    { url: '/dashboard', children: 'Dashboard' },
    { children: 'Overview' },
  ];

  return (
    <Row 
      gutter={24}
      style={{ display: 'flex', flexWrap: 'nowrap', minHeight: '100vh' }}
    >
      {/* Sidebar - 250px fixed width */}
      <Col 
        span={6}
        style={{ 
          flex: '0 0 250px', 
          maxWidth: '250px',
          background: '#f5f5f5',
          padding: '24px 0'
        }}
      >
        <div style={{ padding: '0 16px', marginBottom: '24px' }}>
          <h2>My App</h2>
        </div>
        <Menu items={menuItems} />
      </Col>

      {/* Main Content - Flexible width */}
      <Col 
        span={18}
        style={{ flex: '1', padding: '24px' }}
      >
        <Breadcrumb links={breadcrumbLinks} />
        
        <h1 style={{ marginTop: '16px', marginBottom: '24px' }}>Dashboard Overview</h1>
        
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card title="Total Users">
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>1,234</div>
              <div style={{ color: '#52c41a' }}>↑ 12% from last month</div>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Revenue">
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>$45,678</div>
              <div style={{ color: '#52c41a' }}>↑ 8% from last month</div>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
```

**Key Features:**
- Fixed-width sidebar (250px)
- Flexible main content area
- Navigation menu
- Breadcrumb navigation
- Dashboard metrics

---

### Variation 3: Responsive Two-Column Layout

**Use Case:** Responsive design that stacks on mobile

```typescript
import { Row, Col, Card, Button, ButtonVariant } from '@eightfold.ai/octuple';
import { useState, useEffect } from 'react';

const ResponsiveTwoColumnLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Row 
      gutter={24}
      style={{ 
        display: 'flex', 
        flexWrap: isMobile ? 'wrap' : 'nowrap' 
      }}
    >
      {/* Main Content */}
      <Col 
        span={isMobile ? 24 : 16}
        style={{ 
          flex: isMobile ? '0 0 100%' : '0 0 66.666%',
          maxWidth: isMobile ? '100%' : '66.666%',
          marginBottom: isMobile ? '16px' : 0
        }}
      >
        <Card title="Product Details">
          <h2>Premium Laptop</h2>
          <p>High-performance laptop with the latest specifications...</p>
          <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '16px 0' }}>
            $1,299.99
          </div>
          <Button 
            text="Add to Cart" 
            variant={ButtonVariant.Primary}
            buttonWidth="fill"
          />
        </Card>
      </Col>

      {/* Sidebar */}
      <Col 
        span={isMobile ? 24 : 8}
        style={{ 
          flex: isMobile ? '0 0 100%' : '0 0 33.333%',
          maxWidth: isMobile ? '100%' : '33.333%'
        }}
      >
        <Card title="Specifications" style={{ marginBottom: '16px' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px' }}><strong>CPU:</strong> Intel i7</li>
            <li style={{ marginBottom: '8px' }}><strong>RAM:</strong> 16GB</li>
            <li style={{ marginBottom: '8px' }}><strong>Storage:</strong> 512GB SSD</li>
            <li style={{ marginBottom: '8px' }}><strong>Display:</strong> 15.6" Full HD</li>
          </ul>
        </Card>

        <Card title="Shipping Info">
          <p>Free shipping on orders over $1,000</p>
          <p>Estimated delivery: 3-5 business days</p>
        </Card>
      </Col>
    </Row>
  );
};
```

**Key Features:**
- Responsive breakpoint (768px)
- Stacks vertically on mobile
- Full-width columns on small screens
- Maintains two-column on desktop

---

### Variation 4: 50/50 Split with Equal Columns

**Use Case:** Comparison view or dual panels

```typescript
import { Row, Col, Card, Button, ButtonVariant } from '@eightfold.ai/octuple';

const EqualColumnsLayout = () => {
  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Compare Plans</h1>
      
      <Row 
        gutter={24}
        style={{ display: 'flex', flexWrap: 'nowrap' }}
      >
        {/* Left Column - 50% */}
        <Col 
          span={12}
          style={{ flex: '0 0 50%', maxWidth: '50%' }}
        >
          <Card>
            <div style={{ textAlign: 'center' }}>
              <h2>Basic Plan</h2>
              <div style={{ fontSize: '36px', fontWeight: 'bold', margin: '24px 0' }}>
                $9.99<span style={{ fontSize: '16px', fontWeight: 'normal' }}>/month</span>
              </div>
              
              <ul style={{ textAlign: 'left', marginBottom: '24px' }}>
                <li>10 GB Storage</li>
                <li>Basic Support</li>
                <li>1 User</li>
                <li>Email Support</li>
              </ul>
              
              <Button 
                text="Choose Basic" 
                variant={ButtonVariant.Default}
                buttonWidth="fill"
              />
            </div>
          </Card>
        </Col>

        {/* Right Column - 50% */}
        <Col 
          span={12}
          style={{ flex: '0 0 50%', maxWidth: '50%' }}
        >
          <Card>
            <div style={{ textAlign: 'center' }}>
              <h2>Pro Plan</h2>
              <div style={{ fontSize: '36px', fontWeight: 'bold', margin: '24px 0' }}>
                $29.99<span style={{ fontSize: '16px', fontWeight: 'normal' }}>/month</span>
              </div>
              
              <ul style={{ textAlign: 'left', marginBottom: '24px' }}>
                <li>100 GB Storage</li>
                <li>Priority Support</li>
                <li>Unlimited Users</li>
                <li>24/7 Phone Support</li>
              </ul>
              
              <Button 
                text="Choose Pro" 
                variant={ButtonVariant.Primary}
                buttonWidth="fill"
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
```

**Key Features:**
- Equal 50/50 split
- Comparison layout
- Centered content
- Call-to-action buttons

---

## Complete Example: Candidate Details Page

**Full implementation with header, breadcrumb, and two-column layout:**

```typescript
import React from 'react';
import {
  Layout,
  Row,
  Col,
  Breadcrumb,
  Avatar,
  Button,
  ButtonVariant,
  Card,
  Tabs,
  Tab,
  TextArea,
  Badge
} from '@eightfold.ai/octuple';
import { mdiDownload, mdiEmail, mdiPhone } from '@mdi/js';
import { IconName } from '@mdi/react';

const CandidateDetailsPage = () => {
  const breadcrumbLinks = [
    { url: '/', children: 'Home' },
    { url: '/candidates', children: 'Candidates' },
    { children: 'John Doe' },
  ];

  const [activeTab, setActiveTab] = React.useState('info');

  return (
    <Layout>
      <Layout.Content style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <Breadcrumb links={breadcrumbLinks} />

        {/* Candidate Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          margin: '24px 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Avatar size="80px" type="square">JD</Avatar>
            <div>
              <h1 style={{ margin: 0 }}>John Doe</h1>
              <p style={{ margin: '4px 0', color: '#666' }}>Senior Software Engineer</p>
              <Badge count="Active" />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              text="Email"
              iconProps={{ path: mdiEmail as IconName }}
            />
            <Button 
              text="Call"
              iconProps={{ path: mdiPhone as IconName }}
            />
            <Button 
              text="Download Resume"
              iconProps={{ path: mdiDownload as IconName }}
              variant={ButtonVariant.Primary}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tab value="info" label="Information">
            {/* Two-Column Layout */}
            <Row 
              gutter={24}
              style={{ display: 'flex', flexWrap: 'nowrap', marginTop: '24px' }}
            >
              {/* Main Content - Left (66%) */}
              <Col 
                span={16}
                style={{ flex: '0 0 66.666%', maxWidth: '66.666%' }}
              >
                {/* Resume */}
                <Card title="Resume" style={{ marginBottom: '16px' }}>
                  <h3>Experience</h3>
                  <div style={{ marginBottom: '16px' }}>
                    <strong>Senior Software Engineer</strong> at Tech Corp
                    <div style={{ color: '#666' }}>2020 - Present</div>
                    <p>Led development of enterprise applications...</p>
                  </div>
                  
                  <h3>Education</h3>
                  <div>
                    <strong>B.S. Computer Science</strong>
                    <div style={{ color: '#666' }}>University Name, 2016</div>
                  </div>
                </Card>

                {/* Comments */}
                <Card title="Comments">
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                      <Avatar size="32px">HR</Avatar>
                      <div style={{ flex: 1 }}>
                        <strong>HR Manager</strong>
                        <p>Great candidate! Strong technical skills and communication.</p>
                        <div style={{ color: '#666', fontSize: '12px' }}>2 days ago</div>
                      </div>
                    </div>
                  </div>
                  
                  <TextArea 
                    placeholder="Add a comment..."
                    rows={3}
                  />
                  <Button 
                    text="Post Comment" 
                    variant={ButtonVariant.Primary}
                    style={{ marginTop: '8px' }}
                  />
                </Card>
              </Col>

              {/* Sidebar - Right (33%) */}
              <Col 
                span={8}
                style={{ flex: '0 0 33.333%', maxWidth: '33.333%' }}
              >
                {/* Evaluations */}
                <Card title="Evaluations" style={{ marginBottom: '16px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Technical Skills</span>
                      <strong>9/10</strong>
                    </div>
                    <div style={{ height: '8px', background: '#f0f0f0', borderRadius: '4px' }}>
                      <div style={{ width: '90%', height: '100%', background: '#1890ff', borderRadius: '4px' }} />
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Communication</span>
                      <strong>8/10</strong>
                    </div>
                    <div style={{ height: '8px', background: '#f0f0f0', borderRadius: '4px' }}>
                      <div style={{ width: '80%', height: '100%', background: '#1890ff', borderRadius: '4px' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Culture Fit</span>
                      <strong>9/10</strong>
                    </div>
                    <div style={{ height: '8px', background: '#f0f0f0', borderRadius: '4px' }}>
                      <div style={{ width: '90%', height: '100%', background: '#1890ff', borderRadius: '4px' }} />
                    </div>
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card title="Quick Actions">
                  <Button 
                    text="Move to Next Stage" 
                    variant={ButtonVariant.Primary}
                    buttonWidth="fill"
                    style={{ marginBottom: '8px' }}
                  />
                  <Button 
                    text="Schedule Interview"
                    buttonWidth="fill"
                    style={{ marginBottom: '8px' }}
                  />
                  <Button 
                    text="Send Email"
                    buttonWidth="fill"
                  />
                </Card>
              </Col>
            </Row>
          </Tab>

          <Tab value="schedule" label="Schedule">
            <p>Schedule content...</p>
          </Tab>
        </Tabs>
      </Layout.Content>
    </Layout>
  );
};

export default CandidateDetailsPage;
```

**Complete Features:**
- ✅ Full page layout with Layout component
- ✅ Breadcrumb navigation
- ✅ Candidate header with Avatar and actions
- ✅ Tabs for content organization
- ✅ Two-column layout (66/33 split)
- ✅ Main content area with cards
- ✅ Sidebar with evaluations and actions
- ✅ Proper flex styling for horizontal layout
- ✅ Responsive card spacing

---

## Best Practices

### ✅ Do

1. **Always Add Flex Styles**
   - Use `display: 'flex', flexWrap: 'nowrap'` on Row
   - Use explicit flex and maxWidth on Col

2. **Use Appropriate Gutters**
   - Standard: `gutter={24}` (24px spacing)
   - Tight: `gutter={16}` (16px spacing)
   - Loose: `gutter={32}` (32px spacing)

3. **Choose the Right Split**
   - Content-heavy: 70/30 or 75/25
   - Balanced: 66/33 or 60/40
   - Equal importance: 50/50

4. **Consider Mobile**
   - Stack columns on small screens
   - Use responsive breakpoints
   - Test on mobile devices

5. **Use Cards for Sections**
   - Wrap content in Card components
   - Provides visual separation
   - Better organization

6. **Set Min-Height for Full-Page Layouts**
   - Use `minHeight: '100vh'` for full-height layouts
   - Prevents short content from looking awkward

### ❌ Don't

1. **Don't Forget Flex Styles**
   - Columns will stack without them
   - Always include explicit flex properties

2. **Don't Use Too Many Columns**
   - Two-column pattern is for two columns
   - Use different patterns for 3+ columns

3. **Don't Make Sidebar Too Wide**
   - Sidebar should be 25-35% maximum
   - Main content needs more space

4. **Don't Ignore Mobile**
   - Two columns rarely work on mobile
   - Plan for responsive behavior

5. **Don't Nest Row/Col Too Deeply**
   - Keep layout structure simple
   - Use flexbox or CSS Grid for complex layouts

---

## Accessibility

### Layout Considerations

- **Semantic HTML**: Use proper heading hierarchy (h1, h2, h3)
- **Keyboard Navigation**: Ensure all interactive elements are reachable
- **Focus Management**: Maintain logical focus order (top-to-bottom, left-to-right)
- **Screen Reader**: Content should make sense when linearized

### Mobile Accessibility

- **Touch Targets**: Ensure buttons are large enough (44px minimum)
- **Text Size**: Use readable font sizes (16px+ for body text)
- **Contrast**: Maintain proper color contrast ratios

---

## Common Issues

### Issue 1: Columns Stacking Instead of Side-by-Side

**Problem:**
```typescript
<Row gutter={24}>
  <Col span={16}>Content</Col>
  <Col span={8}>Sidebar</Col>
</Row>
// ❌ Columns stack vertically
```

**Solution:**
```typescript
<Row gutter={24} style={{ display: 'flex', flexWrap: 'nowrap' }}>
  <Col span={16} style={{ flex: '0 0 66.666%', maxWidth: '66.666%' }}>Content</Col>
  <Col span={8} style={{ flex: '0 0 33.333%', maxWidth: '33.333%' }}>Sidebar</Col>
</Row>
// ✅ Columns display horizontally
```

---

### Issue 2: Unequal Column Heights

**Problem:**
- Columns have different heights
- Looks unbalanced

**Solution:**
- Let columns have natural heights (don't force equal heights)
- OR use `style={{ minHeight: 'X' }}` if needed
- Place longer content in main column

---

### Issue 3: Responsive Not Working

**Problem:**
- Layout doesn't adapt to screen size

**Solution:**
```typescript
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth < 768);
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);

// Use isMobile to adjust layout
```

---

## Related Patterns

- **Navigation Pattern** - Sidebar navigation menus
- **Dashboard Layout Pattern** - Multi-widget layouts
- **Card Grid Pattern** - Multi-column card grids

---

## Related Components

- **Row** - Grid row container
- **Col** - Grid column
- **Layout** - Page-level structure
- **Card** - Content containers

---

## Resources

- [Row Component Guide](../components/Row.md)
- [Col Component Guide](../components/Col.md)
- [Layout Component Guide](../components/Layout.md)
- [Octuple Grid Documentation](https://eightfold.atlassian.net/)

---

## Changelog

### November 20, 2024
- Initial pattern documentation
- Added 4 variations with complete examples
- Documented flex styling requirement
- Included responsive examples
- Added accessibility guidelines
- Complete candidate details page example

