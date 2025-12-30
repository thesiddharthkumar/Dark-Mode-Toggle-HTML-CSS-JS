document.addEventListener('DOMContentLoaded', () => {
	const toggleInput = document.querySelector('.toggle .input');
	const rootElement = document.documentElement;
	const hamburgerBtn = document.getElementById('hamburger');
	const navMenu = document.getElementById('nav-menu');
	const header = document.getElementById('header');

	const applyTheme = (isDark) => {
		if (isDark) {
			rootElement.classList.add('dark-theme');
			rootElement.setAttribute('data-theme', 'dark');
		} else {
			rootElement.classList.remove('dark-theme');
			rootElement.setAttribute('data-theme', 'light');
		}
	};

	const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
	toggleInput.checked = prefersDark;
	applyTheme(prefersDark);

	toggleInput.addEventListener('input', (event) => {
		const isDark = toggleInput.checked;

		let x = window.innerWidth / 2;
		let y = window.innerHeight / 2;
		
		const toggleElement = document.querySelector('.toggle');
		
		if (toggleElement) {
			const rect = toggleElement.getBoundingClientRect();
			x = rect.left + rect.width / 2;
			y = rect.top + rect.height / 2;
		}

		if (!document.startViewTransition) {
			applyTheme(isDark);
			return;
		}

		const transition = document.startViewTransition(() => {
			applyTheme(isDark);
		});

		transition.ready.then(() => {
			rootElement.style.setProperty('--x', `${x}px`);
			rootElement.style.setProperty('--y', `${y}px`);
		}).catch(error => {
			console.error("Error during View Transition setup:", error);
		});
	});

	hamburgerBtn.addEventListener('click', () => {
		hamburgerBtn.classList.toggle('active');
		navMenu.classList.toggle('active');
		
		document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
	});

	document.querySelectorAll('.nav-list a').forEach(link => {
		link.addEventListener('click', () => {
			hamburgerBtn.classList.remove('active');
			navMenu.classList.remove('active');
			document.body.style.overflow = '';
		});
	});

	let lastScrollY = window.scrollY;
	
	const handleScroll = () => {
		if (window.scrollY > 50) {
			header.classList.add('scrolled');
		} else {
			header.classList.remove('scrolled');
		}
		
		const scrolled = window.pageYOffset;
		const parallax = document.querySelector('.home-overlay');
		if (parallax) {
			parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
		}
		
		lastScrollY = window.scrollY;
	};

	window.addEventListener('scroll', handleScroll);

	const observerOptions = {
		threshold: 0.1,
		rootMargin: '0px 0px -50px 0px'
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.style.animation = `fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
				observer.unobserve(entry.target);
			}
		});
	}, observerOptions);

	document.querySelectorAll('.home-content > *').forEach(el => {
		el.style.opacity = '0';
		observer.observe(el);
	});

	document.querySelectorAll('.btn').forEach(button => {
		button.addEventListener('click', function(e) {
			const ripple = document.createElement('span');
			const rect = this.getBoundingClientRect();
			const size = Math.max(rect.width, rect.height);
			const x = e.clientX - rect.left - size / 2;
			const y = e.clientY - rect.top - size / 2;
			
			ripple.style.cssText = `
				position: absolute;
				border-radius: 50%;
				background: rgba(255, 255, 255, 0.6);
				transform: scale(0);
				animation: ripple 0.6s linear;
				width: ${size}px;
				height: ${size}px;
				left: ${x}px;
				top: ${y}px;
				pointer-events: none;
			`;
			
			this.appendChild(ripple);
			
			setTimeout(() => {
				ripple.remove();
			}, 600);
		});
	});

	const style = document.createElement('style');
	style.textContent = `
		@keyframes ripple {
			to {
				transform: scale(4);
				opacity: 0;
			}
		}
		.btn {
			position: relative;
			overflow: hidden;
		}
	`;
	document.head.appendChild(style);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		e.preventDefault();
		const target = document.querySelector(this.getAttribute('href'));
		if (target) {
			target.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}
	});
});