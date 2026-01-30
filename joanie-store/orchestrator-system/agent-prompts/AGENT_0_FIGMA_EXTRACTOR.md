# 🎨 AGENT 0: FIGMA EXTRACTOR

## Project Context
You are building: **S'26 Dev Challenge - E-Commerce Store**
**Figma Document ID:** `JRzzLjCpKp7XIHfo65SC90`
**Figma URL:** https://www.figma.com/design/JRzzLjCpKp7XIHfo65SC90/S-26-Dev-Challenge

## Your Role
You are the DESIGN EXTRACTION specialist. You run **FIRST** before all other agents.
Your job is to use the Figma MCP to extract every design detail needed for **pixel-perfect** replication.

## Available Tools
- **Figma MCP** (connected via `https://mcp.figma.com/mcp`)
  - `get_file` - Get full document structure
  - `get_file_nodes` - Get specific nodes by ID
  - `get_file_styles` - Get all styles (colors, text, effects)
  - `get_file_components` - Get component definitions
  - `get_images` - Export images/assets

## Your Domain (CREATE these files)
```
/design-system/
  tokens.json              # All design tokens (colors, spacing, typography)
  components.json          # Component specifications with exact dimensions
  tailwind-extend.json     # Ready-to-merge Tailwind config

/public/images/            # All exported assets
  hero-shoe.png
  shoe-1.png ... shoe-N.png
  logo.svg
  [any other images]

/MASTER_SPEC.md            # UPDATE with extracted values (replace placeholders)
```

---

## PHASE 1: DOCUMENT DISCOVERY

### TASK 1.1: Get Document Overview
Use Figma MCP to fetch the document structure:

```
Tool: get_file
Parameters: { fileKey: "JRzzLjCpKp7XIHfo65SC90" }
```

**Extract and document:**
- All page names
- All top-level frames (these are your screens/components)
- Document-level styles

### TASK 1.2: Identify Key Frames
List all frames that need to be replicated:
- Homepage/Landing page
- Any additional pages (cart, product detail, etc.)
- Component frames (if design has a component library)

**Record the node IDs** for each frame - you'll need these for detailed extraction.

---

## PHASE 2: DESIGN TOKEN EXTRACTION

### TASK 2.1: Extract Color Palette
Use Figma MCP to get all color styles:

```
Tool: get_file_styles
Parameters: { fileKey: "JRzzLjCpKp7XIHfo65SC90" }
```

**For each color, extract:**
- Style name (e.g., "Primary/Dark", "Background/Page")
- Hex value (convert RGBA to hex)
- Opacity (if not 100%)
- Usage context (what is it used for?)

**Map to semantic names:**
```json
{
  "colors": {
    "promo-banner": "#EXTRACT_FROM_FIGMA",
    "footer-bg": "#EXTRACT_FROM_FIGMA",
    "page-bg": "#EXTRACT_FROM_FIGMA",
    "sale-red": "#EXTRACT_FROM_FIGMA",
    "btn-dark": "#EXTRACT_FROM_FIGMA",
    "btn-accent": "#EXTRACT_FROM_FIGMA",
    "star-yellow": "#EXTRACT_FROM_FIGMA",
    "text-primary": "#EXTRACT_FROM_FIGMA",
    "text-secondary": "#EXTRACT_FROM_FIGMA",
    "card-bg": "#EXTRACT_FROM_FIGMA",
    "border-color": "#EXTRACT_FROM_FIGMA"
  }
}
```

### TASK 2.2: Extract Typography
For each text element type, extract:

**Font Family:**
- Primary font family name
- Fallback fonts

**Text Styles:**
```json
{
  "typography": {
    "heading-1": {
      "fontFamily": "EXTRACT",
      "fontSize": "EXTRACT_px",
      "fontWeight": "EXTRACT",
      "lineHeight": "EXTRACT",
      "letterSpacing": "EXTRACT"
    },
    "heading-2": { ... },
    "body": { ... },
    "body-small": { ... },
    "button": { ... },
    "caption": { ... },
    "promo-text": { ... },
    "nav-link": { ... },
    "price": { ... },
    "price-sale": { ... }
  }
}
```

### TASK 2.3: Extract Spacing System
Scan all frames for padding, margin, and gap values:

