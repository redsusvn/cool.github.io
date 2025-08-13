setTimeout(function() {
  const searchForm = document.querySelector('form[action="https://ifastnet.com/portal/domainchecker.php"]');
  if (searchForm) {
    const searchDiv = searchForm.closest('.panel.panel-widget'); 
    if (searchDiv && searchDiv.parentNode) {
      searchDiv.parentNode.remove();
    }
  }
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.remove();
  }
}, 4000);
