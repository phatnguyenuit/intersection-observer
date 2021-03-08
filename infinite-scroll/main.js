var state = {
  page: 0,
  pageSize: 10,
  prevY: 0,
};

function setState(shapeOfState) {
  this.state = {
    // @ts-ignore
    ...this.state,
    ...shapeOfState,
  };
}

function generateItems(page = 0, pageSize = 10) {
  return new Array(pageSize).fill('').map((_, index) => {
    const id = page * pageSize + (index + 1);
    return `Paragraph id: ${id}`;
  });
}

function fetchItems(page = 0, pageSize = 10) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(generateItems(page, pageSize));
    }, 3000),
  );
}

function loadMore(page, pageSize, container) {
  fetchItems(page, pageSize).then((items) => {
    items.forEach((item) => {
      const p = document.createElement('p');
      p.innerHTML = item;
      p.classList.add('item');
      container.appendChild(p);
    });
  });
}

function createObserver(callback) {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 1,
  };

  const observer = new IntersectionObserver(callback.bind(window), options);
  return observer;
}

window.addEventListener('load', function () {
  const root = document.getElementById('root');
  const loadMoreSection = document.getElementById('load-more');
  const dots = document.getElementById('dots');

  const observer = createObserver(function (entries) {
    const y = entries[0].boundingClientRect.y;
    if (this.state.prevY > y) {
      const { page, pageSize } = this.state;
      const nextPage = page + 1;

      this.setState({
        page: nextPage,
      });
      loadMore(nextPage, pageSize, root);
    }
    this.setState({
      prevY: y,
    });
  });
  observer.observe(loadMoreSection);

  const { page, pageSize } = this.state;
  loadMore(page, pageSize, root);

  let loadingDotSize = 1;
  setInterval(function () {
    dots.textContent = '.'.repeat(loadingDotSize);
    if (loadingDotSize < 10 && loadingDotSize > 0) {
      loadingDotSize += 1;
    } else {
      loadingDotSize = 1;
    }
  }, 300);
});
