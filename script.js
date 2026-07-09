document.addEventListener('DOMContentLoaded', function() {
	initThemeToggle();
	initScrollProgress();
	initScrollToTop();
	initNavigation();
	initContactForm();
	initMenuToggle();
});

// Mobile menu toggle
function initMenuToggle() {
	const menuBars = document.getElementById('menu-bars');
	const header = document.querySelector('header');

	if (!menuBars) return;

	menuBars.addEventListener('click', () => {
		header.classList.toggle('active');
		menuBars.classList.toggle('fa-times');
		document.body.style.overflow = header.classList.contains('active') ? 'hidden' : '';
	});

	document.querySelectorAll('.nav-item').forEach(item => {
		item.addEventListener('click', () => {
			if (window.innerWidth <= 768) {
				header.classList.remove('active');
				menuBars.classList.remove('fa-times');
				document.body.style.overflow = '';
			}
		});
	});
}

// Theme toggle
function initThemeToggle() {
	const themeToggle = document.querySelector('.theme-toggle');
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
	const savedTheme = localStorage.getItem('theme');

	const applyTheme = (theme) => {
		if (theme === 'dark') {
			document.documentElement.setAttribute('data-theme', 'dark');
			if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
		} else {
			document.documentElement.removeAttribute('data-theme');
			if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
		}
	};

	if (savedTheme) {
		applyTheme(savedTheme);
	} else if (prefersDark.matches) {
		applyTheme('dark');
	}

	if (themeToggle) {
		themeToggle.addEventListener('click', () => {
			const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
			const next = isDark ? 'light' : 'dark';
			applyTheme(next);
			localStorage.setItem('theme', next);
		});
	}
}

// Scroll progress bar
function initScrollProgress() {
	const progressBar = document.querySelector('.scroll-progress-bar');
	if (!progressBar) return;

	window.addEventListener('scroll', () => {
		const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
		const scrolled = windowHeight > 0 ? (window.scrollY / windowHeight) * 100 : 0;
		progressBar.style.width = `${scrolled}%`;
	});
}

// Scroll to top
function initScrollToTop() {
	const scrollButton = document.querySelector('.scroll-top');
	if (!scrollButton) return;

	window.addEventListener('scroll', () => {
		scrollButton.classList.toggle('visible', window.scrollY > 500);
	});

	scrollButton.addEventListener('click', () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});
}

// Navigation: smooth scroll + active state on scroll
function initNavigation() {
	const navItems = document.querySelectorAll('.nav-item');
	const sections = document.querySelectorAll('main section');

	navItems.forEach(item => {
		item.addEventListener('click', (e) => {
			const targetId = item.getAttribute('data-target');
			const targetSection = document.getElementById(targetId);
			if (!targetSection) return;

			e.preventDefault();
			navItems.forEach(nav => nav.classList.remove('active'));
			item.classList.add('active');

			const targetPosition = targetSection.offsetTop - 40;
			window.scrollTo({ top: targetPosition, behavior: 'smooth' });
		});
	});

	window.addEventListener('scroll', () => {
		let current = '';
		sections.forEach(section => {
			if (window.scrollY >= section.offsetTop - 200) {
				current = section.getAttribute('id');
			}
		});

		navItems.forEach(item => {
			item.classList.toggle('active', item.getAttribute('data-target') === current);
		});
	});
}

// Contact form
function initContactForm() {
	const contactForm = document.getElementById('contact-form');
	if (!contactForm) return;

	contactForm.addEventListener('submit', async (e) => {
		e.preventDefault();

		const submitBtn = contactForm.querySelector('button[type="submit"]');
		const originalText = submitBtn.innerHTML;

		submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
		submitBtn.disabled = true;

		try {
			// Simulate submission — wire this up to a real endpoint or form service.
			await new Promise(resolve => setTimeout(resolve, 1200));
			showNotification("Message sent. I'll get back to you soon.", 'success');
			contactForm.reset();
		} catch (error) {
			showNotification('Something went wrong — please try again.', 'error');
		} finally {
			submitBtn.innerHTML = originalText;
			submitBtn.disabled = false;
		}
	});
}

// Notification toast
function showNotification(message, type = 'info') {
	const notification = document.createElement('div');
	notification.className = `notification ${type}`;
	notification.innerHTML = `
		<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
		<span>${message}</span>
	`;

	document.body.appendChild(notification);
	setTimeout(() => notification.classList.add('show'), 10);
	setTimeout(() => {
		notification.classList.remove('show');
		setTimeout(() => notification.remove(), 300);
	}, 5000);
}

// Smooth scroll for any other in-page anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function(e) {
		const href = this.getAttribute('href');
		if (href === '#' || this.classList.contains('nav-item')) return;

		const targetElement = document.querySelector(href);
		if (targetElement) {
			e.preventDefault();
			const targetPosition = targetElement.offsetTop - 40;
			window.scrollTo({ top: targetPosition, behavior: 'smooth' });
		}
	});
});

// Notification styles (injected once)
const style = document.createElement('style');
style.textContent = `
	.notification {
		position: fixed;
		top: 2rem;
		right: 2rem;
		background-color: var(--bg-raised);
		color: var(--ink);
		padding: 1.5rem 2rem;
		border-radius: var(--radius-sm);
		box-shadow: var(--shadow);
		display: flex;
		align-items: center;
		gap: 1rem;
		z-index: 10000;
		transform: translateX(150%);
		transition: transform 0.3s ease;
		border-left: 3px solid var(--ink);
		max-width: 360px;
		font-size: 1.45rem;
	}
	.notification.show { transform: translateX(0); }
	.notification.success { border-left-color: var(--accent-2); }
	.notification.error { border-left-color: var(--accent); }
	.notification i { font-size: 1.8rem; }
	.notification.success i { color: var(--accent-2); }
	.notification.error i { color: var(--accent); }
`;
document.head.appendChild(style);