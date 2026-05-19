# Carousel

Carousel component for displaying rotating content in a slideshow format.

## Import

```typescript
import { Carousel } from '@eightfold.ai/octuple';
```

## API Reference

### Carousel Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| autoplay | Whether to automatically scroll | `boolean` | `false` | |
| classNames | The Carousel class names | `string` | | |
| currentSlide | Current slide index | `number` | `0` | |
| dots | Show position dots | `boolean` | `true` | |
| dotPosition | Position of dots | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | |
| easing | Animation easing function | `string` | `'ease'` | |
| effect | Transition effect | `'scroll' \| 'fade'` | `'scroll'` | |
| loop | Enable infinite loop | `boolean` | `true` | |
| onSlideChange | Callback when slide changes | `(current: number, previous: number) => void` | | |
| pauseOnHover | Pause autoplay on hover | `boolean` | `true` | |
| showArrows | Show navigation arrows | `boolean` | `true` | |
| slideDirection | Direction of slides | `'horizontal' \| 'vertical'` | `'horizontal'` | |
| slidesToScroll | Number of slides to scroll at once | `number` | `1` | |
| slidesToShow | Number of slides to show at once | `number` | `1` | |
| speed | Animation speed in milliseconds | `number` | `300` | |
| style | The Carousel custom styles | `React.CSSProperties` | | |
| swipeable | Enable touch swipe | `boolean` | `true` | |
| data-test-id | Unique id used to target element for testing | `string` | | |
| ref | The component ref | `Ref<HTMLDivElement>` | | |

## Usage Examples

### Basic Carousel

```typescript
import { Carousel } from '@eightfold.ai/octuple';

function BasicCarousel() {
  return (
    <Carousel>
      <div style={{ height: '200px', background: '#1890ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h3>Slide 1</h3>
      </div>
      <div style={{ height: '200px', background: '#52c41a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h3>Slide 2</h3>
      </div>
      <div style={{ height: '200px', background: '#faad14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h3>Slide 3</h3>
      </div>
    </Carousel>
  );
}
```

### Autoplay Carousel

```typescript
import { Carousel } from '@eightfold.ai/octuple';

function AutoplayCarousel() {
  return (
    <Carousel autoplay pauseOnHover>
      <div style={{ height: '300px', background: '#1890ff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Slide 1</h2>
      </div>
      <div style={{ height: '300px', background: '#52c41a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Slide 2</h2>
      </div>
      <div style={{ height: '300px', background: '#faad14', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Slide 3</h2>
      </div>
    </Carousel>
  );
}
```

### Controlled Carousel

```typescript
import { Carousel, Button } from '@eightfold.ai/octuple';

function ControlledCarousel() {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  return (
    <>
      <Carousel
        currentSlide={currentSlide}
        onSlideChange={(current) => setCurrentSlide(current)}
      >
        <div style={{ height: '200px', background: '#1890ff' }}>Slide 1</div>
        <div style={{ height: '200px', background: '#52c41a' }}>Slide 2</div>
        <div style={{ height: '200px', background: '#faad14' }}>Slide 3</div>
      </Carousel>
      
      <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
        <Button
          text="Previous"
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
        />
        <Button
          text="Next"
          onClick={() => setCurrentSlide(Math.min(2, currentSlide + 1))}
        />
      </div>
    </>
  );
}
```

### Fade Effect Carousel

```typescript
import { Carousel } from '@eightfold.ai/octuple';

function FadeCarousel() {
  return (
    <Carousel effect="fade" autoplay>
      <img src="/image1.jpg" alt="Slide 1" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
      <img src="/image2.jpg" alt="Slide 2" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
      <img src="/image3.jpg" alt="Slide 3" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
    </Carousel>
  );
}
```

### Multiple Slides Visible

```typescript
import { Carousel, Card } from '@eightfold.ai/octuple';

function MultiSlideCarousel() {
  const products = [
    { id: 1, name: 'Product 1' },
    { id: 2, name: 'Product 2' },
    { id: 3, name: 'Product 3' },
    { id: 4, name: 'Product 4' },
    { id: 5, name: 'Product 5' }
  ];

  return (
    <Carousel slidesToShow={3} slidesToScroll={1}>
      {products.map((product) => (
        <div key={product.id} style={{ padding: '0 8px' }}>
          <Card>
            <h4>{product.name}</h4>
          </Card>
        </div>
      ))}
    </Carousel>
  );
}
```

