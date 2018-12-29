  jQuery(document).bind('contextmenu', function (e) {
      e.preventDefault();
  });

  jQuery(document).keydown(function (event) {
      if (event.keyCode == 123) { // Prevent press F12
          return false;
      } else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {
          return false;
      }
  });
export const environment = {
  production: true,
  REST_URL: 'http://52.9.187.80/v2',
  // REST_URL: 'http://13.56.129.168',
  REST_X_URL :'http://52.9.187.80:8080'
};
