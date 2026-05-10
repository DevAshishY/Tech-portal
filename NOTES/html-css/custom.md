# CSS Tips & Tricks

---

### 1. `:not()` Pseudo Class

Select all elements that do NOT match a selector.

```css
li:not(.one) {
  font-style: italic;
}
```

---

### 2. `object-fit` Property for Image Control

Control how an image fills its container without distortion.

```css
img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
```

---

### 3. Smooth Scrolling

Enable smooth scroll behavior for anchor links.

```css
html {
  scroll-behavior: smooth;
}
```

---

### 4. `:empty` for Empty Elements

Hide elements that have no content.

```css
p:empty {
  display: none;
}
```

---

### 5. Data Attributes

Answer