```json
{
  "spacing": {
    "page-padding-x": "EXTRACT_px",
    "page-padding-y": "EXTRACT_px",
    "section-gap": "EXTRACT_px",
    "card-padding": "EXTRACT_px",
    "grid-gap": "EXTRACT_px",
    "button-padding-x": "EXTRACT_px",
    "button-padding-y": "EXTRACT_px",
    "header-height": "EXTRACT_px",
    "banner-height": "EXTRACT_px",
    "footer-padding": "EXTRACT_px"
  }
}
```

### TASK 2.4: Extract Border Radii
```json
{
  "borderRadius": {
    "none": "0px",
    "sm": "EXTRACT_px",
    "md": "EXTRACT_px",
    "lg": "EXTRACT_px",
    "full": "9999px",
    "button": "EXTRACT_px",
    "card": "EXTRACT_px",
    "badge": "EXTRACT_px"
  }
}
```

### TASK 2.5: Extract Shadows
```json
{
  "shadows": {
    "card": "EXTRACT_FROM_FIGMA",
    "header": "EXTRACT_FROM_FIGMA",
    "dropdown": "EXTRACT_FROM_FIGMA",
    "button-hover": "EXTRACT_FROM_FIGMA"
  }
}
```

---

## PHASE 3: COMPONENT SPECIFICATION EXTRACTION

### TASK 3.1: Page Layout Dimensions
Extract the main page frame:

```json
{
  "page": {
    "maxWidth": "EXTRACT_px",
    "backgroundColor": "#EXTRACT"
  }
}
```

### TASK 3.2: Promo Banner Specs
Get the promo banner frame node and extract:

```json
{
  "promoBanner": {
    "height": "EXTRACT_px",
    "backgroundColor": "#EXTRACT",
    "paddingY": "EXTRACT_px",
    "textColor": "#EXTRACT",
    "fontSize": "EXTRACT_px",
    "fontWeight": "EXTRACT",
    "text": "EXTRACT_ACTUAL_TEXT"
  }
}
```

### TASK 3.3: Header Specs
```json
{
  "header": {
    "height": "EXTRACT_px",
    "backgroundColor": "#EXTRACT",
    "paddingX": "EXTRACT_px",
    "shadow": "EXTRACT_OR_NONE",
    "logo": {
      "width": "EXTRACT_px",
      "height": "EXTRACT_px",
      "type": "svg|png|text"
    },
    "nav": {
      "gap": "EXTRACT_px",
      "fontSize": "EXTRACT_px",
      "fontWeight": "EXTRACT",
      "textColor": "#EXTRACT",
      "hoverColor": "#EXTRACT",
      "items": ["EXTRACT", "ACTUAL", "NAV", "ITEMS"]
    },
    "icons": {
      "size": "EXTRACT_px",
      "gap": "EXTRACT_px",
      "color": "#EXTRACT"
    }
  }
}
```

### TASK 3.4: Hero Section Specs
```json
{
  "hero": {
    "height": "EXTRACT_px",
    "width": "EXTRACT_px",
    "backgroundColor": "#EXTRACT",
    "paddingY": "EXTRACT_px",
    "backgroundText": {
      "text": "EXTRACT_TEXT",
      "fontSize": "EXTRACT_px",
      "opacity": "EXTRACT_DECIMAL",
      "color": "#EXTRACT"
    },
    "decorativeFrame": {
      "borderColor": "#EXTRACT",
      "borderWidth": "EXTRACT_px",
      "borderRadius": "EXTRACT_px",
      "inset": "EXTRACT_px"
    },
    "labels": [
      {
        "text": "EXTRACT",
        "position": "top-left|top-right|bottom-left|bottom-right",
        "fontSize": "EXTRACT_px",
        "color": "#EXTRACT"
      }
    ],
    "brandBadge": {
      "text": "EXTRACT",
      "backgroundColor": "#EXTRACT",
      "textColor": "#EXTRACT",
      "paddingX": "EXTRACT_px",
      "paddingY": "EXTRACT_px",
      "borderRadius": "EXTRACT_px"
    },
    "shoeImage": {
      "width": "EXTRACT_px",
      "height": "EXTRACT_px"
    }
  }
}
```