### Vertical Carousel

```typescript
import { Carousel } from '@eightfold.ai/octuple';

function VerticalCarousel() {
  return (
    <Carousel slideDirection="vertical" style={{ height: '400px' }}>
      <div style={{ height: '400px', background: '#1890ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h3>Slide 1</h3>
      </div>
      <div style={{ height: '400px', background: '#52c41a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h3>Slide 2</h3>
      </div>
      <div style={{ height: '400px', background: '#faad14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h3>Slide 3</h3>
      </div>
    </Carousel>
  );
}
```

### Carousel with Custom Dots Position

```typescript
import { Carousel } from '@eightfold.ai/octuple';

function DotsPositionCarousel() {
  return (
    <Carousel dotPosition="top">
      <div style={{ height: '250px', background: '#1890ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h3>Slide 1</h3>
      </div>
      <div style={{ height: '250px', background: '#52c41a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h3>Slide 2</h3>
      </div>
      <div style={{ height: '250px', background: '#faad14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h3>Slide 3</h3>
      </div>
    </Carousel>
  );
}
```

### Hero Banner Carousel

```typescript
import { Carousel, Button, ButtonVariant } from '@eightfold.ai/octuple';

function HeroBannerCarousel() {
  const slides = [
    {
      id: 1,
      title: 'Welcome to Our Platform',
      description: 'Discover amazing features',
      background: '#1890ff'
    },
    {
      id: 2,
      title: 'Boost Your Productivity',
      description: 'Get things done faster',
      background: '#52c41a'
    },
    {
      id: 3,
      title: 'Join Our Community',
      description: 'Connect with millions of users',
      background: '#faad14'
    }
  ];

  return (
    <Carousel autoplay pauseOnHover>
      {slides.map((slide) => (
        <div
          key={slide.id}
          style={{
            height: '400px',
            background: slide.background,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            padding: '40px'
          }}
        >
          <h1>{slide.title}</h1>
          <p style={{ fontSize: '18px', marginBottom: '24px' }}>{slide.description}</p>
          <Button text="Learn More" variant={ButtonVariant.Primary} />
        </div>
      ))}
    </Carousel>
  );
}
```

## Accessibility

- Provide meaningful alt text for images
- Ensure carousel can be paused (pauseOnHover)
- Make navigation controls keyboard accessible
- Announce slide changes to screen readers
- Don't autoplay without user control

## Best Practices

1. **Appropriate Content**: Use for image galleries, testimonials, hero banners
2. **User Control**: Always allow users to pause autoplay
3. **Clear Navigation**: Ensure arrows and dots are visible and clickable
4. **Mobile Friendly**: Enable swipeable for touch devices
5. **Performance**: Optimize images and limit number of slides
6. **Accessibility**: Provide pause controls and keyboard navigation

## Common Mistakes

❌ **Don't** autoplay without pause capability

```typescript
// Bad - can't pause autoplay
<Carousel autoplay pauseOnHover={false} />
```

✅ **Do** allow users to pause

```typescript
// Good
<Carousel autoplay pauseOnHover />
```

❌ **Don't** hide navigation controls

```typescript
// Bad - no way to navigate
<Carousel showArrows={false} dots={false} />
```

✅ **Do** provide navigation

```typescript
// Good
<Carousel showArrows dots />
```

❌ **Don't** use for critical content

```typescript
// Bad - important info hidden in carousel
<Carousel autoplay>
  <div>Critical information 1</div>
  <div>Critical information 2</div>
</Carousel>
```

✅ **Do** show critical content directly

```typescript
// Good
<div>Critical information displayed prominently</div>
<Carousel autoplay>
  <div>Supplementary image 1</div>
  <div>Supplementary image 2</div>
</Carousel>
```

## Related Components

- [Card](./Card.md) - Often used within carousel slides
- [Button](./Button.md) - For carousel controls
- [Image](./Image.md) - For image carousels

