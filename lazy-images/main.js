function generateFakeImages(size) {
  return new Array(size).fill('').map((_, index) => {
    const id = index + 1;
    const src = `./placeholder-200x200.png`;
    const image = document.createElement('img');

    image.src = src;
    image.dataset.src = `https://robohash.org/${id}?200x200`;
    image.classList.add('lazy-image');
    return image;
  });
}

function loadImages(container) {
  const fakeImages = generateFakeImages(10);
  fakeImages.forEach((image) => {
    const div = document.createElement('div');
    div.classList.add('image-container');

    div.appendChild(image);
    container.appendChild(div);
  });
}

function handleIntersect(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const lazyImage = entry.target;
      lazyImage.src = lazyImage.dataset.src;

      // unobserve lazyImage
      observer.unobserve(lazyImage);
    }
  });
}

function createObserver(callback) {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  };

  const observer = new IntersectionObserver(callback, options);
  return observer;
}

document.addEventListener('DOMContentLoaded', function () {
  loadImages(document.getElementById('root'));
});

window.addEventListener('load', function () {
  const observer = createObserver(handleIntersect);
  Array.from(document.querySelectorAll('.lazy-image')).forEach((element) => {
    observer.observe(element);
  });
});