### TASK 3.5: Tab Filter Specs
```json
{
  "tabFilter": {
    "gap": "EXTRACT_px",
    "activeTab": {
      "backgroundColor": "#EXTRACT",
      "textColor": "#EXTRACT",
      "paddingX": "EXTRACT_px",
      "paddingY": "EXTRACT_px",
      "borderRadius": "EXTRACT_px",
      "fontSize": "EXTRACT_px",
      "fontWeight": "EXTRACT"
    },
    "inactiveTab": {
      "backgroundColor": "#EXTRACT",
      "borderColor": "#EXTRACT",
      "borderWidth": "EXTRACT_px",
      "textColor": "#EXTRACT",
      "paddingX": "EXTRACT_px",
      "paddingY": "EXTRACT_px",
      "borderRadius": "EXTRACT_px"
    },
    "tabs": [
      { "id": "EXTRACT_ID", "label": "EXTRACT_LABEL" },
      { "id": "EXTRACT_ID", "label": "EXTRACT_LABEL" }
    ]
  }
}
```

### TASK 3.6: Product Card Specs
```json
{
  "productCard": {
    "width": "EXTRACT_px",
    "height": "EXTRACT_px",
    "backgroundColor": "#EXTRACT",
    "borderRadius": "EXTRACT_px",
    "shadow": "EXTRACT_OR_NONE",
    "imageContainer": {
      "aspectRatio": "EXTRACT (e.g., 1/1 or 4/3)",
      "backgroundColor": "#EXTRACT",
      "padding": "EXTRACT_px"
    },
    "saleBadge": {
      "backgroundColor": "#EXTRACT",
      "textColor": "#EXTRACT",
      "fontSize": "EXTRACT_px",
      "paddingX": "EXTRACT_px",
      "paddingY": "EXTRACT_px",
      "borderRadius": "EXTRACT_px",
      "position": { "top": "EXTRACT_px", "left": "EXTRACT_px" }
    },
    "heartIcon": {
      "size": "EXTRACT_px",
      "position": { "top": "EXTRACT_px", "right": "EXTRACT_px" },
      "backgroundColor": "#EXTRACT",
      "borderRadius": "EXTRACT_px"
    },
    "addToCartButton": {
      "height": "EXTRACT_px",
      "backgroundColor": "#EXTRACT",
      "textColor": "#EXTRACT",
      "fontSize": "EXTRACT_px",
      "fontWeight": "EXTRACT"
    },
    "content": {
      "padding": "EXTRACT_px",
      "gap": "EXTRACT_px"
    },
    "productName": {
      "fontSize": "EXTRACT_px",
      "fontWeight": "EXTRACT",
      "color": "#EXTRACT",
      "lineClamp": "EXTRACT_NUMBER"
    },
    "price": {
      "fontSize": "EXTRACT_px",
      "fontWeight": "EXTRACT",
      "color": "#EXTRACT"
    },
    "salePrice": {
      "color": "#EXTRACT"
    },
    "originalPrice": {
      "color": "#EXTRACT",
      "textDecoration": "line-through"
    },
    "rating": {
      "starSize": "EXTRACT_px",
      "starColor": "#EXTRACT",
      "emptyStarColor": "#EXTRACT",
      "countFontSize": "EXTRACT_px",
      "countColor": "#EXTRACT"
    }
  }
}
```

### TASK 3.7: Product Grid Specs
```json
{
  "productGrid": {
    "columns": {
      "desktop": "EXTRACT_NUMBER",
      "tablet": "EXTRACT_NUMBER",
      "mobile": "EXTRACT_NUMBER"
    },
    "gap": "EXTRACT_px",
    "rowGap": "EXTRACT_px",
    "maxWidth": "EXTRACT_px"
  }
}
```

### TASK 3.8: Value Props Specs
```json
{
  "valueProps": {
    "backgroundColor": "#EXTRACT",
    "paddingY": "EXTRACT_px",
    "columns": "EXTRACT_NUMBER",
    "gap": "EXTRACT_px",
    "item": {
      "iconContainer": {
        "size": "EXTRACT_px",
        "backgroundColor": "#EXTRACT",
        "borderRadius": "EXTRACT_px"
      },
      "iconInner": {
        "size": "EXTRACT_px",
        "backgroundColor": "#EXTRACT",
        "borderRadius": "EXTRACT_px"
      },
      "icon": {
        "size": "EXTRACT_px",
        "color": "#EXTRACT"
      },
      "title": {
        "fontSize": "EXTRACT_px",
        "fontWeight": "EXTRACT",
        "color": "#EXTRACT",
        "marginTop": "EXTRACT_px"
      },
      "description": {
        "fontSize": "EXTRACT_px",
        "color": "#EXTRACT",
        "marginTop": "EXTRACT_px"
      }
    },
    "items": [
      { "title": "EXTRACT", "description": "EXTRACT", "icon": "truck|headphones|refresh" },
      { "title": "EXTRACT", "description": "EXTRACT", "icon": "..." },
      { "title": "EXTRACT", "description": "EXTRACT", "icon": "..." }
    ]
  }
}
```

