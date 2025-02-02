        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
              e.preventDefault();
              document.querySelector(this.getAttribute('href')).scrollIntoView({
                  behavior: 'smooth'
              });
          });
      });
        // GSAP animations
        gsap.from('.hero-section h1', {
          duration: 1,
          y: 50,
          opacity: 0,
          ease: 'power3.out'
      });

      gsap.from('.hero-section p', {
          duration: 1,
          y: 30,
          opacity: 0,
          delay: 0.3,
          ease: 'power3.out'
      });

      gsap.from('.hero-section button', {
          duration: 1,
          y: 30,
          opacity: 0,
          delay: 0.6,
          ease: 'power3.out',
          stagger: 0.2
      });

      // Animate features on scroll
      const animateOnScroll = (elements, animation) => {
          const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                  if (entry.isIntersecting) {
                      gsap.from(entry.target, animation);
                      observer.unobserve(entry.target);
                  }
              });
          });

          elements.forEach(element => observer.observe(element));
      };

      animateOnScroll(document.querySelectorAll('.glass'), {
          duration: 0.8,
          y: 30,
          opacity: 0,
          ease: 'power3.out',
          stagger: 0.2
      });