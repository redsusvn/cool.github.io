const searchDiv = document.querySelector('form[action="https://ifastnet.com/portal/domainchecker.php"]').parentNode;
if (searchDiv && searchDiv.parentNode) {
  searchDiv.parentNode.remove();
}