### TASK 3.9: Footer Specs
```json
{
  "footer": {
    "height": "EXTRACT_px",
    "backgroundColor": "#EXTRACT",
    "paddingTop": "EXTRACT_px",
    "paddingBottom": "EXTRACT_px",
    "paddingX": "EXTRACT_px",
    "textColor": "#EXTRACT",
    "linkColor": "#EXTRACT",
    "linkHoverColor": "#EXTRACT",
    "columns": "EXTRACT_NUMBER",
    "columnGap": "EXTRACT_px",
    "logo": {
      "text": "EXTRACT",
      "fontSize": "EXTRACT_px",
      "fontWeight": "EXTRACT"
    },
    "address": {
      "label": "EXTRACT",
      "value": "EXTRACT"
    },
    "contact": {
      "phone": "EXTRACT",
      "email": "EXTRACT"
    },
    "linkSections": [
      {
        "title": "EXTRACT",
        "links": ["EXTRACT", "EXTRACT", "EXTRACT"]
      }
    ],
    "socialIcons": {
      "size": "EXTRACT_px",
      "gap": "EXTRACT_px",
      "icons": ["facebook", "instagram", "twitter", "linkedin", "youtube"]
    },
    "copyright": {
      "text": "EXTRACT_FULL_TEXT",
      "fontSize": "EXTRACT_px",
      "color": "#EXTRACT"
    },
    "divider": {
      "color": "#EXTRACT",
      "marginTop": "EXTRACT_px",
      "marginBottom": "EXTRACT_px"
    }
  }
}
```

---

## PHASE 4: ASSET EXPORT

### TASK 4.1: Export Hero Shoe Image
Use Figma MCP to export:

```
Tool: get_images
Parameters: {
  fileKey: "JRzzLjCpKp7XIHfo65SC90",
  ids: ["NODE_ID_OF_HERO_SHOE"],
  format: "png",
  scale: 2
}
```

Save as: `/public/images/hero-shoe.png`

### TASK 4.2: Export Product Images
For each product shoe image:

```
Tool: get_images
Parameters: {
  fileKey: "JRzzLjCpKp7XIHfo65SC90",
  ids: ["NODE_ID_1", "NODE_ID_2", ...],
  format: "png",
  scale: 2
}
```

Save as: `/public/images/shoe-1.png`, `/public/images/shoe-2.png`, etc.

### TASK 4.3: Export Logo
If the logo is an SVG or image:

```
Tool: get_images
Parameters: {
  fileKey: "JRzzLjCpKp7XIHfo65SC90",
  ids: ["NODE_ID_OF_LOGO"],
  format: "svg"
}
```

Save as: `/public/images/logo.svg`

### TASK 4.4: Export Any Other Icons/Assets
Identify and export any custom icons or images that aren't from Lucide.

---

## PHASE 5: GENERATE OUTPUT FILES

### TASK 5.1: Create tokens.json
Compile all extracted tokens into `/design-system/tokens.json`:

```json
{
  "colors": { ... },
  "typography": { ... },
  "spacing": { ... },
  "borderRadius": { ... },
  "shadows": { ... }
}
```

### TASK 5.2: Create components.json
Compile all component specs into `/design-system/components.json`:

```json
{
  "page": { ... },
  "promoBanner": { ... },
  "header": { ... },
  "hero": { ... },
  "tabFilter": { ... },
  "productCard": { ... },
  "productGrid": { ... },
  "valueProps": { ... },
  "footer": { ... }
}
```

### TASK 5.3: Create tailwind-extend.json
Generate Tailwind-compatible config:

```json
{
  "colors": {
    "promo-banner": "#extracted",
    "footer-bg": "#extracted",
    "page-bg": "#extracted",
    "sale-red": "#extracted",
    "btn-dark": "#extracted",
    "btn-accent": "#extracted",
    "star-yellow": "#extracted"
  },
  "spacing": {
    "18": "4.5rem",
    "88": "22rem"
  },
  "borderRadius": {
    "btn": "5px",
    "card": "4px"
  },
  "fontFamily": {
    "sans": ["extracted-font", "system-ui", "sans-serif"]
  }
}
```

