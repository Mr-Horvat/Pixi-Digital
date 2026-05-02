// Navigation scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Mobile burger menu
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav__links a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// Privacy Policy Modal
const privacyModal   = document.getElementById('privacyModal');
const openModalBtn   = document.getElementById('openPrivacyModal');
const closeModalBtn  = document.getElementById('closePrivacyModal');
const acceptModalBtn = document.getElementById('acceptPrivacy');
const privacyCheckbox = document.getElementById('privacy');
const submitBtn      = document.getElementById('submitBtn');

function openModal() { privacyModal.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal() { privacyModal.classList.remove('open'); document.body.style.overflow = ''; }

openModalBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);

acceptModalBtn.addEventListener('click', () => {
  privacyCheckbox.checked = true;
  submitBtn.disabled = false;
  closeModal();
});

privacyModal.addEventListener('click', e => {
  if (e.target === privacyModal) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && privacyModal.classList.contains('open')) closeModal();
});

// Enable/disable submit based on checkbox
privacyCheckbox.addEventListener('change', () => {
  submitBtn.disabled = !privacyCheckbox.checked;
});

// Contact form
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', async e => {
  e.preventDefault();

  let valid = true;

  form.querySelectorAll('[required]').forEach(field => {
    field.classList.remove('error');
    const isEmpty = field.type === 'checkbox' ? !field.checked : !field.value.trim();
    if (isEmpty) {
      field.classList.add('error');
      valid = false;
    }
  });

  const emailField = form.querySelector('#email');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
    emailField.classList.add('error');
    valid = false;
  }

  if (!valid) {
    form.querySelector('.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending …';

  const payload = {
    name:    form.querySelector('#name').value.trim(),
    email:   emailField.value.trim(),
    message: form.querySelector('#message').value.trim(),
    service: form.querySelector('#service').value,
    budget:  form.querySelector('#budget').value,
  };

  try {
    const response = await fetch('https://hook.eu1.make.com/1ygkrxwp469r6g9ccnttnslmf8v4kak4', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      form.reset();
      privacyCheckbox.checked = false;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Send Message &nbsp;&#10148;';
      formSuccess.style.display = 'block';
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
    } else {
      throw new Error();
    }
  } catch {
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Send Message &nbsp;&#10148;';
    alert('Something went wrong. Please try again or email us directly.');
  }
});

form.querySelectorAll('input, select, textarea').forEach(field => {
  field.addEventListener('input', () => field.classList.remove('error'));
});

// Scroll animation
const animObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

const animTargets = document.querySelectorAll(
  '.service-card, .portfolio-card, .value-item, .about__card'
);

animTargets.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity 0.55s ease ${i * 0.07}s, transform 0.55s ease ${i * 0.07}s`;
  animObserver.observe(el);
});
