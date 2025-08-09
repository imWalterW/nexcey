# Nexcey Web Design Service Website

A modern, responsive website built with HTML, CSS, JavaScript, and Netlify CMS for easy content management.

![Nexcey Website Preview](assets/images/website-preview.png)

## 🌟 Features

- ✅ **Fully Responsive Design** - Perfect on all devices
- ✅ **Netlify CMS Integration** - Easy content management without coding
- ✅ **Customizable Theme** - Change colors and branding via admin panel
- ✅ **Auto Carousel System** - Automatically creates carousels when content exceeds display limits
- ✅ **Professional Animations** - Smooth hover effects and scroll animations
- ✅ **SEO Optimized** - Proper meta tags and semantic HTML
- ✅ **Fast Loading** - Optimized assets and minimal dependencies
- ✅ **Contact Form** - Integrated contact form with validation

## 🚀 Quick Start

### Prerequisites
- Git installed on your computer
- GitHub account
- Netlify account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/nexcey-website.git
   cd nexcey-website
   ```

2. **Install dependencies (optional, for local development)**
   ```bash
   npm install
   ```

3. **Local development server**
   ```bash
   npm run dev
   ```
   Opens the site at `http://localhost:3000`

### Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Netlify**
   - Connect your GitHub repository to Netlify
   - Enable Netlify Identity
   - Enable Git Gateway
   - Access admin panel at `yoursite.netlify.app/admin/`

## 📁 File Structure

```
nexcey-website/
├── index.html              # Main website file
├── netlify.toml            # Netlify configuration
├── package.json            # Project dependencies
├── admin/
│   ├── index.html          # CMS admin interface
│   └── config.yml          # CMS configuration
├── assets/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   └── script.js       # Site functionality
│   └── images/             # All images and uploads
└── _data/                  # CMS data files (JSON)
    ├── theme.json          # Colors, logo, favicon
    ├── hero.json           # Main banner content
    ├── about.json          # About section
    ├── services.json       # Services with icons
    ├── pricing.json        # Pricing plans
    ├── clients.json        # Client showcase
    ├── testimonials.json   # Customer reviews
    └── footer.json         # Footer & contact info
```

## 🎨 Customization

### Via Admin Panel (Recommended)
1. Visit `yourwebsite.com/admin/`
2. Log in with admin credentials
3. Edit any section through the user-friendly interface

### Manual Editing
Edit JSON files in the `_data/` folder:

- **Theme**: `_data/theme.json` - Colors, logo, favicon
- **Hero**: `_data/hero.json` - Main headline and CTA
- **About**: `_data/about.json` - About section content
- **Services**: `_data/services.json` - Services list with FontAwesome icons
- **Pricing**: `_data/pricing.json` - Pricing plans (can mark one as "popular")
- **Clients**: `_data/clients.json` - Client logos and website screenshots
- **Testimonials**: `_data/testimonials.json` - Customer reviews with photos
- **Footer**: `_data/footer.json` - Contact info and social media links

## 🔧 Available Scripts

- `npm run dev` - Start local development server
- `npm run serve` - Serve the site for testing
- `npm run validate` - Validate HTML and JSON files
- `npm run optimize` - Optimize images for web
- `npm run deploy` - Deploy to Netlify

## 📱 Responsive Behavior

- **Services**: Shows 4 per row on desktop, becomes carousel if more than 4 services
- **Pricing**: Shows 3 plans per row, becomes carousel if more than 3 plans
- **Clients**: Shows 3 per row, becomes carousel if more than 3 clients
- **Testimonials**: Shows 3 per row, becomes carousel if more than 3 testimonials

All carousels include:
- Auto-play functionality (4-second intervals)
- Navigation arrows
- Pause on hover
- Touch/swipe support on mobile

## 🎯 CMS Features

### Content Management
- **Visual Editor** for all text content
- **Image Upload** with automatic optimization
- **Color Picker** for theme customization
- **Icon Selection** for services (FontAwesome icons)
- **Toggle Options** for marking popular pricing plans

### Media Management
- Automatic image resizing and optimization
- Organized media library
- Support for various image formats
- CDN delivery via Netlify

## 🔒 Security Features

- **Netlify Identity** authentication for admin access
- **Git Gateway** for secure CMS operations
- **HTTPS** enforced on all pages
- **Security headers** configured in netlify.toml
- **XSS protection** and content security policies

## 🌐 Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🆘 Troubleshooting

### Common Issues

**CMS not loading?**
- Ensure Netlify Identity is enabled
- Check Git Gateway is configured
- Verify admin account is set up

**Images not displaying?**
- Check file paths are correct
- Ensure images are uploaded to correct folders
- Verify image file extensions match JSON references

**Styles not applying?**
- Clear browser cache
- Check CSS file is loading correctly
- Verify Netlify deployment completed successfully

### Getting Help

1. Check the [Issues](https://github.com/YOUR_USERNAME/nexcey-website/issues) page
2. Review Netlify deployment logs
3. Validate JSON files for syntax errors
4. Test in incognito/private browsing mode

## 📄 License

MIT License - feel free to use this template for your projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Email: info@nexcey.com
- Website: [nexcey.com](https://nexcey.com)
- GitHub Issues: [Report a bug](https://github.com/YOUR_USERNAME/nexcey-website/issues)

---

Built with ❤️ by [Nexcey Web Design Service](https://nexcey.com)