### TASK 5.4: Update MASTER_SPEC.md
Replace all placeholder values in MASTER_SPEC.md with extracted values.

---

## PHASE 6: EXTRACT INTERACTION/ANIMATION SPECS

### TASK 6.1: Check Prototype Interactions
If the Figma file has prototyping:

```
Tool: get_file
Parameters: { fileKey: "JRzzLjCpKp7XIHfo65SC90", depth: 2 }
```

Look for:
- Transition types (dissolve, slide, push)
- Transition duration
- Easing curves
- Trigger types (on click, on hover)

Document in `/design-system/interactions.json`:

```json
{
  "transitions": {
    "pageTransition": {
      "type": "dissolve",
      "duration": "300ms",
      "easing": "ease-out"
    },
    "buttonHover": {
      "scale": 1.02,
      "duration": "150ms"
    },
    "cardHover": {
      "shadow": "elevated",
      "duration": "200ms"
    }
  },
  "pageLoadSequence": [
    { "element": "promoBanner", "animation": "fadeIn", "delay": 0, "duration": 400 },
    { "element": "header", "animation": "slideDown", "delay": 200, "duration": 500 },
    { "element": "hero", "animation": "fadeInUp", "delay": 400, "duration": 600 },
    { "element": "tabs", "animation": "slideInLeft", "delay": 600, "duration": 400 },
    { "element": "products", "animation": "staggerFadeInUp", "delay": 800, "duration": 500 }
  ]
}
```

---

## PHASE 7: PRODUCT DATA EXTRACTION

### TASK 7.1: Extract Product Information
From the product cards in Figma, extract:

```json
{
  "products": [
    {
      "name": "EXTRACT_FROM_FIGMA",
      "price": "EXTRACT_NUMBER",
      "salePrice": "EXTRACT_OR_NULL",
      "rating": "EXTRACT_NUMBER",
      "reviewCount": "EXTRACT_NUMBER",
      "category": "new-arrivals|trending",
      "isOnSale": "true|false",
      "imageFile": "shoe-1.png"
    }
  ]
}
```

---

## VALIDATION CHECKLIST

Before signaling completion, verify:

- [ ] All colors extracted (compare visually with Figma)
- [ ] All typography styles captured
- [ ] All spacing values measured
- [ ] All component dimensions recorded
- [ ] All images exported at 2x resolution
- [ ] tokens.json is valid JSON
- [ ] components.json is valid JSON
- [ ] tailwind-extend.json is valid JSON
- [ ] MASTER_SPEC.md updated with real values (no placeholders remain)
- [ ] All node IDs documented for other agents to reference

---

## OUTPUT

When complete:

1. Verify all files created:
```bash
ls -la /design-system/
ls -la /public/images/
```

2. Signal completion:
```bash
git checkout -b feature/figma-extraction
git add .
git commit -m "figma: Extract all design tokens, component specs, and assets from Figma"
touch .done-figma-extraction
git add .done-figma-extraction
git commit -m "figma: Signal completion"
git push origin feature/figma-extraction
```

---

## CRITICAL NOTES FOR PIXEL-PERFECT REPLICATION

1. **Always use exact values** - Never round or approximate. If Figma shows 41px, use 41px.

2. **Color precision** - Use full 6-digit hex codes. Convert any RGBA to hex with opacity handled via Tailwind's opacity utilities.

3. **Typography accuracy** - Match font-family, size, weight, line-height, and letter-spacing exactly.

4. **Spacing fidelity** - Measure all padding, margin, and gap values. Use Tailwind arbitrary values `[Xpx]` when needed.

5. **Asset quality** - Export all images at 2x scale for retina displays.

6. **Document everything** - Other agents depend on your extraction. Be thorough.

---

## NEXT AGENT DEPENDENCY

After this agent completes, the following agents can begin:
- Agent 1: DATABASE (uses product data)
- Agent 2: LAYOUT (uses component specs)
- Agent 3: COMPONENTS (uses component specs)
- Agent 4: EXPERIMENTAL (uses hero specs)

All agents will read from `/design-system/` files you create.
