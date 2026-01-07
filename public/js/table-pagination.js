document.addEventListener('DOMContentLoaded', function () {
  const rows = document.querySelectorAll('.card-content table tbody tr');
  const paginationContainer = document.querySelector('.table-pagination .buttons');
  const smallText = document.querySelector('.table-pagination small');
  const tablePagination = document.querySelector('.table-pagination');

  const rowsPerPage = 10;
  const totalRows = rows.length;
  const pageCount = Math.ceil(totalRows / rowsPerPage);
  let currentPage = 1;
  const maxVisiblePages = 5;

  if (!rows.length || !paginationContainer || !smallText) return;

  // ✅ Afficher les lignes
  function displayRows(page) {
    currentPage = page;

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    rows.forEach((row, index) => {
      row.style.display = index >= start && index < end ? '' : 'none';
    });

    renderPagination();
  }

  // ✅ Générer la pagination conforme à ton HTML
  function renderPagination() {
    paginationContainer.innerHTML = '';
    smallText.textContent = `Page ${currentPage} of ${pageCount}`;

    // ⬅ Bouton précédent
    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'button';
    prevBtn.innerHTML = '&lt;';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => displayRows(currentPage - 1));
    paginationContainer.appendChild(prevBtn);

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pageCount, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // ✅ Première page + ...
    if (startPage > 1) {
      addPageButton(1);
      if (startPage > 2) addDots();
    }

    // ✅ Pages visibles
    for (let i = startPage; i <= endPage; i++) {
      addPageButton(i);
    }

    // ✅ Dernière page + ...
    if (endPage < pageCount) {
      if (endPage < pageCount - 1) addDots();
      addPageButton(pageCount);
    }

    // ➡ Bouton suivant
    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'button';
    nextBtn.innerHTML = '&gt;';
    nextBtn.disabled = currentPage === pageCount;
    nextBtn.addEventListener('click', () => displayRows(currentPage + 1));
    paginationContainer.appendChild(nextBtn);
  }

  function addPageButton(page) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button';
    button.textContent = page;

    if (page === currentPage) {
      button.classList.add('active');
    }

    button.addEventListener('click', () => displayRows(page));
    paginationContainer.appendChild(button);
  }

  function addDots() {
    const dots = document.createElement('span');
    dots.textContent = '...';
    dots.style.padding = '0 6px';
    paginationContainer.appendChild(dots);
  }

  // ✅ Initialisation
  if (totalRows > rowsPerPage) {
    displayRows(1);
  } else {
    tablePagination.style.display = 'none';
  }
});
