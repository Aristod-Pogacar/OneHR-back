
document.querySelectorAll('td[data-maxlength]').forEach(td => {
  const maxLength = parseInt(td.dataset.maxlength);
  const fullText = td.textContent.trim();

  if (fullText.length > maxLength) {
    td.textContent = fullText.substring(0, maxLength) + '...';
    td.title = fullText;
  }
});
