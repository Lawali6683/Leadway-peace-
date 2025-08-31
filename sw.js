self.addEventListener('push', function(event) {
  const options = {
    body: event.data.text(),
    icon: 'https://i.imgur.com/8f9sU7t.png', 
    badge: 'https://i.imgur.com/8f9sU7t.png' 
  };
  event.waitUntil(
    self.registration.showNotification('LPFHRA Notification', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://leadwaypeace.page.div')
  );
});