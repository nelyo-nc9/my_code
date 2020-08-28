// action是地址 data 是接口需要的传参
export const postDownLoadFile = function (options) {
  let config = { method: 'post', ...options };
  let $iframe = document.getElementById('down-file-iframe');
  if (!$iframe) {
    $iframe = document.createElement('iframe');
  }
  let $form = document.createElement('form');
  $form.setAttribute('target', 'down-file-iframe');
  $form.setAttribute('method', config.method);
  $form.setAttribute('action', window.location.origin + '/api' + config.action);
  for (var key in config.data) {
    let $input = document.createElement('input');
    $input.setAttribute('type', 'hidden');
    $input.setAttribute('name', key);
    $input.setAttribute('value', config.data[key]);
    $form.appendChild($input);
  }
  $iframe.appendChild($form);
  document.body.appendChild($iframe);
  $iframe.getElementsByTagName('form')[0].submit();
  document.body.removeChild($iframe);
}
